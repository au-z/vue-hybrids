<template>
	<div class="vue-slot">
		<div class="title"><slot name="title"></slot></div>
		<slot></slot>
	</div>
</template>

<script>
import {define} from '../vue-hybrids'

export default define({
	name: 'vue-slot',
})
</script>
