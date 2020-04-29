<template>
	<div class="vue-counter">
		<button @click="increment">Count: {{count}}</button>
	</div>
</template>

<script>
import {define} from '../vue-hybrids'

export default define({
	name: 'vue-counter',
	events: {increment: true},
	data: () => ({count: 0}),
	methods: {
		increment() {
			this.$emit('increment', ++this.count)
		},
	},
})
</script>
