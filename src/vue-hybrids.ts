import {property, Hybrids, define as hybridDefine} from 'hybrids'
import {vueify, ComponentDefn, CustomElement, Prop} from './core.ts'

interface DefineOptions {
	vue?: any // optional vue instance
	styles?: string | string[] // shadow styles
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

export function wrap(defn: ComponentDefn, {vue, styles}: DefineOptions): Hybrids<CustomElement> {
	styles = typeof styles === 'string' ? [styles] : styles // accept styles as a single string or array of strings

	if(!defn.name) {
		throw new Error(`[vue-hybrids] wrapped component requires a 'name' property.`)
	}

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

	return {
		vhDebug: false,
		vhKey: {
			...property(''),
			observe: (host, val, last) => {
				if(val !== last && last !== undefined) {
					host._force = true
					host.vhDebug && console.log('[vue-hybrids] Forcing component refresh.')
				}
			},
		},
		_force: false,
		_propKeys: Object.keys(props),
		...props,
		name: defn.name,
		version: defn.version,
		render: vueify(defn, styles, vue),
	} as Hybrids<CustomElement>
}

export function define(defn: ComponentDefn, options: DefineOptions = {}): ComponentDefn {
	try {
		hybridDefine(defn.name, wrap(defn, options))
	} catch (err) {
		if(err.message.indexOf('already defined') >= 0) {
			console.warn(`Element ${defn.name} already defined.`)
		} else {
			throw err
		}
	}
	return defn
}