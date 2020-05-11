<template>
	<div class="vue-model">
		<button @click="() => $emit('bar', foo + 1)">{{foo}} Increment</button>
	</div>
</template>

<script>
import {define} from '../vue-hybrids.ts'

export default define({
	name: 'vue-model',
	model: {prop: 'foo', event: 'bar'},
	props: {
		foo: {
			type: Number,
			required: false,
		},
	},
})
</script>
