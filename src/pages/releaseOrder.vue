<template>
	<div class="map">
		<div id="main_map" tabindex="0" :class="{ 'onwait' : onwait}"></div>
		<div class="map_bottom" v-if="!ifLoad && !onwait">
			<div class="main_info">
				<div class="info">
					<div class="addr">
						<div class="img"><img src="../img/point.png" alt=""></div>
						<dl>
							<dt>目的地：{{ posInfo.detailName }}</dt>
							<dd>{{ posInfo.address }}</dd>
						</dl>
						<div class="SCar" @click="onselectCar = !onselectCar;selectCar = finalSCar">{{ carList[finalSCar].plateNo }} ></div>
					</div>
					<div class="pay">
						<p><b>附近步行路程{{ defaultRange }}KM内为您找到<span>{{ parkAmount }}</span>家停车场</b><b v-show="parkPay">停车费为<span>{{ parkPay }}</span>元/小时</b><b v-show="appointPay">预约费为<span>{{ appointPay }}</span>元</b></p>
					</div>
				</div>
				<div class="t_m">
					<div class="t" @click="showTimePicker = !showTimePicker">
						<img src="../img/size2/time.png" alt=""><span>{{ arrTime }}</span>
					</div>
					<div class="bd"></div>
					<div class="m" @click="showS_charge = !showS_charge;selS_charge = selCharge">
						<img src="../img/size2/money.png" alt=""><span>加急费</span>
					</div>
				</div>
				<div class="btn">
					<button @click="saveOrder">确认发布</button>
				</div>
			</div>
			<time-picker :show.sync="showTimePicker" v-if="showTimePicker" :date="new Date()" @sel="selTime" :default="pickerTime"></time-picker>
	      	<!-- 加急费选择 -->
			<div class="S_charge" v-if="showS_charge">
				<div class="check">
		        	<b>添加服务加急费</b>
		        	<button class="cancel" @click="otherCharge ? (otherCharge = false) : (showS_charge = !showS_charge);selS_charge = null">取消</button><button class="confirm" @click="confirm" v-show="otherCharge">确认</button>
		      	</div>
		      	<div class="S" v-show="!otherCharge">
		      		<ul class="L">
		      			<li v-for="(item,key) in S_chargeList" :key="key" @click="selS_charge = key" :class="{ 'sel' : selS_charge == key }">{{ item }}元</li><li @click="selS_charge = null;otherCharge = !otherCharge">其他</li>
		      		</ul>
		      		<div class="T">
		      			<img src="../img/size2/tip.png" alt=""><span>增加加急费可以使停车场更快速接单</span>
		      		</div>
		      		<div class="btn">
						<button @click="selCharge = selS_charge;selS_charge = null;showS_charge = !showS_charge">确定</button>
					</div>
		      	</div>
		      	<div class="O" v-if="otherCharge">
		      		<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
		      	</div>
			</div>
			<!-- 车辆选择 -->
			<div class="S_charge changeCar" v-if="onselectCar">
				<div class="check">
		        	<b>更改车辆</b>
		        	<button class="cancel" @click="onselectCar = !onselectCar;selectCar = finalSCar">取消</button>
		      	</div>
		      	<div class="S" v-show="!otherCharge">
		      		<ul class="L">
		      			<li v-for="(item,key) in carList" :key="key" @click="selectCar = key" :class="{ 'sel' : selectCar == key }">{{ item.plateNo }}</li><li @click="$router.push('license/addCar')">+</li>
		      		</ul>
		      		<div class="btn">
						<button @click="finalSCar = selectCar;onselectCar = !onselectCar">确定</button>
					</div>
		      	</div>
			</div>
			<div class="noPark" v-if="noPark">
				<div class="i"><img src="../img/size2/nopark.png" alt=""></div>
				<div class="t"><span>该地点{{ defaultRange }}KM内暂无闲置车位</span><span v-show="defaultRange < 5">，我们为您推荐以下位置</span><span v-show="defaultRange == 5">，换个地方试试吧</span></div>
				<div class="r">
					<ul v-show="parkList.length > 0" :style="{ 'left' : parkLeft / 100 + 'rem' }" :class="{ 'trs' : onscroll }" @touchstart="tapPark" @touchmove="scrollPark" @touchend="endtapPark">
						<li v-for="(item,key) in parkList">
							<div class="title"><span>{{ item.detailName }}<i>推荐</i></span></div>
							<div class="address"><span>{{ item.address }}</span></div>
						</li>
					</ul>
				</div>
				<div class="b" v-show="defaultRange < 5"><button @click="onHere">这附近发单</button></div>
				<div class="b" style="margin-top: 0.5rem" v-show="defaultRange == 5"><button @click="$router.go(-1)">返回上一步</button></div>
			</div>
		</div>
		<div class="nowPos S2" v-if="onwait">
			<div class="i"><img src="../img/size2/wait.png"></div>
			<dl class="a">
				<dt><span>{{ '已经为您通知'+ parkAmount +'家停车场，请稍等…' }}</span></dt>
				<dd>预计{{ arrTime }}到</dd>
			</dl>
			<div class="c"><div class="btn"><img src="../img/size2/redpag.png">{{ charge }}元</div></div>
		</div>
	</div>
</template>
<script>
import timePicker from '@c/time_picker.vue'
import { mapGetters } from 'vuex'
import token from '../common/js/token.js'
export default {
	data () {
		return {
			address: "蒋村街道紫霞街68号中节能·西溪首座",
			nowPos: {},
			posInfo: { longitude: '',latitude: '' },
			showTimePicker: false,
			showS_charge: false,
			S_chargeList: [],
			selS_charge: 0,
			selCharge: 0,
			arriveTime: (new Date()),
			pickerTime: (new Date()),
			defaultRange: 0.8,
			slots: [
				{
		          flex: 1,
		          values: [0],
		          className: 'moneySlot',
		          textAlign: 'center',
		          defaultIndex: 0
		        }
			],
			otherCharge: false,
			selIndex: 0,
			parkPay: '',
			appointPay: '',
			parkAmount: 0,
			otherMax: 0,
			noPark: false,
			city: '杭州市',
			markers: {},
			carList: [
				{
					plateNo: '浙A66666'
				}
			],
			parkList: [],
			ifLoad: true,
			startTouchX: 0,
			parkLeft: 0,
			pX: 0,
			onscroll: false,
			selectPark: 0,
			selectCar: 0,
			finalSCar: 0,
			firstTime: true,
			onselectCar: false,
			onwait: false,
			runState: 0
		}
	},
	components: {
		timePicker
	},
	created () {
		if(this.$route.query.tid){
			this.getParkInfo()
		}
	},
	watch: {
		getToken () {
			this.getParkInfo()
		},
		arriveTime (val) {
			let that = this
			token.getPay(that.getToken,{
				lat: that.posInfo.latitude,
				lng: that.posInfo.longitude,
				preArrivalTime: that.firstTime ? '' : parseInt(val.getTime() / 1000)
			},function(d){
				// alert(JSON.stringify(d))
				if(d.code == 200){
					that.appointPay = d.rs.preArrivalFee
					that.parkPay = d.rs.parkFee
					that.parkAmount = d.rs.parkAmount
					that.otherMax = d.rs.other
					that.defaultRange = d.rs.defaultRange
					if(d.rs.lists){
						that.S_chargeList
						d.rs.lists.map(function(item){
							that.S_chargeList.push(item)
						})
					}
				}
			})
		},
		otherMax (val) {
			if(typeof val == 'number'){
				this.slots[0].values = []
				for(let i = 0;i < val;i ++){
					this.slots[0].values.push(i)
				}
			}
		},
		runState (val) {
			if(val == 1){
				this.getPos()
			}
			else if(val == 2){

			}
			else if(val == 3){

			}
			else if(val == 4){

			}
			else {

			}
		}
	},
	computed: {
		arrTime () {
			if(this.firstTime){
				return '预计到达时间'
			}
			let time = this.arriveTime
			let now = new Date()
			let day = ''
			if(time.getDate() - now.getDate() == 0){
				day = '今天'
			}
			if(time.getDate() - (new Date(now.getTime() + 86400000)).getDate() == 0){
				day = '明天'
			}
			if(time.getDate() - (new Date(now.getTime() + 86400000 * 2)).getDate() == 0){
				day = '后天'
			}
			if(time.getDate() - (new Date(now.getTime() + 86400000 * 3)).getDate() >= 0 || time.getDate() - (new Date(now.getTime() + 86400000 * 2)).getDate() <= -20){
				day = (time.getMonth() + 1) + '月' + time.getDate() + '日'
			}
			let str =  day + ((time.getHours() + '').length < 2 ? '0' : '') + time.getHours() + ':' + ((time.getMinutes() + '').length < 2 ? '0' : '') + time.getMinutes() 
			return str
		},
		charge () {
			if(this.selCharge != null){
				return this.S_chargeList[this.selCharge]
			}
			else{
				return this.slots[0].values[this.slots[0].defaultIndex]
			}
		},
		...mapGetters([
			'getToken',
			'getIsLogin'
		])
	},
	mounted () {
		let that = this
		this.$emit('changeShow',false)
		this.map = new AMap.Map('main_map',{
		    zoom: 16,
		    mapStyle: 'amap://styles/light',
		    jogEnable: false,
		    center: [120.07484,30.28987]//new AMap.LngLat(116.39,39.9)
		})
		this.getPos()
	},
	methods: {
		selTime (date) {
			this.arriveTime = new Date(date)
			this.pickerTime = new Date(date)
			this.firstTime = false
		},
		getPos () {
			let that = this
			this.map.plugin('AMap.Geolocation', function () {
			    let geolocation = new AMap.Geolocation({
			        enableHighAccuracy: true,//是否使用高精度定位，默认:true
			        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
			        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
			        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
			        showButton: true,        //显示定位按钮，默认：true
			        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
			        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
			        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
			        panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
			        // zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			    });
			    that.map.addControl(geolocation);
			    geolocation.getCurrentPosition();
			    AMap.event.addListener(geolocation, 'complete', that.onComplete);//返回定位信息
			    AMap.event.addListener(geolocation, 'error', that.onError);      //返回定位出错信息
			})
		},
		getCar () {
			let that = this
			token.getCar(that.getToken,function(d){
				if(d.code == 200){
					if(d.rs.length == 0){
						that.$router.push('license/addCar')
					}
					else{
						// alert(JSON.stringify(d.rs))
						that.carList = []
						for(let i = 0;i < d.rs.length;i ++){
							if(d.rs[i].isChecked == 1){
								that.selectCar = i
							}
							that.carList.push(d.rs[i])
						}
						that.showTimePicker = true
						that.showS_charge = true
					}
				}
			})
		},
		onComplete (d) {
			// console.log(d)
			let address = d.formattedAddress
			let that = this
	       	if(address.indexOf('市') != -1 && address.indexOf('区') != -1){
	       		address = address.substr(address.indexOf('区') + 1)
	       	}
	       	if(address.indexOf('省') != -1 && address.indexOf('市') != -1){
	       		address = address.substr(address.indexOf('市') + 1)
	       	}
	       	that.ifLoad = false
			this.address = address
			this.nowPos = d.position
			this.city = d.addressComponent.city
			this.setMarker({
				position: d.position,
				icon: require('../img/size2/start.png'),
				type: 'start'
			})
			this.map.setFitView()

			if(this.$route.query.tid){
				if(!this.onwait){
					this.setPreTime(d)
				}
			}
			else{
				this.getParks()
			}
		},
		setPreTime (d) {
			let that = this
			AMap.service('AMap.Driving',function(){//回调函数
			    //实例化Driving
			    let driving= new AMap.Driving({city: that.city });
			    //TODO: 使用driving对象调用驾车路径规划相关的功能
			    driving.search(d.position,new AMap.LngLat(that.posInfo.longitude,that.posInfo.latitude),function(status, result){
					// console.log(status, result,result.routes[0].time)
					that.arriveTime = that.firstTime ? new Date() : new Date(new Date().getTime() + result.routes[0].time * 1000)
					that.pickerTime = new Date(new Date().getTime() + result.routes[0].time * 1000)
				})
			})
		},
		onError (d) {
	       	this.ifLoad = false
	       	if(this.$route.query.tid){
				this.setPreTime(d)
			}
			else{
				this.getParks()
			}
			console.log(d)
		},
		onValuesChange (picker, values) {
			// console.log(this.slots[0].values.indexOf(values[0]))
			this.selIndex = this.slots[0].values.indexOf(values[0]) != -1 ? this.slots[0].values.indexOf(values[0]) : 0
		},
		confirm () {
			this.otherCharge = false
			this.showS_charge = false
			this.slots[0].defaultIndex = this.selIndex
		},
		setMarker (obj) {
			let that = this
			let position = new AMap.LngLat(obj.position.lng,obj.position.lat)
			if(obj.type && this.markers[obj.type]){
				this.map.remove(this.markers[obj.type])
			}
			this.markers[obj.type] = new AMap.Marker({
				map: that.map,
				position: position,
				icon: obj.icon || require('../img/size2/P.png'),
				offset: new AMap.Pixel(0,0)
			})
		},
		getParkInfo () {
			let that = this
			token.getParkInfo(this.getToken,this.$route.query,function(d){
				if(d.code == 200){
					that.posInfo = d.rs
					that.map && that.map.setCenter(new AMap.LngLat(d.rs.longitude,d.rs.latitude))
					that.setMarker({
						position: {
							lat: d.rs.latitude,
							lng: d.rs.longitude,
							type: 'end'
						},
						icon: require('../img/size2/end.png')
					})
					that.getCar()
				}
			})
		},
		getParks () {
			let that = this 
			let pos = JSON.parse(sessionStorage.getItem('pos'))
			// alert(sessionStorage.getItem('pos'))
			that.setMarker({
				position: {
					lat: pos.latitude,
					lng: pos.longitude,
					type: 'end'
				},
				icon: require('../img/size2/end.png')
			})
			that.map.setFitView()
			token.getSearch(that.getToken,pos,function(d){
				if(d.code == 200){
					// alert(JSON.stringify(d.rs))
					if(d.rs == 0){
						that.defaultRange = 5
						that.noPark = true
					}
					else if(d.rs == 1){
						that.setPreTime({
							position: new AMap.LngLat(pos.longitude,pos.latitude)
						})
						that.getCar()
					}
					else{
						that.noPark = true
						that.parkList = d.rs
					}
				}
				// token.getRec(that.getToken,{
				// 	cityName: that.city.replace('市', '')
				// },function(data){
				// })
				// alert(JSON.stringify(d.rs))
			})
		},
		scrollPark (e) {
			let moveX = e.touches[0].clientX - this.startTouchX
			this.startTouchX = e.touches[0].clientX
			this.parkLeft += moveX
			this.onscroll = false
			// console.log(moveX)
		},
		tapPark (e) {
			this.startTouchX = e.touches[0].clientX
			this.pX = this.parkLeft
		},
		endtapPark () {
			this.onscroll = true
			let L = - this.parkLeft / 250
			let X = this.parkLeft - this.pX
			if(L > 3 * (this.parkList.length - 1)){
				this.parkLeft = - 3 * (this.parkList.length - 1) * 250
			}
			else if(L < 0){
				this.parkLeft = 0
			}
			else if(L % 3 < 1){
				this.parkLeft = - (L - (L % 3)) * 250
			}
			else if(L % 3 > 2){
				this.parkLeft = - (L - (L % 3) + 3) * 250
			}
			else{
				if(X > 0){
					this.parkLeft = - (L - (L % 3)) * 250
				}
				else{
					this.parkLeft = - (L - (L % 3) + 3) * 250
				}
			}
			this.selectPark = Math.abs(this.parkLeft / 750)
		},
		onHere () {
			// alert('/releaseOrder?tid='+this.parkList[this.selectPark].tid)
			this.$router.push('/releaseOrder?tid='+this.parkList[this.selectPark].tid)
			// this.posInfo = this.parkList[this.selectPark]
			this.noPark = false
			this.getCar()
		},
		saveOrder () {
			let that = this
			if(that.firstTime){
				that.showTimePicker = true
				return
			}
			token.saveOrder(that.getToken,{
				destinationGaodeLng: that.posInfo.longitude,
				destinationGaodeLat: that.posInfo.latitude,
				destination: that.address,
				preArrivalTime: parseInt(that.pickerTime.getTime()/1000),
				thankFee: that.charge,
				cityName: that.city,
				userCarId: that.carList[that.selectCar].tid
			},function(d){
				// alert(JSON.stringify(that.onwait))
				if(d.code == 200){
					that.onwait = true
				}
				// alert(JSON.stringify(d))
			})
		}
	}
}
</script>
<style lang="scss">
.map{
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	#main_map{
		.amap-logo{
			display: none !important;
		}
		.amap-copyright{
			display: none !important;
		}
		.amap-geolocation-con{
			z-index: 100 !important;
		}
		.amap-markers{
			.amap-icon{
				img{
					width: 0.38rem;
					height: 0.62rem;
					margin: -0.52rem 0 0 -0.19rem;
				}
			}
		}
	}
	.onwait{
		.amap-geolocation-con{
			bottom: 1.2rem !important;
		}
	}
}
#main_map{
	width: 100%;
	flex: 1;
}
.map_bottom{
	height: 4.68rem;
	width: 100%;
	background: #fff;
	position: relative;
	z-index: 101;
	overflow: hidden;
}
.main_info{
	width: 100%;
	height: 100%;
	.info{
		width: 6.9rem;
		margin: 0 auto;
		height: 2.43rem;
		border-bottom: 0.01rem solid #efefef;
		box-sizing: border-box;
		padding: 0.26rem 0 0;
		.addr{
			position: relative;
			padding-left: 0.64rem;
			width: 5.62rem;
			height: 1.35rem;
			.img{
				position: absolute;
				left: 0;
				top: 0;
				width: 0.64rem;
				height: 0.56rem;
				display: flex;
				justify-content: center;
				align-items: center;
				img{
					width: 0.22rem;
					height: 0.22rem;
				}
			}
			dt{
				line-height: 0.52rem;
				font-size: 0.32rem;
			}
			dd{
				font-size: 0.26rem;
				line-height: 0.36rem;
				color: #A9A9A9;
			}
			.SCar{
				position: absolute;
				top: 0;
				right: -0.6rem;
				height: 0.54rem;
				line-height: 0.54rem;
				width: 2rem;
				font-size: 0.3rem;
				border: 0.01rem solid #c8c8c8;
				text-align: center;
				background: #fff;
				color: #ff9938;
			}
		}
		.pay{
			padding-left: 0.64rem;
			line-height: 0.36rem;
			width: 5.62rem;
			font-size: 0.24rem;
			color: #666;
			b{
				// display: inline-block;
				float: left;
				height: 0.36rem;
				position: relative;
				padding-left: 0.19rem;
				font-weight: normal;
				&:before{
					content: '';
					position: absolute;
					top: 50%;
					left: 0;
					margin: -0.045rem  0 0;
					width: 0.09rem;
					height: 0.09rem;
					border-radius: 100%;
					background: #ff9938;
				}
				&:nth-child(2){
					margin-right: 0.12rem;
				}
			}
			span{
				color: #ff9938;
			}
		}
	}
	.t_m{
		display: flex;
		height: 1.04rem;
		line-height: 1.04rem;
		align-items: center;
		font-size: 0.28rem;
		span{
			display: inline-block;
			vertical-align: middle;
		}
		.t{
			flex: 1;
			text-align: center;
			img{
				width: 0.28rem;
				height: 0.28rem;
				vertical-align: middle;
				margin-right: 0.16rem;
			}
		}
		.bd{
			width: 0;
			border: 0.01rem solid #efefef;
			height: 0.42rem;
		}
		.m{
			flex: 1;
			text-align: center;
			img{
				width: 0.20rem;
				height: 0.25rem;
				vertical-align: middle;
				margin-right: 0.16rem;
			}
		}
	}
	.btn{
		text-align: center;
		button{
			border: none;
			width: 7.1rem;
			height: 0.9rem;
			background: #5D657C;
			border-radius: 0.04rem;
			font-size: 0.32rem;
			color: #fff;
		}
	}
}
.S_charge{
	height: 100%;
	position: absolute;
	width: 100%;
	top: 0;
	left: 0;
	background: #fff;
	.check{
	  	width: 100%;
	  	height: 1.1rem;
	  	line-height: 1.1rem;
	  	text-align: center;
	  	position: relative;
	  	font-size: 0.32rem;
	  	border-bottom: 0.02rem solid #eee;
	}
	.check button{
	  	border: none;
	  	font-size: 0.3rem;
	  	background: none;
	  	height: 100%;
	  	position: absolute;
	  	top: 0;
	  	padding: 0 0.36rem;
	}
	.cancel{  
	  	color: #ccc;
	  	left: 0;
	}
	.confirm{
	  	color: #d09a56;
	  	right: 0;
	}
	.S{
		padding: 0.66rem 0 0;
		.L{
			text-align: center;
			li{
				display: inline-block;
				width: 1.38rem;
				height: 0.54rem;
				text-align: center;
				line-height: 0.54rem;
				font-size: 0.32rem;
				box-sizing: border-box;
				border: 0.01rem solid #c8c8c8;
				margin-right: 0.3rem;
				&:last-child{
					margin-right: 0;
				}
			}
			.sel{
				border-color: #ff9938;
				color: #ff9938;
			}
		}
		.T{
			margin-top: 0.47rem;
			height: 0.26rem;
			line-height: 0.26rem;
			color: #999;
			text-align: center;
			img{
				height: 0.26rem;
				vertical-align: middle;
				margin-right: 0.1rem;
			}
		}
		.btn{
			text-align: center;
			padding-top: 0.6rem;
			button{
				border: none;
				width: 7.1rem;
				height: 0.9rem;
				background: #5D657C;
				border-radius: 0.04rem;
				font-size: 0.32rem;
				color: #fff;
			}
		}
	}
}
.changeCar{
	color: #888;
	.S{
		padding: 0;
		.btn{
			padding-top: 0;
		}
		.L{
			height: 2.57rem;
			display: flex;
			align-items: center;
			align-content: center;
			flex-wrap: wrap;
			justify-content: space-around;
			li{
				width: 2rem;
				font-size: 0.3rem;
				margin: 0 0 0.2rem 0;
			}
		}

	} 
}
.noPark{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #fff;
	text-align: center;
	padding-top: 0.55rem;
	box-sizing: border-box;
	font-size: 0.28rem;
	line-height: 1;
	.i{
		margin-bottom: 0.55rem;
		font-size: 0;
		img{
			height: 0.42rem;
		}
	}
	.t{
		margin-bottom: 0.5rem;
		color: #999;
	}
	.r{
		margin-bottom: 0.48rem;
		ul{
			white-space: nowrap;
			width: 100%;
			position: relative;
			left: 0;
		}
		.trs{
			transition: all 1s;
		}
		li{
			display: inline-block;
			width: 100%;
		}
		.title{
			margin-bottom: 0.2rem;
			font-size: 0.32rem;
			span{
				position: relative;
			}
			i{
				padding: 0 0.06rem;
				border-radius: 0.04rem;
				line-height: 1.6;
				color: #fff;
				background: #13dcb1;
				font-size: 0.2rem;
				position: absolute;
				left: 105%;
				top: 5%;
				white-space: nowrap;
				font-style: normal;
			}
		}
		.address{
			color: #888;
		}
	}
	.b{
		button{
			color: #fff;
			background: #5D657C;
			width: 7.1rem;
			height: 0.9rem;
			font-size: 0.32rem;
			border: none;
		}
	}
}
.nowPos{
	position: fixed;
	bottom: 0;
	left: 0;
	height: 1.08rem;
	width: 100%;
	background: rgba(#5D657C, 0.9);
	display: flex;
	z-index: 200;
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
			color: #D4D8E6;
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

// ...............set for map

</style>