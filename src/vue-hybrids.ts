import Vue from 'vue'
import {render, html, property, Hybrids, define as hybridDefine, dispatch} from 'hybrids'
import {injectHook, toVNodes} from './utils'

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

/**
 * Copies child components into slots
 * 'this' is the observed DOM node
 * @param component the component to which slotted content is assigned
 */
function assignSlotChildren(component) {
	component.slotChildren = Object.freeze(toVNodes(component.$createElement, this.childNodes))
}

function mapPropsFromHost(host) {
	const propsData = {}
	host._propKeys.forEach((key) => propsData[key] = host[key])
	return propsData
}

function vueify(defn: ComponentDefn, shadowStyles?: string[]) {

	/* proxy $emit to host DOM element */
	injectHook(defn, 'beforeCreate', function() {
		const emit = this.$emit
		this.$emit = (name, ...detail) => {
			dispatch(this.$root.$options.customElement, name, {
				detail: detail.length === 0 ? null : detail.length === 1 ? detail[0] : detail,
				bubbles: true,
				composed: true,
			})
			return emit.call(this, name, ...detail)
		}
	})

	return render((host: any) => {
		const props = mapPropsFromHost(host)

		return (host: any, target) => {
			const wrapper = new Vue({
				name: 'shadow-root',
				customElement: host,
				shadowRoot: target,
				data() {
					return {
						props,
						slotChildren: [],
					}
				},
				render(h) {
					return h(defn, {
						ref: 'inner',
						props: this.props,
						attrs: {'data-vh': defn.name},
					}, this.slotChildren)
				},
			} as any)

			/* observe and assign slot content */
			const observer = new MutationObserver(() => assignSlotChildren.call(host, wrapper))
			observer.observe(host, {childList: true, subtree: true, characterData: true, attributes: true})
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