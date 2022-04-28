<template>
	<view class="content">
		<view class="status-item">
			<view class="apply" v-if="orderList.statusId === '100'">
				<view class="apply-tip">订单申请取消中</view>
				<view class="apply-reason">申请理由: {{orderList.userReason}}</view>
				<view class="button">
					<view @click="reject" class="reject">拒绝</view>
					<view @click="agree" class="agree">同意</view>
				</view>
			</view>
		</view>
		<view class="order-item">
			<view class="user">
				<image class="userPic" :src="orderList.userPic" mode="aspectFill"></image>
				<view class="userName">
					{{orderList.userName}}
				</view>
				<view class="orderStatus">{{orderList.status}}</view>
			</view>
			<view class="course">
				<image class="coursePic" :src="orderList.picUrl" mode="aspectFill"></image>
				<view class="courseRight">
					<view>
						<view class="courseName">{{orderList.courseName}}</view>
						<view class="coursePrice">￥{{orderList.coursePrice}}</view>
					</view>
					<view class="courseNum">×{{orderList.courseNum}}</view>
				</view>

			</view>
			<view class="leftright">
				<view class="payCoupon">优惠券抵扣</view>-￥{{orderList.payCoupon}}
			</view>
			<view class="leftright">
				<view class="payPrice">实付款</view>
				<view>￥{{orderList.payPrice}}</view>
			</view>
			<view class="leftright">
				<view class="payPrice">将入账金额</view>
				<view>￥{{orderList.storeMoney}}</view>
			</view>
		</view>
		<view class="detail">
			<view class="leftright2">
				<view>订单号: </view>{{orderList.order_no}}
			</view>
			<view class="leftright2">
				<view>下单时间: </view>{{orderList.create_time}}
			</view>
			<view class="leftright2">
				<view>支付来源: </view>{{payType}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: {},
				payType: '',
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('acceptDataFromOpenerPage', (data) => {
				console.log(data)
				this.orderList = data.data
				console.log(this.orderList)
				this.payType = this.orderList.payType === 10 ? '余额支付' : '微信支付'
			})
		},
		methods: {
			agree: function() {
				uni.request({
					url: this.$global.memberObj.host + 'agreeApply?orderId=' + this.orderList.order_id,
					success: (res) => {
						console.log("成功啦", res)
						uni.navigateBack({
							success: (e) => {
								var page = getCurrentPages().pop();
								if (page == undefined || page == null) return;
								page.onLoad();
							}
						})
					},
					fail: (err) => {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/styles/home/home.scss";
</style>
