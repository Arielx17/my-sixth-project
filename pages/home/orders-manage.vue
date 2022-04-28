<template>
	<view>
		<view class="option">
			<view class="option-box4">
				<view @click="msg=0" :class="{'cur':msg===0}">待处理</view>
				<view @click="msg=1" :class="{'cur':msg===1}">处理中</view>
				<view @click="msg=2" :class="{'cur':msg===2}">未使用</view>
				<view @click="msg=3" :class="{'cur':msg===3}">全部</view>
			</view>
		</view>
		<view class="orders">
			<view class="order-item" v-for="(item,index) in orderList.filter(obj => {return obj.statusId === (msg === 0 ? '100' : msg === 1 ? '1010'||'1020' : msg === 2 ? '10-1' : obj.statusId)})"
				:key="index" @click="toDetail(item)">
				<view class="user" >
					<image class="userPic" :src="item.userPic" mode="aspectFill"></image>
					<view class="userName">
						{{item.userName}}
					</view>
					<view class="orderStatus">{{item.status}}</view>
				</view>
				<view class="course">
					<image class="coursePic" :src="item.picUrl" mode="aspectFill"></image>
					<view class="courseRight">
						<view>
							<view class="courseName">{{item.courseName}}</view>
							<view class="coursePrice">￥{{item.coursePrice}}</view>
						</view>
						<view class="courseNum">×{{item.courseNum}}</view>
					</view>

				</view>
				<view class="payPrice">实付款 ￥{{item.payPrice}}</view>
				<view class="payPrice">将入账金额 ￥{{item.storeMoney}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [],
				msg: 0,
				candidates: ["A", "B"],
				index: 0,
				array: ['已完成', '未完成']
			}
		},
		methods: {
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			toDetail(item){
				uni.navigateTo({
					url: './order-detail',
					events: {
						//添加一个监听器
						acceptDataFromOpenedPage: function(data) {
							console.log(data)
						},
					},
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						console.log(item)
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: item
						})
					}
				})
			},
			getOrder(shopId) {
				uni.request({
					url: this.$global.memberObj.host + 'getOrder?shopId=' + shopId,
					success: (res) => {
						console.log("成功", res)
						this.orderList = res.data
						console.log(res.data.length)
						for(var i=0 ; i < res.data.length ; i++){
							this.setStatus(res.data[i].orderStatus,res.data[i].is_agree,i)
							this.orderList[i].picUrl = this.$global.memberObj.imgPath + this.orderList[i].picUrl
						}
						console.log(this.orderList)
					},
					fail: (err) => {
						console.log("失败", err)
					}
				})
			},
			setStatus(orderStatus,is_agree,i){
				let status={
					'10-1':'订单待核销',
					'100':'订单申请退款',
					'1010':'退款中',
					'1020':'已拒绝取消',
					'20-1':'已取消',
					'30-1':'订单已完成'
				}
				let a = orderStatus.toString().concat(is_agree)
				console.log(a)
				this.$set(this.orderList[i],'status',status[a])
				this.$set(this.orderList[i],'statusId',a)
				console.log(this.orderList[i].status)
			}
		},
		onLoad() {
			this.getOrder(this.$global.memberObj.shopId)
		},
	}
</script>

<style lang="scss">
	@import "@/styles/home/home.scss";

	page {
		font-size: 28rpx;
		background-color: $uni-bg-color-purple;
		color: #515151;
	}
</style>
