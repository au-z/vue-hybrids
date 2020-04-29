<template>
	<div class="vue-props-array">
		{{JSON.stringify($props)}}
	</div>
</template>

<script>
import {define} from '../vue-hybrids'

export default define({
	name: 'vue-props-array',
	props: ['a', 'b', 'c'],
})
</script>
