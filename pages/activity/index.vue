<template>
	<view class="content">
		<!-- 热门活动轮播 -->
		<uni-swiper-dot :info="info" :current="current" field="imgSrc" :mode="mode">
			<swiper class="swiper-box" @change="change">
				<swiper-item v-for="(item,index) in info" :key="index">
					<image :src="item.imgSrc" mode="aspectFill" ></image>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		
		<!-- 官方活动 -->
		<view class="title">官方活动</view>

		<!-- 官方活动列表 -->
		<view class="at-item">
			<image class="at-img" mode="aspectFill" src="../../static/test.jpg"></image>
			<view class="at-iteminfo">
				<view class="left">
					<view class="at-name">新客特惠</view>
					<view class="at-info">新用户减免活动</view>
					</view>
				<view class="bt_invite">参与活动</view>
			</view>
		</view>
		<view class="at-item">
			<image class="at-img" mode="aspectFill" src="../../static/test.jpg"></image>
			<view class="at-iteminfo">
				<view class="left">
					<view class="at-name">预约领优惠</view>
					<view class="at-info">新用户减免活动</view>
					</view>
				<view class="bt_invite">参与活动</view>
			</view>
		</view>
		<view class="create-bottom">没有想要的活动？
		<navigator url="at-create/at-create">
			点击创建>
		</navigator></view>
		
	</view>
</template>

<script>
export default {
	data(){
		return{
			info:[{
				imgSrc:'../../static/test.jpg'
			},{
				imgSrc:'B'
			},{
				imgSrc:'C'
			}],
			current: 0,
			mode: 'round',
		}
	},
	methods:{
		change(e){
			this.current = e.detail.current;
		}
	}
}
</script>

<style lang="scss">
@import "@/styles/home/home.scss";
@import "@/styles/activity/activity.scss";
	.swiper-box{
		width: 700rpx;
		height: 300rpx;
		margin: 0 auto;
		
		
		swiper-item{
			border-radius: 30rpx;
			background-color: #007AFF;
		}
	}

</style>