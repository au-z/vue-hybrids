<template>
	<div class="app">
		<vue-slot>
			<vue-event @custom="logEvent"></vue-event>
		</vue-slot>

		<!-- <vue-event @custom="logEvent"></vue-event> -->
	</div>
</template>

<script>
import Vue from 'vue'
import './components/vue-props.vue'
import './components/vue-slot.vue'
import './components/vue-event.vue'

export default {
	name: 'app',
	methods: {
		onClose(e) {
			console.log('CLOSE', e)
		},
		logEvent(e) {console.log(e)},
	},
}
</script>
