import Vue from 'vue'
import {render, html, property, Hybrids, define as hybridDefine, dispatch} from 'hybrids'
import {toVNodes} from './utils'

interface ComponentDefn {
	name?: string
	props?: string[] | Record<string, Prop>
	[key: string]: any
}

interface Prop {
	type: Function,
	required: Boolean,
	default: any,
	[key: string]: any
}

interface VueConvertedComponent extends HTMLElement {
	[key: string]: any
}

function extractProps(propsDefn: string[] | Record<string, Prop>) {
	const props = {}
	if(Array.isArray(propsDefn)) {
		propsDefn.forEach((key) => {
			props[key] = property(null)
		})
	} else if(typeof propsDefn === 'object') {
		Object.entries(propsDefn).forEach(([key, value]) => {
			if(value.type && value.type === Function) {
				props[key] = property(value.default != null ? () => value.default : (v) => v)
			} else {
				props[key] = property(value.default != null ? value.default : value.type ? value.type() : null)
			}
		})
	}
	return props
}

function assignSlotChildren(component) {
	component.slotChildren = Object.freeze(toVNodes(component.$createElement, this.childNodes))
}

function mapPropsFromHost(host) {
	const propsData = {}
	host._propKeys.forEach((key) => propsData[key] = host[key])
	return propsData
}

function vueify(defn: ComponentDefn, shadowStyles?: string[]) {
	return render((host: any) => {
		const propsData = mapPropsFromHost(host)

		/* define proxies for custom events */
		const proxies = defn.events && Object.keys(defn.events).reduce((proxies, key) => {
			proxies[key] = (detail) => dispatch(host, key, {detail, bubbles: true})
			return proxies
		}, {})

		return (host: any, target) => {
			const wrapper = new Vue({
				name: 'shadow-root',
				data() {
					return {
						props: propsData,
						slotChildren: [],
					}
				},
				render(h) {
					return h(defn, {
						ref: 'inner',
						props: this.props,
						on: {...proxies},
						attrs: {'data-vh': defn.name},
					}, this.slotChildren)
				},
			})

			/* observe and assign slot content */
			const observer = new MutationObserver(assignSlotChildren.bind(host))
			observer.observe(host, {childList: true, subtree: true, characterData: true})
			assignSlotChildren.call(host, wrapper)

			/* mount the shadow root wrapper */
			wrapper.$mount()

			const prev = (target as any).querySelector(`[data-vh='${defn.name}']`)
			if(prev) {
				target.replaceChild(wrapper.$el, prev)
			} else {
				target.appendChild(wrapper.$el)
			}

			/* Add shadow DOM styling */
			shadowStyles && html`
				${host.debugVueHybrid && host._propKeys.map((key) => html`
					<span><b>${key}</b> (${typeof host[key]}): ${JSON.stringify(host[key])}</span> <br/>
				`)}
			`.style(...shadowStyles)(host, target)
		}
	})
}

export function define(defn: ComponentDefn, ...shadowStyles: string[]): ComponentDefn {
	let props = {}

	/* map traditional props */
	if(defn.props) {
		props = {...props, ...extractProps(defn.props) }
	}

	/* map props from all mixins */
	if(defn.mixins) {
		defn.mixins.forEach((m) => props = {...props, ...extractProps(m.props)})
	}

	/* map props from extended components */
	if(defn.extend && defn.extend.props) {
		props = {...props, ...extractProps(defn.extend.props)}
	}

	const hybrid = {
		debugVueHybrid: false,
		_propKeys: Object.keys(props),
		...props,
		name: defn.name,
		version: defn.version,
		render: vueify(defn, shadowStyles),
	} as Hybrids<VueConvertedComponent>

	hybridDefine(defn.name, hybrid)

	return defn
}