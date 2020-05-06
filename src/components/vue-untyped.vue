<template>
	<div class="vue-untyped">
		{{typeof prop}} {{JSON.stringify(prop)}}
	</div>
</template>

<script>
import {define} from '../vue-hybrids.ts'

export default define({
	name: 'vue-untyped',
	props: {
		prop: {},
	},
})
</script>
