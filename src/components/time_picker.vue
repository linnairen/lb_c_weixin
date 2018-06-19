<template>
	<div class="picker_shadow" v-if="show">
		<div class="time_picker">
			<div class="check">
				<b>预计到达时间</b>
				<button class="cancel" @click="hide">取消</button><button class="confirm" @click="confirm">确认</button>
			</div>
			<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
		</div>
	</div>
</template>
<script>
export default {
	props: ['show','date','default'],
	methods: {
		onValuesChange(picker, values) {
			let selectDate = this.slots[0].values.indexOf(values[0])
			let selectHour = this.slots[1].values.indexOf(values[1])
			let selectminute = this.slots[2].values.indexOf(values[2])
			let dataList = this.dataList
			if(selectminute != -1 && this.selectminute != selectminute){
				this.selectminute = selectminute
			}
			if(selectminute != -1 && selectHour != -1 && this.selectHour != selectHour){
				let slot2 = []
				for(let i = 0;i < dataList[this.selectDate].time[selectHour].minute.length;i ++){
					slot2.push(dataList[this.selectDate].time[selectHour].minute[i] + '分')
				}
				this.slots[2].values = slot2
				this.selectHour = selectHour
				picker.setSlotValue(2,this.slots[2].values[0])
			}
			if(selectminute != -1 && selectHour != -1 && selectDate != -1 && this.selectDate != selectDate){
				let slot1 = []
				for(let i = 0;i < dataList[selectDate].time.length;i ++){
					slot1.push(dataList[selectDate].time[i].hour + '点')
				}
				this.slots[1].values = slot1
				let slot2 = []
				for(let i = 0;i < dataList[selectDate].time[this.selectHour].minute.length;i ++){
					slot2.push(dataList[selectDate].time[this.selectHour].minute[i] + '分')
				}
				this.slots[2].values = slot2
				picker.setSlotValue(1,this.slots[1].values[0])
				picker.setSlotValue(2,this.slots[2].values[0])
				this.selectDate = selectDate
			}
		},
		setDate (d) {
			let dataList = []
			let nowdate = d || new Date()
			let noToday = 0
			if(nowdate.getMinutes() > 55 && nowdate.getHours() == 23){
				noToday = 1
			}
			for(let i = 0 + noToday;i < 7 + noToday;i ++){
				let date = new Date(nowdate.getTime()+86400000*i)
				dataList[i-noToday] = {
					month: date.getMonth() + 1,
					date: date.getDate(),
					year: date.getFullYear(),
					time: []
				}
				if(i == 0){
					let noHour = 0
					if(date.getMinutes() > 55){
						noHour = 1
					}
					for (let j = date.getHours() + noHour; j < 24;j++){
						let minute = Math.ceil(date.getMinutes()/5)*5
						dataList[i-noToday].time.push({
							hour: j,
							minute: []
						})
						if (j == date.getHours()) {
							for (let m = minute; m < 60; m+=5) {
								dataList[i-noToday].time[j - date.getHours()-noHour].minute.push(m)
							}
						}
						else{
							for (let m = 0; m < 60; m+=5) {
								dataList[i-noToday].time[j - date.getHours()-noHour].minute.push(m)
							}
						}
					}
				}
				else{
					for (let j = 0; j < 24; j++) {
						dataList[i-noToday].time.push({
							hour: j,
							minute: []
						})
						for (let m = 0; m < 60; m+=5) {
							dataList[i-noToday].time[j].minute.push(m)
						}
					}
				}
			}
			this.dataList = dataList
		},
		setView (d) {
			this.setDate(d)
			this.slots[0].values = []
			this.slots[1].values = []
			this.slots[2].values = []
			let dataList = this.dataList
			for(let i = 0;i < dataList.length;i ++){
				let oth = ''
				if(i == 0){
					oth = '今天'
				}
				if(i == 1){
					oth = '明天'
				}
				if(i == 2){
					oth = '后天'
				}
				this.slots[0].values.push(dataList[i].month + '月' + dataList[i].date + '日 ' + oth)
			}
			for(let i = 0;i < dataList[0].time.length;i ++){
				this.slots[1].values.push(dataList[0].time[i].hour + '点')
			}
			for(let i = 0;i < dataList[0].time[0].minute.length;i ++){
				this.slots[2].values.push(dataList[0].time[0].minute[i] + '分')
			}
		},
		confirm () {
			let year = this.dataList[this.selectDate].year,
				month = this.dataList[this.selectDate].month,
				day =  this.dataList[this.selectDate].date,
				hour = this.dataList[this.selectDate].time[this.selectHour].hour,
				minute = this.dataList[this.selectDate].time[this.selectHour].minute[this.selectminute]
			let date = new Date(year + '-' + (('' + month).length == 1 ? ('0' + month) : month) + '-' + (('' + day).length == 1 ? ('0' + day) : day) + 'T' + (('' + hour).length == 1 ? ('0' + hour) : hour) + ':' + (('' + minute).length == 1 ? ('0' + minute) : minute) + ':00-00:00')
			this.$emit('sel',(date.getTime() - 3600000*8))
			this.hide()
		},
		hide () {
			this.$emit('update:show',false)
		},
		changeDefault () {
			let dt = this.default
			let nt = this.date
			let	selD = dt.getDate() - nt.getDate() + ((dt.getMonth() - nt.getMonth() > 0) ? 30 : 0 ),
				selH = dt.getHours() - (selD > 0 ? 0 : nt.getHours()),
				selM = parseInt(dt.getMinutes() / 5) - (selH > 0 ? 0 : parseInt(nt.getMinutes() / 5))
			this.slots[0].defaultIndex = selD
			this.slots[1].defaultIndex = selH
			this.slots[2].defaultIndex = selM
		}
	},
	data() {
		return {
			slots: [
				{
					flex: 2,
					values: [],
					className: 'slot1',
					textAlign: 'left',
                    defaultIndex: 0
				}, {
					flex: 1,
					values: [],
					className: 'slot2',
					textAlign: 'center',
                    defaultIndex: 0
				}, {
					flex: 1,
					values: [],
					className: 'slot3',
					textAlign: 'center',
                    defaultIndex: 0
				}
			],
			dataList: [],
			selectDate: 0,
			selectHour: 0,
			selectminute: 0,
			year: 2017
		}
	},
	watch: {
		date () {
			this.setView(this.date || new Date())
		},
		default () {
			this.changeDefault()
		}
	},
	mounted () {
		this.setView(this.date || new Date())
		this.changeDefault()
	}
}
</script>
<style>
.picker_shadow{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10;
}
.time_picker{
	position: absolute;
	height: 4.68rem;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #fff;
}
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
.slot1{
	padding: 0 0 0 1.28rem;
}
</style>