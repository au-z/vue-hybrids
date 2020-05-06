<template>
	<div class="vue-model">
		<button @click="() => $emit('change', input + 1)">{{input}} Increment</button>
	</div>
</template>

<script>
export default {
	name: 'vue-model',
	model: {prop: 'input', event: 'change'},
	props: {
		input: {
			required: false,
		},
	},
}
</script>
