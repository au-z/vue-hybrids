import Vue from 'vue'
import {render, html, dispatch} from 'hybrids'
import {injectHook, toVNodes} from './utils.ts'

export interface ComponentDefn {
	name: string
	props?: string[] | Record<string, Prop>
	[key: string]: any
}

export interface CustomElement extends HTMLElement {
	vhDebug: Boolean
	_propKeys?: string[]
	[key: string]: any
}

export interface VueElement extends HTMLElement {
	__vue__: any
}

export interface Prop {
	type?: Function,
	required?: Boolean,
	default?: any,
	[key: string]: any
}

/**
 * Copies child components into slots
 * 'this' is the observed host node
 * @param component the component to which slotted content are assigned
 */
function assignSlotChildren(component) {
	component.slotChildren = Object.freeze(toVNodes(component.$createElement, this.childNodes))
}

function mapPropsFromHost(host) {
	const propsData = {}
	host._propKeys?.forEach((key) => propsData[key] = host[key])
	return propsData
}

export function vueify(defn: ComponentDefn, shadowStyles?: string[], vue: any) {
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

	return render((host: CustomElement) => {
		/* Must take place in the render function so that hybrids will re-render on cache access */
		const props = mapPropsFromHost(host)
		const force = host._force

		return (host: CustomElement, target: HTMLElement | ShadowRoot | Text) => {
			let wrapper
			const prev = (target as any).querySelector(`[data-vh='${defn.name}']`)

			if(!prev || host._force) {
				host._force = false // close latch

				const shadowRoot = {
					name: 'shadow-root',
					customElement: host, // dispatch host for proxied events
					shadowRoot: target,
					data: () => ({props, slotChildren: []}),
					render(h) {
						return h(defn, {
							ref: 'inner',
							props: this.props,
							attrs: {'data-vh': defn.name},
						}, this.slotChildren)
					},
				} as any

				wrapper = (!!vue && typeof vue === 'function') ? new vue(shadowRoot) : new Vue(shadowRoot)

				/* observe and assign slot content */
				const observer = new MutationObserver(() => assignSlotChildren.call(host, wrapper))
				observer.observe(host, {childList: true, subtree: true, characterData: true, attributes: true})
				assignSlotChildren.call(host, wrapper)

				/* mount the shadow root wrapper */
				wrapper.$mount()

				if(prev) {
					target.replaceChild(wrapper.$el, prev)
				} else {
					target.appendChild(wrapper.$el)
				}

			} else {
				/* map new hybrids props to vue element and force an update */
				prev.__vue__._props = props
				prev.__vue__.$forceUpdate()
			}

			/* Add shadow DOM styling */
			shadowStyles && html`
				${host.vhDebug && host._propKeys.map((key) => html`
					<span><b>${key}</b> (${typeof host[key]}): ${JSON.stringify(host[key])}</span> <br/>
				`)}
			`.style(...shadowStyles)(host, target)
		}
	})
}