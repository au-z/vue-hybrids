<template>
	<div class="todo-item">
		<span>{{item}}</span>
		<button class="btn" @click="() => $emit('complete', idx)">Complete</button>
	</div>
</template>

<script>
export default {
	name: 'todo-item',
	props: {
		item: {type: String, required: true},
		idx: {type: Number, required: true},
	},
}
</script>
