<template>
	<div class="map_search">
		<div class="search_top">
			<div class="select_city" @click="onselectCity = !onselectCity"><span>{{ city }}</span><i></i></div>
			<div class="input_address" @click="onsearch = true"><input type="text" disabled="disabled" placeholder="你要在哪附近停车"></div>
			<div class="cancel" @click="$router.replace('index')"><span>取消</span></div>
		</div>
		<div id="search_map" tabindex="0" @touchstart="setStartPoint" @mousedown="setStartPoint" @touchend="getNew" @mouseup="getNew"></div>
		<div class="nowPos">
			<div class="i" @click="getPos"><img src="../img/size2/pos@2x.png" alt=""></div>
			<dl class="a">
				<dt><span class="o">{{ address }}</span></dt>
				<dd>{{ moreAddress }}</dd>
			</dl>
			<button class="c" @click="sendNowPos">确定</button>
		</div>
		<div class="center_point" :class="{ 'shake' : isShake }">
			<img src="../img/size2/定位@2x.png" />
			<div class="setHere">在这附近停车</div>
		</div>
		<search :city="city" @onsearch="onsearch = !onsearch" v-if="onsearch" @onselectCity="onselectCity = !onselectCity" />
		<select-city :city="city" :onselect.sync="onselectCity" />
	</div>
</template>
<script>
import selectCity from '@c/select_city.vue'
import search from '@c/search.vue'
export default{
	data () {
		return {
			address: "中节能·西溪首座",
			moreAddress: "浙江省杭州市西湖区蒋村街道紫霞街62号中节能·西溪首座",
			nowPos: {},
			onselectCity: false,
			onsearch: false,
			city: '杭州市',
			nowCity: '杭州市',
			isShake: false,
			start_point: { x: '', y: '' }
		}
	},
	components: {
		selectCity,
		search
	},
	watch: {
	},
	created () {
	},
	mounted () {
		let that = this
		this.$emit('changeShow',false)
		
		this.map = new AMap.Map('search_map',{
		    zoom: 16,
		    mapStyle: 'amap://styles/light',
		    jogEnable: false,
		    center: [120.07484,30.28987]//new AMap.LngLat(116.39,39.9)
		});
		this.getPos()
	},
	methods: {
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
			        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
			        // zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			    });
			    that.map.addControl(geolocation);
			    geolocation.getCurrentPosition();
			    AMap.event.addListener(geolocation, 'complete', that.onComplete);//返回定位信息
			    AMap.event.addListener(geolocation, 'error', that.onError);      //返回定位出错信息
			});
		},
		dealAddress (address) {
			if((address.indexOf('街') != -1 || address.indexOf('路') != -1) && address.indexOf('号') != -1){
	       		address = address.substr(address.indexOf('号') + 1).length > 1 ? address.substr(address.indexOf('号') + 1) : address
	       	}
	       	if(address.indexOf('市') != -1 && address.indexOf('区') != -1){
	       		address = address.substr(address.indexOf('区') + 1)
	       	}
	       	if(address.indexOf('省') != -1 && address.indexOf('市') != -1){
	       		address = address.substr(address.indexOf('市') + 1)
	       	}
			return address
		},
		onComplete (d) {
			let address = d.formattedAddress
			this.city = d.addressComponent.city
			this.nowCity = d.addressComponent.city
	       	this.moreAddress = address
			this.address = this.dealAddress(address)
			this.nowPos = d.position
		},
		onError (d) {
			console.log(d)
			this.address = '定位失败'
		},
		setStartPoint (e) {
			if(e.changedTouches){
				this.start_point = {
					x: e.changedTouches[0].clientX,
					y: e.changedTouches[0].clientY
				}
			}
		},
		getNew (e) {
			let that = this
			if(e.changedTouches){
				let changX = Math.abs(e.changedTouches[0].clientX - that.start_point.x)
				let changY = Math.abs(e.changedTouches[0].clientY - that.start_point.y)
				if(Math.sqrt(changX*changX+changY*changY) < document.body.offsetWidth/20){
					return
				}
			}
			clearTimeout(that.timeoutKey)
			that.isShake = true
			that.timeoutKey = setTimeout(function(){
				that.getNewPos()
				that.isShake = false
			},2000)
		},
		getNewPos () {
			let that = this
			var center_pos = that.map.getCenter()
			AMap.service('AMap.Geocoder',function(){//回调函数
			    //实例化Geocoder
			    var geocoder = new AMap.Geocoder({
			        city: "010"//城市，默认：“全国”
			    });
			    var lnglatXY=[center_pos.N, center_pos.Q];//地图上所标点的坐标
				geocoder.getAddress(that.map.getCenter(), function(status, result) {
				    if (status === 'complete' && result.info === 'OK') {
				       	//获得了有效的地址信息:
				       	//即，result.regeocode.formattedAddress
				       	// console.log(result.regeocode.addressComponent)
				       	// let address = result.regeocode.addressComponent
				       	// console.log(result)
				       	let address = result.regeocode.formattedAddress
				       	that.moreAddress = address
						that.address = that.dealAddress(address)
				       	that.nowPos = {
				       		'longitude': center_pos.N,
				       		'latitude': center_pos.Q
				       	}
				    }else{
				       //获取地址失败
				       console.log(result)
				    }
				}); 
			})
		},
		sendNowPos () {
			sessionStorage.setItem('pos',JSON.stringify({
				longitude: this.nowPos.lng,
				latitude: this.nowPos.lat
			}))
			this.$router.push('releaseOrder')
		}
	}
}
</script>

<style lang="scss">
.map_search{
	position: absolute;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	.search_top{
		width: 100%;
		height: 0.88rem;
		line-height: 0.88rem;
		display: flex;
		background: #fff;;
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
	.nowPos{
		position: fixed;
		// bottom: 0.98rem;
		bottom: 0;
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
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: #fff;
				line-height: 0.52rem;
				margin-top: 0.1rem;
			}
			dd{
				font-size: 0.24rem;
				color: #D4D8E6;
				white-space: nowrap;
				overflow: hidden;
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
	#search_map{
		flex: 1;
		.amap-logo{
			display: none !important;
		}
		.amap-copyright{
			display: none !important;
		}
		.amap-geolocation-con{
			z-index: 100 !important;
			bottom: 1.28rem !important;
			left: 0.2rem !important;
			width: 0.88rem !important;
			height: 0.88rem !important;
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
}
.shake{
	animation: marker 2s infinite;
	.setHere{
		display: none;
	}
}
@keyframes marker{
	0% { transform: translate(0,0) }
	25% { transform: translate(0,-30%) }
	50% { transform: translate(0,0) }
	75% { transform: translate(0,-30%) }
	100% { transform: translate(0,0) }
}
.center_point{
	position: absolute;
	width: 0.4rem;
	height: 0.71rem;
	top: 50%;
	left: 50%;
	margin: -0.355rem 0 0 -0.2rem;
	img{
		width: 100%;
		height: 100%;
	}
	.setHere{
		width: 2.13rem;
		height: 0.6rem;
		font-size: 0.24rem;
		color: #666;
		position: absolute;
		bottom: 110%;
		left: 50%;
		margin-left: -1.065rem;
		background: #fff;
		border-radius: 0.3rem;
		text-align: center;
		line-height: 0.6rem;
		box-shadow:0 0 0.2rem 0 rgba(157,170,197,0.50);
	}
}
</style>