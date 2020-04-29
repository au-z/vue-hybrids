<template>
	<div class="vue-props-mixin">
		{{JSON.stringify($props)}}
	</div>
</template>

<script>
import {define} from '../vue-hybrids'

const FooProp = { props: ['foo'] }
const BarProp = { props: ['bar'] }

export default define({
	name: 'vue-props-mixin',
	mixins: [FooProp, BarProp],
})
</script>
