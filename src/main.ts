if (process.env.NODE_ENV !== "production") module.hot.accept()

import Vue from 'vue'
import app from './app.vue'

new Vue({
	el: '#app',
	render: (h) => h(app),
})
