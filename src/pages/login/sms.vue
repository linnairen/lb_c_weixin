<template>
	<div class="inp_code">
		<div class="title"><b>请输入4位验证码</b></div>
		<div class="tip"><p>验证码已发送至{{ phone }}</p></div>
		<div class="form">
			<input type="number" id="smsCode" autofocus="autofocus" maxlength="11" v-model="smsCode">
			<label for="smsCode">
				<ul>
					<li class="willInput">{{ smsCode.substr(0,1) || '' }}</li>
					<li :class="{ 'willInput' : smsCode.substr(0,1) }">{{ smsCode.substr(1,1) || '' }}</li>
					<li :class="{ 'willInput' : smsCode.substr(1,1) }">{{ smsCode.substr(2,1) || '' }}</li>
					<li :class="{ 'willInput' : smsCode.substr(2,1) }">{{ smsCode.substr(3,1) || '' }}</li>
				</ul>
			</label>
			<div class="reSend">
				<p><b @click="timeFun">{{ time }}</b><span v-show="!canReSend">后重发</span></p>
				<p v-show="noCode">收不到验证码?</p>
			</div>
		</div>
	</div>
</template>
<script>
import token from '../../common/js/token.js'
import { mapGetters } from 'vuex'
export default {
	data () {
		return {
			smsCode: '',
			time: '',
			noCode: false,
			canReSend: false
		}
	},
	props: ['phone'],
	created () {
		this.$emit('showclose',false)
		this.timeFun()
	},
	computed: {
		...mapGetters([
			'getToken'
		])
	},
	watch: {
		smsCode (val) {
			let that = this
			// if(!this.smsCode.match(/^\d{0,4}$/)){
			// 	this.smsCode = this.smsCode.substr(0,this.smsCode.length - 1)
			// }
			if(val.length > 4){
				that.smsCode = val.substr(0,4)
				return
			}
			if(that.smsCode.length == 4){
				if(that.smsCode.match(/^\d{4}$/)){
					that.$emit('setTip',{
						type: 'loading',
						msg: '正在登录...'
					})
					token.login(that.getToken,{
						clientType: 5,
						captcha: that.smsCode,
						mobile: that.phone,
						loginType: 'sms'
					},function(d){
						if(d.code == 200){
							that.$emit('setTip',{
								type: 'success',
								msg: '登录成功'
							})
							setTimeout(function() {
								that.$router.push('/')
							},1000)
						}
						else{
							that.$emit('setTip',{
								type: 'warm',
								msg: d.msg
							})
							that.smsCode = ''
						}
					})
				}
				else{
					that.$emit('setTip',{
						type: 'warm',
						msg: '验证码错误'
					})
					that.smsCode = ''
				}
			}
			
		}
	},
	methods: {
		timeFun () {
			if(!this.canReSend && this.noCode){
				return
			}
			this.canReSend = false
			let time = 60
			this.time = time + 's'
			this.timeout(time)
		},
		timeout (time) {
			let that = this
			time --
			this.time = time + 's'
			if(time == 30){
				this.noCode = true
			}
			if(time == 0){
				this.canReSend = true
				this.time = '点击重发'
			}
			if(time > 0){
				setTimeout(function () {
					that.timeout(time)
				}, 1000);
			}
		}
	}
}
</script>
<style scoped lang="scss">
.inp_code{
	padding: 1.21rem 0 0;
	text-align: center;
	.title{
		font-size: 0.4rem;
		line-height: 0.4rem;
	}
	.tip{
		margin-top: 0.44rem;
		font-size: 0.28rem;
		line-height: 0.28rem;
		color: #a9a9a9;
	}
	.form{
		line-height: 1;
		width: 4.52rem;
		margin: 0.79rem auto 0;
		text-align: left;
		position: relative;
		overflow: hidden;
		input{
			position: absolute;
			top: 0;
			left: 1000%;
			background: none;
			border: none;
			color: #fff;
			height: 0;
			width: 0;
			overflow: hidden;
		}
		ul{
			display: flex;
		    justify-content: space-between;
			li{
				width: 0.92rem;
				height: 1.02rem;
				border: 0.02rem solid #a9a9a9;
				border-radius: 0.04rem;
				font-size: 0.64rem;
				font-weight: bold;
				text-align: center;
				line-height: 1.02rem;
			}
			.willInput{
				border-color: #ff7000;
			}
		}
		.reSend{
			text-align: center;
			margin-top: 0.55rem;
			color: #a9a9a9;
			font-size: 0.3rem;
			p{
				margin-bottom: 0.3rem;
			}
			b{
				color: #ff7000;
				font-weight: normal;
			}
		}
	}
}
</style>
