<template>
	<div class="inp_phone">
		<div class="title"><b>请输入手机号码</b></div>
		<div class="tip"><p>为了方便您停车，请填写手机号码</p></div>
		<div class="form">
			<input type="number" id="telePhone" maxlength="11" autofocus="autofocus" v-model="phone_number">
			<label for="telePhone">
				<div><span>+86</span><p>{{ tel }}</p></div>
			</label>
			<div class="rules" :class="{ 'agree' : ifAgree }" @click="ifAgree = !ifAgree">
				<i></i><p>同意<a href="./#/login">《法律声明及隐私政策》</a></p>
			</div>
		</div>
		<div class="btn">
			<button :class="{ 'sure' : isSure&&ifAgree }" :disabled="!isSure" @click="nextSteep">下一步</button>
		</div>
	</div>
</template>
<script>
import token from '../../common/js/token.js'
import { mapGetters } from 'vuex'
export default {
	data () {
		return {
			phone_number: '',
			ifAgree: true,
			isSure: false
		}
	},
	props: ['phone'],
	created () {
		this.$emit('showclose',true)
		this.phone_number = this.phone
	},
	computed: {
		tel () {
			let tel = ''
			if(this.phone_number.length >= 3){
				tel = this.phone_number.substr(0,3) + ' '
				if(this.phone_number.length >= 7){
					tel += this.phone_number.substr(3,4) + ' ' + this.phone_number.substr(7)
				}
				else{
					tel += this.phone_number.substr(3)
				}
			}
			else{
				tel = this.phone_number
			}
			return tel
		},
		...mapGetters([
			'getToken'
		])
	},
	watch: {
		phone_number (val) {
			if(val.length > 11){
				this.phone_number = val.substr(0,11)
				return
			}
			if(this.phone_number.length == 11){
				if(this.phone_number.match(/^1[345789]\d{9}$/)){
					this.isSure = true
				}
				else{
					this.isSure = false
					this.$emit('setTip',{
						type: 'warm',
						msg: '请输入正确的手机号'
					})
				}
			}
			else{
				this.isSure = false
			}
		}
	},
	methods: {
		nextSteep () {
			let that = this
			token.getSms(that.getToken,{
				type: 'mobile',
				mobile: that.phone_number,
				pushType: 2
			},function(d){
				if(d.code == 200){
					that.$emit('phoneChange',that.phone_number)
					that.$router.push('/login/sms')
				}
			})
		}
	}
}
</script>
<style scoped lang="scss">
@keyframes inp{
	0% { opacity: 0; }
	50% { opacity: 1; }
	100% { opacity: 0; }
}
.inp_phone{
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
		width: 5.3rem;
		margin: 0.92rem auto 0;
		text-align: left;
		position: relative;
		label{
			border-bottom: 0.01rem solid #dedede;
			height: 0.78rem;
			display: block;
			overflow: hidden;
		}
		input{
			// display: none;
			position: absolute;
			top: 0;
			left: 1000%;
			background: none;
			border: none;
			color: transparent;
			height: 0;
			width: 0;
			overflow: hidden;
			&:focus+label p:after{
				content: '';
				display: inline-block;
				margin-top: 0.04rem;
				vertical-align: top;
				background: #aa5;
				width: 2px;
				height: 1em;
				animation: inp 1.5s infinite;
			}
		}
		span{
			display: inline-block;
			text-align: center;
			height: 0.56rem;
			border-radius: 0.04rem;
			line-height: 0.56rem;
			width: 0.88rem;
			background: #13dcb1;
			color: #fff;
			margin-right: 0.2rem;
			font-size: 0.4rem;
			vertical-align: middle;
		}
		p{
			font-size: 0.48rem;
			height: 0.56rem;
			line-height: 0.56rem;
			min-width: 3.4rem;
			display: inline-block;
			vertical-align: middle;
		}
		.rules{
			color: #a9a9a9;
			line-height: 0.24rem;
			height: 0.24rem;
			margin-top: 0.2rem;
			i{
				font-style: normal;
				display: inline-block;
				vertical-align: middle;
				width: 0.18rem;
				height: 0.18rem;
				border-radius: 100%;
				border: 1px solid #ff7000;
				margin-right: 0.08rem;
				position: relative;
			}
			p{
				font-size: 0.24rem;
				height: 0.24rem;
				line-height: 0.24rem;
			}
			a{
				color: #ff7000;
			}
		}
		.agree{
			i{
				&:after{
					content: '';
					border-radius: 50%;
					position: absolute;
					height: 0.12rem;
					width: 0.12rem;
					background: #ff7000;
					top: 0.03rem;
					left: 0.03rem;
				}
			}
		}
	}
	.btn{
		margin-top: 1.4rem;
		text-align: center;
		button{
			width: 4.2rem;
			height: 0.9rem;
			border: none;
			background: #d0d2d7;
			border-radius: 0.45rem;
			color: #fff;
		}
		.sure{
			background: #5d657c;
		}
	}
}
</style>
