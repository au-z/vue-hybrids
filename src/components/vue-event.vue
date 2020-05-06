<template>
	<div class="vue-event">
		<button @click="() => $emit('custom', true)">Emit Event</button>
	</div>
</template>

<script>
import {define} from '../vue-hybrids.ts'

export default define({
	name: 'vue-event',
})
</script>
