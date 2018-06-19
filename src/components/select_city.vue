<template>
	<transition name="break">
		<div class="city_main" v-if="onselect">
			<div class="select_main">
				<div class="input_city"><img src="" alt=""><input type="text" placeholder="您想在哪停车？"></div>
				<div class="cancel" @click="$emit('update:onselect',false)"><span>取消</span></div>
			</div>
			<div class="city_list">
				<div class="nowpos">当前定位城市：<span>{{ city }}</span></div>
				<!-- <div class="hot">
					<p></p>
					<ul>
						<li></li>
					</ul>
				</div> -->
				<div class="main_list">
					<p><img src="../img/size2/star.png">已开通城市</p>
					<div class="items">
						<ul>
							<li v-for="(item,key) in cityList" :key="key" @click="checkCity(item)">{{ item.name }}</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import token from '@/common/js/token.js'
import { mapGetters } from 'vuex'
export default {
	props: ['city','onselect'],
	data () {
		return {
			cityList: []
		}
	},
	computed: {
		...mapGetters([
			'getToken'
		])
	},
	created () {
		this.getOpen()
	},
	methods: {
		getOpen () {
			let that = this
			token.getOpen(that.getToken,function(d){
				if(d.code == 200){
					that.cityList = d.rs
				}
			})
		},
		checkCity (item) {
			this.$emit('change',item)
			this.$emit('update:onselect',false)
		}
	}
}
</script>
<style scoped lang="scss">
.break-enter-active, .break-leave-active {
  	transition: all .5s;
}
.break-enter, .break-leave-to /* .break-leave-active in below version 2.1.8 */ {
  	top: 110%;
  	opacity: 0;
}
.break-enter-to,.break-leave{
	top: 0;
	opacity: 1;
}
.city_main{
	position: absolute;
	width: 100%;
	height: 100%;
	background: #f1f1f1;
	overflow: auto;
	top: 0;
	z-index: 10002;
	.select_main{
		width: 100%;
		height: 0.88rem;
		line-height: 0.88rem;
		position: fixed;
		top: 0;
		left: 0;
		background: #fff;
		display: flex;
		.input_city{
			padding: 0 0 0 0.24rem;
			height: 100%;
			display: flex;
			flex: 1;
			input{
				display: block;
				// width: 100%;
				flex: 1;
				box-sizing: border-box;
				height: 100%;
				border: none;
				font-size: 0.28rem;
				background: none;
				padding: 0 0.26rem;
			}
			input::placeholder{
				color: #c8c8c8;
			}
		}
		.cancel{
			width: 1.36rem;
			text-align: center;
			font-size: 0.28rem;
			color: #666;
		}
	}
	.city_list{
		width: 7.1rem;
		margin: 1.08rem auto 0;
		background: #fff;
		font-size: 0.3rem;
		.nowpos{
			padding-left: 0.3rem;
			height: 1.02rem;
			line-height: 1.02rem;
		}
	}
	.main_list{
		width: 100%;
		background: #fff;
		p{
			background: #f6f6f6;
			color: #a9a9a9;
			height: 0.9rem;
			line-height: 0.9rem;
			padding-left: 0.3rem;
			img{
				width: 0.25rem;
				height: 0.24rem;
				vertical-align: middle;
				margin-right: 0.1rem;
			}
		}
		.items{
			width: 100%;
			ul{
				width: 100%;
			}
			li{
				display: inline-block;
				width: 33.33%;
				text-align: center;
				border-bottom: 0.01rem solid #f1f1f1;
				line-height: 1rem;
			}
		}
	}
}
</style>