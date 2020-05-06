/*
From the vue-web-component wrapper source code
https://github.com/vuejs/vue-web-component-wrapper/blob/e2b84569c4671a7ea451b3887840533261e71715/src/utils.js#L61
*/

export function injectHook(defn, key, hook) {
	defn[key] = [].concat(defn[key] || [])
	defn[key].unshift(hook)
}

export function callHooks(vm, hook) {
	if(!vm) return
	const hooks = vm.$options[hook] || []
	hooks.forEach((hook) => hook.call(vm))
}

/**
 * Borrowed significantly from https://github.com/GiG/vue-web-component-wrapper/blob/master/src/utils.js#L68
 * vue web component wrapper (on which these utils are based), does not support native slot
 * implementation, instead replacing slot elements with children.
 *
 * Further Explanation: https://github.com/vuejs/vue-web-component-wrapper/issues/49
 * The effect of this is copied DOM nodes which does not preserve any event listeners.
 * This new implementation creates named and default native slots for slotted content and allows the browser.
 *
 * @param h hyperscript createElement fn
 * @param children component childNodes
 * @param scopeId an optional scopeId
 */
export function toVNodes(h, children, scopeId?) {
	let unnamed = false
	const named = {}

	for (let i = 0, l = children.length; i < l; i++) {
		const slotName = children[i].getAttribute && children[i].getAttribute('slot');
		if(slotName && !named[slotName]) {
			named[slotName] = createSlot(h, scopeId, slotName)
		} else if (!name && !unnamed) {
			unnamed = createSlot(h, scopeId)
		}
	}

	const res = Array.from(Object.values(named));
	if(unnamed) res.push(unnamed);

	return res
}

/**
 * Creates a native slot element which links to the child DOM node instead of duplicating it.
 * @param h hyperscript createElement fn
 * @param scopeId an optional scopeId
 * @param name name of the slot if named
 * @return the <slot> element
 */
function createSlot(h, scopeId?, name?) {
	const data: any = {attrs: { [scopeId]: ''}}
	if(name) {
		data.slot = name
		data.attrs.name = name
	}

	let slot = h('slot', data)
	if(!!(window as any).ShadyDOM) {
		slot = h('shady-slot', {attrs: {[scopeId]: ''}}, [slot])
	}

	return slot
}
