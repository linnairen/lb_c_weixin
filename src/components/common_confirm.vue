<template>
	<div v-if="showConfirm" class="confirm_shadow">
		<div class="confirm_box">
			<div class="content">
				<div class="I"><img src="../img/size2/warn.png" alt=""></div>
				<span>{{ data.msg }}</span>
			</div>
			<ul class="B">
				<li class="confirm_f" @click="hidden">{{ data.f || '取消' }}</li>
				<li class="confirm_t" @click="confirm">{{ data.t || '确定' }}</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
export default {
	data () {
		return {
			data: {
				t: '',
				f: '',
				msg: ''
			},
			showConfirm: false
		}
	},
	watch: {
		'$route': function () {
			this.showConfirm = false
		}
	},
	created () {
		let that = this
        Vue.prototype.$showConfirm = function({data,fun}) {
            that.showConfirm = true
            that.data = data || that.data
            Vue.prototype.$onConfirm = fun || function (bool) {}
        }
        Vue.prototype.$_onConfirm = function (bool,data) {
            that.$onConfirm && that.$onConfirm(bool,data)
            that.showConfirm = false
        }
	},
	methods: {
		confirm () {
			this.$_onConfirm(true,this.data)
		},
		hidden () {
			this.$_onConfirm(false,this.data)
		}
	}
}
</script>
<style scoped lang="scss">
.confirm_shadow{
	position: fixed;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	background: rgba(#000, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999999999999;
	.confirm_box{
		background: #fff;
		width: 5.4rem;
		.content{
			text-align: center;
			padding: 0.55rem 0 0.48rem;
			font-size: 0.28rem;
			color: #888;
			.I{
				height: 1.2rem;
				padding-bottom: 0.3rem;
			}
			img{
				width: 1.2rem;
				height: 1.2rem;
			}
		}
		.B{
			width: 100%;
			height: 0.92rem;
			line-height: 0.92rem;
			text-align: center;
			border-top: 0.01rem solid #efefef;
			display: flex;
			li{
				flex: 1;
				height: 100%;
				font-size: 0.28rem;
			}
			.confirm_f{
				color: #999;
				border-right: 0.01rem solid #efefef;
			}
			.confirm_t{
				color: #ff9938;
			}
		}
	}
}
</style>