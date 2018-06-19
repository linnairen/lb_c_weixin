<template>
	<div class="index-list">
		<ul class="l" v-if="list.length != 0">
			<li v-for="(item,key) in list">
				<span @click="getIsOrdered ? $emit('showCo') : $router.push('/releaseOrder?tid=' + item.tid)">
					<div class="img"><img :src="item.img" alt=""></div>
					<dl>
						<dt>{{ item.title }}</dt>
						<dd>{{ item.detail }}</dd>
					</dl>
				</span>
			</li>
		</ul>
		<div class="n" v-else>
			<span>建设中...</span>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	data () {
		return {

		}
	},
	computed: {
		...mapGetters([
			'getIsOrdered'
		])
	},
	props: ['list']
}
</script>
<style lang="scss" scoped>
.index-list{
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
	background: #fff;
	.l{
		width: 6.9rem;
		margin: 0 auto 2rem;
		li{
			width: 100%;
			height: 2rem;
			border-bottom: 0.01rem solid #efefef;
			span{
				display: flex;
				height: 100%;
				align-items: center;
			}
			dl{
				height: 1.4rem;
				padding-left: 0.4rem;
				width: 4rem;
				display: flex;
				flex-direction: column;
				justify-content: center;
				dt{
					font-family: 'PingFangSC-Medium';
					font-size: 0.3rem;
					width: 100%;
					line-height: 0.54rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				dd{
					font-size: 0.28rem;
					color: #888;
					line-height: 0.48rem;
				}
			}
		}
		.img{
			width: 2.1rem;
			height: 1.4rem;
			background: #000;
			img{
				width: 100%;
				height: 100%;
			}
		}
	}
	.n{
		font-size: 0.3rem;
		color: #ff9938;
		line-height: 6rem;
		text-align: center;
	}
}
</style>