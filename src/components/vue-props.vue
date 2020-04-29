<template>
	<div class="vue-props">
		{{typeof bool}} {{JSON.stringify(bool)}}<br/>
		{{typeof num}} {{JSON.stringify(num)}}<br/>
		{{typeof str}} {{JSON.stringify(str)}}<br/>
		{{typeof arr}} {{JSON.stringify(arr)}}<br/>
		{{typeof obj}} {{JSON.stringify(obj)}}<br/>
		{{typeof fn}} {{JSON.stringify(fn)}}<br/>
	</div>
</template>

<script>
import {define} from '../vue-hybrids'
import shadowStyles from './vue-props.styl'

export default define({
	name: 'vue-props',
	props: {
		bool: {type: Boolean},
		num: {type: Number},
		str: {type: String},
		arr: {type: Array},
		obj: {type: Object, default: () => ({foo: 'bar'})},
		fn: {type: Function, default: () => 0},
	},
}, shadowStyles)
</script>
