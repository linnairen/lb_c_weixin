<template>
	<div class="tip_shadow" @click="hiddenFun">
		<div class="tips">
			<ul>
				<li v-if="tip_info.type == 'warm'"><img src="../img/size2/tip@2x.png"></li>
				<li v-else-if="tip_info.type == 'loading'"><img class="loading" src="../img/loading.png" alt=""></li>
				<li v-else-if="tip_info.type == 'success'"><img src="../img/size2/success@2x.png"></li>
			</ul>
			<span>{{ tip_info.msg }}</span>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
			tip_info: {
				type: '',
				msg: ''
			},
		}
	},
	props: ['tip'],
	watch: {
		tip (val) {
			this.tip_info = val
		}
	},
	methods: {
		hiddenFun () {
			this.$emit('click')
		}
	}
}
</script>
<style>
.tip_shadow{
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
}
.tips{
	display: flex;
	padding: 0.28rem 0.58rem;
	background: rgba(0,0,0,0.66);
	border-radius: 0.1rem;
	line-height: 0.34rem;
	font-size: 0.3rem;
}
.tips ul{
	display: inline-flex;
	overflow: hidden;
	margin-right: 0.1rem;
	vertical-align: middle;
}
.tips li{
	width: 100%;
	line-height: 0.34rem;
	height: 0.34rem;
	font-size: 0;
}
.tips img{
	width: 0.34rem;
}
.loading{
	animation: loading 1.4s infinite linear;
}
@keyframes loading {
	from{ transform: rotate(0); }
	to{ transform: rotate(360deg); }
}
</style>