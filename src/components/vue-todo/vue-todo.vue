<template>
	<div class="vue-todo">
		<slot name="title"></slot>
		<todo-item v-for="(item, i) in allItems" :item="item" :idx="i" :key="item"
			@complete="removeItem"/>
		<input type="text" v-model="newItem"/>
		<button class="add" @click="addItem">Add Item</button>
	</div>
</template>

<script>
import {define} from '../../../index.js'
console.log(define)
import TodoItem from './todo-item.vue'
import styles from './vue-todo.styl'

export default define({
	name: 'vue-todo',
	components: {TodoItem},
	props: {
		items: {type: Array, default: []},
	},
	events: {
		added: true,
		completed: true,
	},
	data() {
		return {
			allItems: [...this.items],
			newItem: '',
		}
	},
	methods: {
		removeItem(idx) {
			const item = this.allItems[idx]
			this.allItems.splice(idx, 1)
			this.$emit('completed', item)
		},
		addItem() {
			this.allItems.push(this.newItem)
			this.$emit('added', this.newItem)
			this.newItem = ''
		},
	},
}, styles)
</script>
