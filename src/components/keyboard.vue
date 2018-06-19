<template>
	<div class="keyboard">
		<ul>
			<li v-for="(item,key) in board" :style="{ 'background' : (item == '') ? '#acb3bb' : '#fff' }" @click="input(item)">{{item ? item : ''}}</li><li @click="cancel" class="cancel"><<</li>
		</ul>
	</div>
</template>
<script>
export default {
	data () {
		return {
			boardData: [
				["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
				["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
				["京","沪","鄂","湘","川","渝","粤","闽","晋","黑","津","浙","豫","赣","贵","青","琼","宁","吉","蒙","冀","苏","皖","桂","云","陕","甘","藏","新","辽","鲁"],
				['港','澳']
			],
			board: []
		}
	},
	props: ['type'],
	watch: {
		type () {
			this.setBoard(this.type || 'code')
		}
	},
	methods: {
		setBoard (type) {
			let arr = []
			if(type == 'code'){
				arr = [...this.boardData[0],...this.boardData[1],...this.boardData[3]]
				for(let  i = arr.length;i<38;i++){
					arr.push(false)
				}
			}
			else if(type == 'str'){
				arr = [...this.boardData[2]]
				for(let  i = arr.length;i<38;i++){
					arr.push(false)
				}
			}
			this.board = arr
		},
		input (item) {
			item && this.$emit('input',item)
		},
		cancel () {
			this.$emit('cancel')
		}
	},
	created () {
		this.setBoard(this.type || 'code')
	}
}
</script>
<style scoped>
.keyboard{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
.keyboard ul{
	padding: 0.2rem 0;
	background: #d0d5d9;
}
.keyboard li{
	display: inline-block;
	width: 0.55rem;
	margin: 0.15rem 0 0 0.18rem;
	font-size: 0.3rem;
	text-align: center;
	height: 0.75rem;
	line-height: 0.75rem;
	vertical-align: middle;
	box-shadow: 0 0.04rem 0.05rem rgba(0,0,0,0.6);
	background: #fff;
	transition: all 0.5s;
	border-radius: 0.1rem;
}
/*.keyboard li:hover{
	box-shadow: none;
}*/
.keyboard li:active{
	box-shadow: none;
}
.keyboard .cancel{
	width: 1rem;
	margin-left: 0.46rem;
	background: #acb3bb;
}
</style>