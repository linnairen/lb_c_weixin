<template>
	<div class="login">
		<div class="head"><img src="../img/close.png" @click="toIndex" v-show="show_close"><img src="../img/goback.png" @click="goBack" alt="" v-show="!show_close"><span>登录</span></div>
		<router-view @show_close="setshow_close" :phone="phone" @phoneChange="phoneChange" @setTip="tipFun" />
		<tips :tip="tip_info" v-show="show_tip" @click="clear"></tips>
	</div>
</template>
<script>
window['timeKey'] = 0
window['on'] = false
import tips from '@c/common_tip.vue'
export default {
	data () {
		return {
			show_close: true,
			phone: '',
			tip_info: {
				type: '',
				msg: ''
			},
			show_tip: false
		}
	},
	components: {
		tips
	},
	watch: {
		show_tip (val) {
			let that = this
			if(val){
				if(window['on']){
					clearTimeout(window['timeKey'])
					window['on'] = false
				}
				window['on'] = true
				window['timeKey'] = setTimeout(function() {
					that.show_tip = false
					window['on'] = false
				}, 1500);
			}
		}
	},
	created () {
		this.phone = localStorage.getItem('phoneNumber') || ''
	},
	mounted () {
		this.$emit('changeShow',false)

	},
	methods: {
		setshow_close (bool) {
			this.show_close = bool
		},
		toIndex () {
			this.$router.push('/')
		},
		goBack () {
			this.$router.go(-1)
		},
		phoneChange (phone) {
			this.phone = phone
			localStorage.setItem('phoneNumber',phone)
		},
		tipFun (obj) {
			this.show_tip = false
			this.tip_info = obj
			this.show_tip = true
		},
		clear () {
			clearTimeout(window['timeKey'])
			this.show_tip = false
		}
	}
}
</script>
<style lang="scss" scoped>
.login{
	.head{
		width: 100%;
		height: 0.36rem;
		line-height: 0.36rem;
		font-size: 0.36rem;
		position: relative;
		text-align: center;
		margin: 0.27rem 0;
		img{
			position: absolute;
			top: 0;
			left: 0.4rem;
			height: 100%;
			vertical-align: middle;
		}
	}
}
</style>