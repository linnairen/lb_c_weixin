<template>
	<div class="addCar">
		<dl class="title">
			<dt>车牌号<em>*</em></dt>
			<dd>(用于车辆进场时停车场识别)</dd>
		</dl>
		<div class="inp">
			<div class="inp_box">
				<span class="C" @click="focosType = 'C';(N[N.length - 1] == '' && N.pop())">{{ C }}<i></i></span>
				<span class="B"></span>
				<p class="N" @click="focosType = 'N';((N[N.length - 1] != '' && N.length < length) && N.push(''))"><span v-for="(item,key) in N">{{ item }}<i v-if="key == N.length - 1 && focosType == 'N'"></i></span><strong class="ph" v-if="N.length == 0 && focosType != 'N'">请输入车牌号</strong></p>
			</div>
		</div>
		<div class="newTypeCar"><i :class="{ 'check' : ifNewType }" @click="(ifNewType ? N.pop() : N.push('') );ifNewType = !ifNewType"></i><span>8位新能源车牌</span></div>
		<div class="btn">
			<button :disabled="!canTap" @click="addCar">添加车牌</button>
		</div>
		<keyboard :type="keyboardType" @input="input" @cancel="cancel" />
	</div>
</template>
<script>
import keyboard from '@c/keyboard.vue'
import token from '../../common/js/token.js'
import { mapGetters } from 'vuex'
export default {
	data () {
		return {
			C: '京',
			N: [''],
			ifNewType: false,
			focosType: 'N'
		}
	},
	computed: {
		keyboardType () {
			let type = ''
			if(this.focosType == 'C'){
				type = 'str'
			}
			else{
				type = 'code'
			}
			return type
		},
		canTap () {
			let len = this.C.length + this.N.length
			return (len == this.length + 1 && this.N[this.N.length - 1] != '')
		},
		length () {
			return (this.ifNewType ? 7 : 6)
		},
		...mapGetters([
			'getToken'
		])
	},
	components: {
		keyboard
	},
	methods: {
		input (val) {
			if(this.focosType == 'N'){
				this.N.splice(this.N.length - 1,1,val)
				if(this.N.length < this.length){
					this.N.push('')
				}
			}
			if(this.focosType == 'C'){
				this.C = val
				this.focosType = 'N'
				if(this.N[this.N.length - 1] != '' && this.N.length < this.length ){
					this.N.push('')
				}
			}
		},
		cancel () {
			if(this.focosType == 'N'){
				if(this.N.length == this.length && this.N[this.N.length - 1] != ''){
					this.N.splice(this.N.length - 1,1,'')
				}
				else if(this.N.length > 1){
					this.N.splice(this.N.length - 2,1)
				}
			}
		},
		addCar () {
			let that = this
			alert(that.C + that.N.join(''))
			if(that.canTap){
				let carNum = that.C + that.N.join('')
				token.addCar(that.getToken,{
					plateNo: carNum,
					type: (that.ifNewType ? 2 : 1)
				},function(d){
					if(d.code == 200){
						that.$router.go(-1)
					}
				})
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.addCar{
	width: 100%;
	background: #fff;
	padding-bottom: 0.8rem;
	.title{
		width: 100%;
		text-align: center;
		padding-top: 0.66rem;
		line-height: 1;
		dt{
			margin-bottom: 0.2rem;
			color: #666;
			font-size: 0.3rem;
			em{
				font-style: normal;
				color: #ff9938;
			}
		}
		dd{
			margin-bottom: 0.6rem;
			color: #999;
			font-size: 0.26rem;
		}
	}
	.inp{
		margin-bottom: 0.4rem;
		.inp_box{
			border: 0.01rem solid #ff9938;
			width: 6.9rem;
			height: 0.9rem;
			margin: 0 auto;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.04rem;
		}
		.C{
			width: 1.23rem;
			position: relative;
			text-align: center;
			line-height: 0.9rem;
			height: 0.9rem;
			font-size: 0.32rem;
			i{
				font-style: normal;
				position: absolute;
				top: 0.41rem;
				right: 0.15rem;
				width: 0.16rem;
				height: 0.08rem;
				background: url(../../img/size2/drop.png) no-repeat center center/100%;
			}
		}
		.B{
			height: 0.38rem;
			width: 0;
			border-left: 0.01rem solid #c8c8c8;
		}
		.N{
			flex: 1;
			padding-left: 0.6rem;
			line-height: 1;
			font-size: 0.32rem;
			.ph{
				color: #c8c8c8;
				font-weight: normal;
			}
			span{
				display: inline-block;
				vertical-align: middle;
				position: relative;
				width: 1em;
				height: 1em;
				text-align: center;
				i{
					position: absolute;
					top: 100%;
					left: 0;
					height: 0;
					width: 100%;
					border-bottom: 0.04rem solid #ff9938;
					animation: inpAni 1s linear infinite;
				}
			}
		}
	}
	.newTypeCar{
		text-align: right;
		font-size: 0.26rem;
		line-height: 1;
		margin-bottom: 0.74rem;
		padding-right: 0.3rem;
		color: #999;
		i{
			display: inline-block;
			font-style: normal;
			box-sizing: border-box;
			vertical-align: middle;
			width: 0.26rem;
			height: 0.26rem;
			border: 0.01rem solid #999;
			position: relative;
			margin-right: 0.1rem;
		}
		span{
			display: inline-block;
			vertical-align: middle;
		}
		.check{
			&:after{
				content: '';
				position: absolute;
				width: 0.12rem;
				height: 0.06rem;
				border: 0.04rem solid #ff9938;
				left: 0.03rem;
				top: 0;
				border-color: transparent transparent #ff9938 #ff9938;
				transform: rotate(-40deg);
			}
		}
	}
	.btn{
		width: 100%;
		text-align: center;
		button{
			width: 7.1rem;
			height: 0.9rem;
			border: none;
			background: #5D657C;
			border-radius: 0.04rem;
			color: #fff;
			&:disabled{
				background: #c8c8c8;
			}
		}
	}
}
@keyframes inpAni {
	0% { opacity: 1; }
	50% { opacity: 0; }
	100% { opacity: 1; }
}
</style>