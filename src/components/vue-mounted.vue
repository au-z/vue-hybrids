<template>
	<div class="vue-mounted">
		Number: {{num}}<br>
		Mount Count: {{mountCount}}
	</div>
</template>

<script>
import {define} from '../vue-hybrids.ts'
window.mountCount = 0

export default define({
	name: 'vue-mounted',
	props: {
		num: {type: Number},
	},
	data: () => ({mountCount: null}),
	mounted() {
		window.mountCount++
		this.mountCount = window.mountCount
	},
})
</script>
