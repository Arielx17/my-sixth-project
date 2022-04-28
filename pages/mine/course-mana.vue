<template>
	<view>
		<view class="course-info">
			<view class="name">体验课 | 儿童创想美学</view>
			<image class="pic" src="@/static/course-pic.jpg"></image>
			<view class="card">
				<view class="validity">有效期：30天</view>
				<view class="course">
					<view class="cs-name">体验课 | 儿童创想美学</view>
					<view class="num">1节</view>
					<view class="price">￥
						<text>100.00</text>
					</view>
				</view>
				<view class="stocksold">
					<view class="stock">库存：27</view>
					<view class="sold">已售出：3</view>
				</view>
			</view>
			
		</view>
		<view class="mana">
			<view class="edit" @click="toEdit">编辑</view>
			<button class="state">上架</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toEdit:function(){
				uni.navigateTo({
					url:"course/course-edit",
					events: {
						//添加一个监听器
						acceptDataFromOpenedPage: function(data) {
							console.log(data)
						},
					},
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: this.intro
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/styles/mine/course-mana.scss"

</style>
