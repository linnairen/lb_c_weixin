<template>
	<div class="license">
		<router-view />
	</div>
</template>
<script>
export default {
	mounted () {
		this.$emit('changeShow',false)
	}
}
</script>
<style scoped lang="scss">
.license{
	background: #f1f1f1;
}
</style>