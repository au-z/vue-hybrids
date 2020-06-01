<template>
	<div class="app">
		<vue-mounted :num.prop="num" :vh-key.prop="forceRefresh" vh-debug></vue-mounted>
		<button @click="num++">Increment</button>
		<button @click="forceRefresh++">Force Refresh</button>
	</div>
</template>

<script>
import Vue from 'vue'
import './components/vue-props.vue'
import './components/vue-slot.vue'
import './components/vue-event.vue'
import './components/vue-mounted.vue'

export default {
	name: 'app',
	data: () => ({
		num: 0,
		forceRefresh: 0,
	}),
	methods: {
		onClose(e) {
			console.log('CLOSE', e)
		},
		logEvent(e) {console.log(e)},
	},
}
</script>
