<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		created() {

			let path = window.location.href;
			let index = path.indexOf("#");
			path = path.substring(index + 1)
		}
	}
</script>
<style lang="less">
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box
	}

	html,
	body {
		font-family: 'Open Sans', Helvetica, Arial, sans-serif;
		background: #f5f7f9;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}

	#app {
		width: 100%;
		height: 100%;
	}

	.el-menu {
		border-right: none !important;
	}

	.el-message {
		min-width: 300px !important;
		z-index: 9999 !important;
	}

	.el-notification {
		z-index: 9999 !important;
	}
</style>