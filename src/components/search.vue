<template>
	<div class="search_main">
		<div class="search_top">
			<div class="select_city" @click="$emit('onselectCity')"><span>{{ city }}</span><i></i></div>
			<div class="input_address"><input type="text" placeholder="你要在哪附近停车" v-model="keywords" @input="inputKey" autofocus="autofocus"></div>
			<div class="cancel" @click="$emit('onsearch',false)"><span>取消</span></div>
		</div>
		<div class="tip_list">
			<!-- 历史 -->
			<div class="history" v-if="historyList.length > 0">
				<ul>
					<li v-for="(item,key) in historyList" :key="key" v-if="item.t.indexOf(keywords) != -1" @click="tapMain(item)" @touchstart="longtapstart(key)" @touchend="longtapend" @touchmove="longtapend">
						<div class="i"><img src="../img/size2/his.png"></div>
						<dl>
							<dt>{{ item.t }}</dt>
							<dd>{{ item.d }}</dd>
						</dl>
					</li>
				</ul>
			</div>
			<!-- 推荐 -->
			<div class="recommend" v-if="(recommendList.length > 0) && tipList.length == 0">
				<ul>
					<li v-for="(item,key) in recommendList" @click="tapMain(item)">
						<div class="i"><img src="../img/size2/rec.png"></div>
						<dl>
							<dt>{{ item.t }}</dt>
							<dd>{{ item.d }}</dd>
						</dl>
					</li>
				</ul>
			</div>
			<!-- 提示 -->
			<div class="tip" v-if="tipList.length > 0">
				<ul>
					<li v-for="(item,key) in tipList" @click="tapMain(item)">
						<div class="i"><img src="../img/tip.png"></div>
						<dl>
							<dt>{{ item.t }}</dt>
							<dd>{{ item.d }}</dd>
						</dl>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import selectCity from '@c/select_city.vue'
export default {
	props: ['city'],
	data () {
		return {
			historyList: [
				{
					t: '杭州城西银泰城',
					d: '浙江省杭州市拱墅区丰潭路380号',
					pos: {
						L: '',
						N: '',
						lat: '',
						lng: ''
					},
					id: ''
				}
			],
			recommendList: [],
			tipList: [],
			keywords: '',
			timekey: null
		}
	},
	components: {
		selectCity
	},
	created () {
		this.$emit('changeShow',false)
		let hisSearch = JSON.parse(localStorage.getItem('search')) || []
		this.historyList = hisSearch
	},
	mounted () {
		alert(document.getElementsByClassName('search_main').length)
		document.getElementsByClassName('search_main')[0].oncontextmenu = function(e){
		    e.preventDefault()
		    e.returnValue = ''
		    return false
		}
	},
	methods: {
		keywordsSearch (keywords) {
			let that = this
			AMap.plugin('AMap.Autocomplete',function(){//回调函数
			    var autoOptions = {
				    city: that.city //城市，默认全国
				};
				let autocomplete = new AMap.Autocomplete(autoOptions);
				autocomplete.search(keywords, function(status, result){
				    //TODO:开发者使用result自己进行下拉列表的显示与交互功能
				    // console.log(status,result)
				    if(status == 'complete'){
					    that.tipList = []
					    for(let i in result.tips){
					    	if(result.tips[i].location){
						    	that.tipList.push({
						    		t: result.tips[i].name,
						    		d: result.tips[i].district + result.tips[i].address,
						    		pos: result.tips[i].location,
						    		id: result.tips[i].id
						    	})
					    	}
					    }
					}
				})
			})
		},
		inputKey () {
			if(this.keywords != ''){
				this.keywordsSearch(this.keywords)
			}
			else{
				this.tipList = []
			}
		},
		tapMain (item) {
			// console.log(item)
			let hisSearch = JSON.parse(localStorage.getItem('search')) || []
			for(let i = 0;i < hisSearch.length;i++){
				if(hisSearch[i].id == item.id){
					hisSearch.splice(i,1)
					hisSearch.unshift(item)
					this.historyList = hisSearch
					localStorage.setItem('search',JSON.stringify(hisSearch))
					sessionStorage.setItem('pos',JSON.stringify({
						longitude: item.pos.lng,
						latitude: item.pos.lat,
						content: item.t
					}))
					this.$router.push('releaseOrder')
					return
				}
			}
			if(hisSearch.length >= 10){
				hisSearch.pop()
			}
			hisSearch.unshift(item)
			this.historyList = hisSearch
			localStorage.setItem('search',JSON.stringify(hisSearch))
			sessionStorage.setItem('pos',JSON.stringify({
				longitude: item.pos.lng,
				latitude: item.pos.lat,
				content: item.t
			}))
			this.$router.push('releaseOrder')
		},
		longtapstart (key) {
			let that = this
			this.timekey = setTimeout(function() { 
				that.$showConfirm({
					data: {
						msg: '是否删除该记录',
						t: '是',
						f: '否'
					},
					fun: function (bool) {
						if(bool){
							that.historyList.splice(key,1)
							localStorage.setItem('search',JSON.stringify(that.historyList))
						}
					}
				}) 
			}, 500	)
		},
		longtapend () {
			clearTimeout(this.timekey)
		}
	}
}
</script>
<style scoped lang="scss">
.fly-enter-active, .fly-leave-active {
  	transition: all .5s
}
.fly-enter, .fly-leave-to /* .fly-leave-active in below version 2.1.8 */ {
  	top: 110%;
  	opacity: 0;
}
.fly-enter-to,.fly-leave{
	top: 0;
	opacity: 1;
}
.search_main{
	position: fixed;
	width: 100%;
	height: 100%;
	background: #f1f1f1;
	z-index: 10000;
	.search_top{
		width: 100%;
		height: 0.88rem;
		line-height: 0.88rem;
		display: flex;
		background: #fff;
		.select_city{
			width: 1.78rem;
			font-size: 0.3rem;
			text-align: center;
			color: #444;
			position: relative;
			i{	
				display: inline-block;;
				width: 0;
				height: 0;
				font-size: 0;
				font-style: none;
				border-top: 0.1rem solid #999;
				border-left: 0.09rem solid transparent;
				border-right: 0.09rem solid transparent;
				vertical-align: middle;
				margin-left: 0.12rem;
			}
			&:after{
				content: '';
				position: absolute;
				height: 0.3rem;
				width: 0.02rem;
				background: #dedede;
				left: 100%;
				top: 50%;
				margin-top: -0.15rem;
			}
		}
		.input_address{
			height: 100%;
			width: 4.56rem;
			position: relative;
			input{
				display: block;
				width: 100%;
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
			&:after{
				content: '';
				position: absolute;
				height: 0.3rem;
				width: 0.02rem;
				background: #dedede;
				left: 100%;
				top: 50%;
				margin-top: -0.15rem;
			}
		}
		.cancel{
			width: 1.14rem;
			font-size: 0.28rem;
			text-align: center;
			color: #a9a9a9;
			height: 100%;
		}
	}
	.tip_list{
		width: 7.1rem;
		height: 12rem;
		box-sizing: border-box;
		overflow-y: auto;
		margin: 0.2rem auto 0;
		span{
			font-size: 0.3rem;
		}
		b{
			font-weight: normal;
			font-size: 0.26rem;
		}
		ul{
			background: #fff;
		}
		li{
			width: 6.5rem;
			margin: 0 auto;
			height: 1.28rem;
			line-height: 1.28rem;
			border-bottom: 0.01rem solid #efefef;
			font-size: 0;
			white-space: nowrap;
			.i{
				height: 100%;
				vertical-align: middle;
				display: inline-block;
				margin: 0 0.16rem 0 0;
				width: 0.34rem;
				text-align: center;
			}
			img{
				vertical-align: middle;
				max-height: 0.34rem;
				max-width: 0.34rem;
			}
			dl{
				display: inline-block;
				vertical-align: middle;
				height: 100%;
				width: 6rem;
				font-size: 0.3rem;
				line-height: 1;
				dt{
					margin: 0.3rem 0 0;
				}
				dd{
					margin-top: 0.12rem;
					line-height: 0.32rem;
					color: #999;
					font-size: 0.26rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
}
</style>