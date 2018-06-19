<template>
	<div class="nav">
		<ul>
			<li v-for="(item,key) in linkData">
				<router-link :to="item.url" :class="{ 'selected' : selLink == key }"><img :src="item.img[selLink == key ? 1 : 0]"><span>{{ item.text }}</span></router-link>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	data () {
		return {
			linkData: {
				index: {
					img: [require('../img/size2/indexU@2x.png'),require('../img/size2/indexS@2x.png')],
					text: '首页',
					url: '/'
				},
				order: {
					img: [require('../img/size2/orderU@2x.png'),require('../img/size2/orderS@2x.png')],
					text: '订单',
					url: '/order'
				},
				my: {
					img: [require('../img/size2/myU@2x.png'),require('../img/size2/myS@2x.png')],
					text: '我的',
					url: '/my'
				}
			},
			selLink: 'index'
		}
	},
	watch: {
		'$route': function () {
			for(let i in this.linkData){
				if(this.$route.path.indexOf(this.linkData[i].url) != -1){
					this.selLink = i
				}
			}
		}
	},
	created () {
		for(let i in this.linkData){
			if(this.$route.path.indexOf(this.linkData[i].url) != -1){
				this.selLink = i
			}
		}
	}
}
</script>
<style scoped lang="scss">
.nav{
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 99999;
	background: #fff;
	ul{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 0.98rem;
		font-size: 0.22rem;
		li{
			width: 2.08rem;
			height: 100%;
			text-align: center;
			a{
				display: inline-flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #38373D;
				height: 100%;
			}
			img{
				width: 0.48rem;
				height: 0.48rem;
				margin-bottom: 0.04rem;
			}
			.selected{
				color: #FF9938;
			}
		}
	}
}
</style>