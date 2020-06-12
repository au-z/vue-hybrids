/**
 * Demonstrates the ability to include the special legacy polyfill which omits Symbol support
 * because of a clash with core-js Symbol polyfill.
 *
 * This should ensure IE11 support
 */
const a = Symbol('3523')
import '../dist/legacy-polyfill.min.js'

import Vue from 'vue'

/**
 * On IE11, Vue will not recognize a few custom elements.
 * This adds them to be ignored, removing any console warnings.
 */
Vue.config.ignoredElements.push(...['shady-slot', 'slot'])
import app from './app.vue'

new Vue({
	el: '#app',
	render: (h) => h(app),
})
