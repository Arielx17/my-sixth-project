<template>
	<view class="content">
		<view class="title">我的业务</view>
		<view class="card">
			<navigator url="comments-manage" class="card-function">
				<text>评价管理</text>
				<view class="iconfont icon-comments" style="font-size:132rpx"></view>
			</navigator>
			<navigator url="orders-manage" class="card-function">
				<text>订单管理</text>
				<view class="iconfont icon-order" style="font-size:135rpx"></view>
			</navigator>
			<navigator url="extension" class="card-function">
				<text>门店推广</text>
				<view class="iconfont icon-credit-level" style="font-size:135rpx"></view>
			</navigator>
		</view>
		<view class="title">今日概况</view>
		<view class="today_group">
			<view class="group_item">
				<view>支付订单数</view>
				<view class="group_num">0</view>
			</view>
			<view class="group_item">
				<view>顾客数量</view>
				<view class="group_num">0</view>
			</view>
			<view class="group_item">
				<view>交易金额(元)</view>
				<view class="group_num">0.00</view>
			</view>
		</view>
		<view class="scan" @click="scanQR()">
			<view class="iconfont icon-shouye" style="font-size: 100rpx;margin: auto;color: #FFFFFF;"></view>
			<view class="scantips">扫码核销</view>
		</view>
		<!-- <view class="today_data">
			<uni-grid :column="2" :show-border="false" :square="false">
				<uniGirdItem class="grid_item">
					<text class="title">支付订单数</text>
					<text class="num">5</text>
				</uniGirdItem>
				<uniGirdItem class="grid_item">
					<text class="title">交易金额(元)</text>
					<text class="num">150.00</text>
				</uniGirdItem>
			</uni-grid>
			<uni-grid :column="2" :show-border="false" :square="false" :highlight="false">
				<uniGirdItem class="grid_item">
					<text class="title">顾客数量</text>
					<text class="num">5</text>
				</uniGirdItem>
				<uniGirdItem class="grid_item">
					<text class="title">支付订单数</text>
					<text class="num">5</text>
				</uniGirdItem>
			</uni-grid>
		</view> -->
	</view>
</template>

<script>
	import uniGirdItem from '@/uni_modules/uni-grid/components/uni-grid-item/uni-grid-item';
	export default {
		data() {
			return {
				msg: 0,
				order_id:"",
			}
		},
		components: {
			uniGirdItem,
		},
		methods:{
			scanQR:function(){
				uni.scanCode({
					success: (res) => {
						console.log('条码内容：' + res.result);
						this.order_id = res.result;
						this.orderWriteoff(res.result);
					}
				})
			},
			orderWriteoff:function(orderId){
				uni.request({
					url:'http://localhost:8081/WriteoffOrder?id=' + orderId,
					success: (res) => {
						console.log(orderId,'订单已核销',res.data)
						uni.showToast({
							title: '订单核销完成',
							duration: 2000
						});
					},
					fail: (res) => {
						console.log(orderId,'核销失败，订单已完成',res.data)
						uni.showToast({
							icon:'error',
							title: '订单已被核销',
							duration: 2000
						});
					}
				})
			}
		}
}
</script>

<style lang="scss">
	@import "@/styles/home/home.scss";

	// @import '@/styles/statistics/statistics';
	.demo-uni-row {
		margin-bottom: 10px;
		/* QQ、字节小程序文档写有 :host，但实测不生效 */
		/* 百度小程序没有 :host，需要设置block */
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
	}


	.demo-uni-col {
		height: 36px;
		border-radius: 4px;
	}

	.dark_deep {
		background-color: #99a9bf;
	}

	.dark {
		background-color: #d3dce6;
	}

	.light {
		background-color: #e5e9f2;
	}
</style>
