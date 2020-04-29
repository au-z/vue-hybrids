if (process.env.NODE_ENV !== "production") module.hot.accept()

import { Hybrids, define, html } from 'hybrids'

import './components/vue-props.vue'
import './components/vue-counter.vue'
import './components/vue-void.vue'
import './components/vue-slot.vue'
import './components/vue-props-array.vue'
import './components/vue-props-mixin.vue'
import './components/vue-todo/vue-todo.vue'

const logEvent = (host, e) => console.log(`${e.type}:`, e.detail)

const AppRoot = {
	todo: () => ({
		items: ['Kick your knees up', 'Round the chimney', 'Flap like a birdie'],
	}),
	render: ({todo}) => html`
		<vue-todo items="${todo.items}"
			onadded="${logEvent}"
			oncompleted="${logEvent}">
			<h1 slot="title">Dick Van Dyke's Todos</h1>
		</vue-todo>
	`,
} as Hybrids<any>

define('app-root', AppRoot)