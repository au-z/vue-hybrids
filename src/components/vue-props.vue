<template>
	<div class="vue-props">
		<b>bool:</b> ({{typeof bool}}) {{JSON.stringify(bool)}}<br/>
		<b>num:</b> ({{typeof num}}) {{JSON.stringify(num)}}<br/>
		<b>str:</b> ({{typeof str}}) {{JSON.stringify(str)}}<br/>
		<b>arr:</b> ({{typeof arr}}) {{JSON.stringify(arr)}}<br/>
		<b>obj:</b> ({{typeof obj}}) {{JSON.stringify(obj)}}<br/>
		<b>fn:</b> ({{typeof fn}}) <button @click="fn">Invoke</button><br/>
		<b>dyn:</b> ({{typeof dyn}}) {{JSON.stringify(dyn)}}<br/>
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
		dyn: {},
	},
}, shadowStyles)
</script>
