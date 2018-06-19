<template>
	<div>
		<button @click="payFun">点击支付</button>
		<div class="alipayBox" v-html="html"></div>
	</div>
</template>
<script>

import { mapGetters } from 'vuex'
import token from '../../common/js/token.js'
export default {
	data () {
		return {
			html: ''
		}
	},
	computed: {
		...mapGetters([
			'getToken',
			'getIsLogin'
		])
	},
	methods: {
		payFun () {
			let that = this
			token.alipay(that.getToken,{
				orderNo: '123654',
				returnUrl: 'http://192.168.11.118:8080/#/'
			},function (d) {
				that.html = d.data
				setTimeout(function(){
					eval(document.querySelector('.alipayBox script').innerText) 
				},100)
				// box.innerHtml = d.data
				// document.body.appendChild(box)
				
			})
		}
	}
}
</script>