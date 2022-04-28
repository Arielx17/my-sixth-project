<template>
	
	<view class="content">
		<uni-list :border="true">
			<uni-list>
				<uniListchat title="Ariel" avatar="../../static/test.jpg" 
				note="您收到一条新的消息" time="2022-03-31 12:18" badge-positon="left" badge-text="1"></uniListchat>
			</uni-list>
		</uni-list>

	</view>
</template>

<script>
	import uniListchat from "@/uni_modules/uni-list/components/uni-list-chat/uni-list-chat"
	export default {
		components:{
			uniListchat
		}
	}
</script>

<style lang="scss">
	
</style>
