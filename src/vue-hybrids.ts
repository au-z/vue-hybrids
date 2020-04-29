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

function mapPropsFromHost(host, props) {
	const propsData = {}
	for(let propName in props) propsData[propName] = host[propName]
	return propsData
}

function vueify(defn: ComponentDefn, props: any, shadowStyles?: string[]) {
	return render((host) => {
		return (host, target) => {
			/* define proxies for custom events */
			const proxies = defn.events && Object.keys(defn.events).reduce((proxies, key) => {
				proxies[key] = (detail) => dispatch(host, key, {detail, bubbles: true})
				return proxies
			}, {})

			const style = shadowStyles?.join("\n/*------*/\n")

			const wrapper = new Vue({
				name: 'shadow-root',
				data() {
					return {
						props: mapPropsFromHost(host, props),
						slotChildren: [],
					}
				},
				customElement: host,
				shadowRoot: target,
				render(h) {
					return h(defn, {
						ref: 'inner',
						props: this.props,
						on: {...proxies},
						attrs: {'data-vhname': defn.name},
					}, this.slotChildren)
				},
			} as any)

			/* observe and assign slot content */
			const observer = new MutationObserver(assignSlotChildren.bind(host))
			observer.observe(host, {childList: true, subtree: true, characterData: true})
			assignSlotChildren.call(host, wrapper)

			/* mount the shadow root wrapper */
			wrapper.$mount()

			const prev = (target as any).querySelector(`[data-vhname='${defn.name}']`)
			if(prev) {
				target.replaceChild(wrapper.$el, prev)
			} else {
				target.appendChild(wrapper.$el)
			}

			/* Add shadow DOM styling */
			shadowStyles && html``.style(...shadowStyles)(host, target)
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
		_propKeys: Object.keys(props),
		...props,
		name: defn.name,
		version: defn.version,
		render: vueify(defn, props, shadowStyles),
	} as Hybrids<VueConvertedComponent>

	hybridDefine(defn.name, hybrid)

	return defn
}