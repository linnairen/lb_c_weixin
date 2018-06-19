<template>
	<div class="main-index">
		<div class="index-nav">
			<div class="s" @click="getIsOrdered ? isOrdered() : $router.push('mapSearch')"><img src="../img/size2/search@2x.png" alt="搜索"></div>
			<div class="l">
				<ul>
					<li v-for="(item,key) in parkData" @click="selType = key" :class="{ 'sel' : selType == key }">
						<span>{{ item.type }}</span>
					</li>
				</ul>
			</div>
			<div class="m"><span><img src="../img/size2/msg@2x.png" alt="消息"><i></i></span></div>
		</div>
		<router-view :list="parkData[selType].list" @showCo="isOrdered"></router-view>
		<!-- <time-picker :show.sync="showTimePicker" /> -->
		<div class="nowPos" v-if="state === 1 && !onload">
			<div class="i" @click="getPos"><img src="../img/size2/pos@2x.png" alt=""></div>
			<dl class="a">
				<dt><span>当前位置：</span><span class="o"><span class="d" :style="{ 'left' : addL+'em' }">{{ address }}</span></span></dt>
				<dd>是否在当前位置附近发单停车？</dd>
			</dl>
			<button class="c" @click="sendNowPos">确定</button>
		</div>
		<div class="nowPos S2" v-if="state === 2 && !onload">
			<div class="i"><img src="../img/size2/wait.png"></div>
			<dl class="a">
				<dt><span>{{ preArrivalTime }}</span></dt>
				<dd>目的地：{{ orderData.destination }}</dd>
			</dl>
			<div class="c"><div class="btn"><img src="../img/size2/redpag.png">{{ orderData.thankFee }}元</div></div>
		</div>
		<div class="nowPos S3" v-if="state === 3 && !onload">
			<div class="i"><img src="../img/size2/endtime.png" alt=""></div>
			<dl class="a">
				<dt><span>{{ preArrivalTime }}</span></dt>
				<dd>{{ orderData.destination }}</dd>
			</dl>
			<div class="c"><button>等待到场</button></div>
		</div>
		<div class="nowPos S4" v-if="state === 4 && !onload">
			<div class="i"><img src="../img/size2/wallet.png" alt=""></div>
			<dl class="a">
				<dt><span>订单金额：</span><span class="o">{{ orderData.parkFeeHourly + orderData.thankFee + orderData.delayMoney }}元</span></dt>
				<dd>{{ orderData.destination }}</dd>
			</dl>
			<div class="c"><button>等待支付</button></div>
		</div>
		<div id="hiden_map" style="display:none"></div>
	</div>
</template>
<script>
import Vue from 'vue'
import timePicker from '@c/time_picker.vue'
import token from '@/common/js/token.js'
import { mapGetters,mapActions } from 'vuex'
export default {
	data () {
		return {
			showTimePicker: false,
			addL: 0,
			address: '正在定位中...',
			nowPos: {},
			parkData: [
				{
					type: '医院',
					list: []
				},
				{
					type: '景点',
					list: []
				},
				{
					type: '商业街',
					list: []
				}
			],
			selType: 0,
			speed: -0.03,
			timeKey: null,
			state: 1,
			onload: true,
			orderData: {
				preArrivalTime: 1512977351,
				preStopTime: 1512977351,
				destination: ''
			}
		}
	},
	components: {
		timePicker
	},
	created () {
		let that = this
		this.map = new AMap.Map('hiden_map',{
		    zoom: 16,
		    mapStyle: 'amap://styles/light',
		    jogEnable: false,
		    center: [120.07484,30.28987]//new AMap.LngLat(116.39,39.9)
		});
		this.getParkList()
		this.getPos()
		this.searchOrderOn()
		// this.showConfirm = true
	},
	computed: {
		preArrivalTime () {
			let date = new Date(this.orderData.preArrivalTime * 1000)
			return this.dealTime(date)
		},
		...mapGetters([
			'getToken',
			'getIsOrdered'
		])
	},
	watch: {
		getToken () {
			this.getParkList()
			this.searchOrderOn()
		},
		address (val) {
			let that = this
			if(val.length > 13){
				that.scroll()
			}
			else{
				clearTimeout(this.timeKey)
				this.addL = 0
				this.speed = -0.03
			}
		}
	},
	mounted () {
		this.$emit('changeShow',true)
	},
	methods: {
		scroll () {
			if(this.addL + this.speed > 0.5 || this.addL + this.speed < -(this.address.length - 13)){
				this.speed = - this.speed
			}
			this.addL += this.speed
			let that = this
			this.timeKey = setTimeout(function() {
				that.scroll()
			}, 30);
		},
		dealTime (date) {
			let day = '今天',
				tomo = (new Date((new Date()).setDate() + 1)).getDate(),
				toto = (new Date((new Date()).setDate() + 1)).getDate()
			if(date.getDate() - tomo == 0 ){
				day = '明天'
			}
			else if(date.getDate() - toto == 0){
				day = '后天'
			}
			else{
				day = (date.getMonth() + 1) + '月' + date.getDate() + '日'
			}
			return day + ((date.getHours() + '').length == 1 ? '0' : '') + date.getHours() + ':' + ((date.getMinutes() + '').length == 1 ? '0' : '') + date.getMinutes()
		},
		getParkList () {
			let that = this
			if(that.getToken){
				token.getParkList(that.getToken,function (d) {
					if(d.code == 200){
						let data = d.rs
						that.parkData = []
						for(let i = 0;i < data.classList.length;i++){
							let list = []
							for(let j = 0;j < data.detailList[i].length;j++){
								list.push({
									img: data.detailList[i][j].imgUrl,
									title: data.detailList[i][j].detailName,
									detail: data.detailList[i][j].address,
									tid: data.detailList[i][j].tid
								})
							}
							that.parkData.push({
								type: data.classList[i].name,
								list: list
							})
						}
						
					}
				})
			}
		},
		getPos () {
			let that = this
			that.address = "正在定位中..."
			this.map.plugin('AMap.Geolocation', function () {
			    let geolocation = new AMap.Geolocation({
			        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
			        showButton: false,        //显示定位按钮，默认：true
			        showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
			        showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
			    });
			    that.map.addControl(geolocation);
			    geolocation.getCurrentPosition();
			    AMap.event.addListener(geolocation, 'complete', that.onComplete);//返回定位信息
			    AMap.event.addListener(geolocation, 'error', that.onError);      //返回定位出错信息
			});
		},
		onComplete (d) {
			// console.log(d)
			this.nowPos = d.position
			let address = d.formattedAddress
			if((address.indexOf('街') != -1 || address.indexOf('路') != -1) && address.indexOf('号') != -1){
	       		address = address.substr(address.indexOf('号') + 1).length > 1 ? address.substr(address.indexOf('号') + 1) : address
	       	}
	       	if(address.indexOf('市') != -1 && address.indexOf('区') != -1){
	       		address = address.substr(address.indexOf('区') + 1)
	       	}
	       	if(address.indexOf('省') != -1 && address.indexOf('市') != -1){
	       		address = address.substr(address.indexOf('市') + 1)
	       	}
			this.address = address
		},
		onError (d) {
			this.address = '定位失败'
		},
		sendNowPos () {
			if(this.state == 1){
				sessionStorage.setItem('pos',JSON.stringify({
					longitude: this.nowPos.lng,
					latitude: this.nowPos.lat,
					content: this.address
				}))
				this.$router.push('releaseOrder')
			}
			else{
				this.isOrdered()
			}
		},
		isOrdered () {
			this.$showConfirm({
				data: {
					t: '去查看',
					f: '知道了',
					msg: '你有订单未结束'
				},
				fun: function(bool,data) {
					// alert(bool ? data.t : data.f)
				}
			})
		},
		searchOrderOn () {
			let that = this
			// alert(2)
			if(that.getToken){
				token.searchOrderOn(that.getToken,function(d){
					// alert(d.rs.state)
					if(d.code == 200){
						if(d.rs){
							that.orderData = d.rs
							if(d.rs.state == 0){
								that.state = 2
								that.passIsOrdered(true)
								that.isOrdered()
							}
							else if(d.rs.state == 1){
								that.state = 3
								that.passIsOrdered(true)
								that.isOrdered()
							}
							else if(d.rs.state == 3){
								that.state == 4
								that.passIsOrdered(true)
								that.isOrdered()
							}
						}
						else{
							that.passIsOrdered(false)
						}
					}
					that.onload = false
				},function(e){
					that.onload = false
					// alert(JSON.stringify(e))
				})
			}
		},
		...mapActions([
			'passIsOrdered'
		])
	}
}
</script>
<style scoped lang="scss">
.main-index{
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	height: 100vh;
	background: #f1f1f1;
	>div:nth-child(2){
		flex-grow: 1;
	}
}
.index-nav{
	flex-shrink: 0;
	display: flex;
	background: #fff;
	margin-bottom: 0.11rem;
	align-items: center;
	height: 0.8rem;
	width: 100%;
	line-height: 0.8rem;
	img{
		width: 0.34rem;
		vertical-align: middle;
	}
	.s{
		flex-grow: 1;
		text-align: center;
	}
	.l{
		height: 100%;
		width: 5.2rem;
		ul{
			height: 100%;
			width: 100%;
			overflow-x: auto;
			white-space: nowrap;
			font-size: 0.32rem;
		}
		li{
			padding: 0 0.44rem;
			height: 100%;
			display: inline-block;
			color: #888888;
			span{
				display: inline-block;
				height: 100%;
				box-sizing: border-box;
			}
		}
		.sel{
			color: #FF9938;
			span{
				border-bottom: 0.04rem solid #FF9938;
			}
		}
	}
	.m{
		flex-grow: 1;
		text-align: center;
		span{
			display: inline-block;
			vertical-align: middle;
			line-height: 1;
			position: relative;
		}
		i{
			position: absolute;
			width: 0.1rem;
			height: 0.1rem;
			right: 0;
			top: 0;
			border-radius: 50%;
			background: #F22525;
		}
	}
}
.nowPos{
	position: fixed;
	bottom: 0.98rem;
	left: 0;
	height: 1.08rem;
	width: 100%;
	background: rgba(#5D657C, 0.9);
	display: flex;
	.i{
		width: 0.94rem;
		height: 100%;
		text-align: center;
		line-height: 1.08rem;
		img{
			width: 0.3rem;
			vertical-align: middle;
		}
	}
	.a{
		width: 5.26rem;
		overflow: hidden;
		dt{
			font-size: 0.28rem;
			overflow-x: auto;
			overflow-y: hidden;
			white-space: nowrap;
			color: #fff;
			line-height: 0.52rem;
			margin-top: 0.1rem;
			display: flex;
			>span:first-child{
				width: 5em;
			}
			.o{
				flex-grow: 1;
				overflow: hidden;
				.d{
					position: relative;
				}
			}
		}
		dd{
			font-size: 0.24rem;
			overflow-x: auto;
			white-space: nowrap;
			color: #D4D8E6;
			text-overflow: ellipsis;
		}
	}
	.c{
		width: 1.84rem;
		height: 100%;
		background: none;
		border: none;
		font-size: 0.32rem;
		color: #FF9938;
	}
}
.S2{
	.i{
		img{
			width: 0.38rem;
		}
	}
	.c{
		width: auto;
		padding-right: 0.4rem;
		line-height: 1.08rem;
	}
	.btn{
		border: none;
		background: #ff9938;
		color: #fff;
		padding: 0 0.22rem;
		height: 0.6rem;
		line-height: 0.6rem;
		white-space: nowrap;
		display: inline-block;
		vertical-align: middle;
		border-radius: 0.04rem;
		img{
			width: 0.32rem;
			height: 0.36rem;
			vertical-align: middle;
			margin-right: 0.16rem;
		}
	}
}
.S3, .S4{
	.i{
		img{
			width: 0.48rem;
		}
	}
	.c{
		width: 1.96rem;
		line-height: 1.08rem;
	}
	button{
		border: none;
		background: #ff9938;
		color: #fff;
		width: 1.56rem;
		height: 0.6rem;
		vertical-align: middle;
		border-radius: 0.04rem;
	}
}
</style>