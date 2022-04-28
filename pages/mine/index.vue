<template>
	<view class="content">
		<view class="store">
			<view class="store-info">
				<image :src="storeInfo.storePic" mode="aspectFill">
				</image>
				<view class="account">
					<view class="hasnt" v-if="!storeInfo.name" @click="bindStore">绑定店铺</view>
					<view class="name" v-else>{{storeInfo.name}}</view>
					<view class="qualification" style="background: #ece501;" v-if="storeInfo.is_full === 0">资质审核中</view>
					<view class="qualification" v-else-if="storeInfo.is_full === 1">资质已通过</view>
					<view class="qualification" style="background: #d35f54;"
						v-else-if="!storeInfo.is_full || storeInfo.is_full === 2">资质未通过</view>
				</view>
				<view class="follow">
					<view class="num">{{storeInfo.fav_count || 0}}</view>
					<view class="follownum">粉丝数</view>
				</view>
			</view>
			<view class="level">
				<view class="recommend">
					<view class="rcname">
						推荐值
					</view>
					<view class="rcnum">
						{{storeInfo.describe_score || 0}}
					</view>
				</view>
				<view class="stars">
					<view class="starname">
						店铺星级
					</view>
					<uni-rate readonly="true" :value="storeInfo.describe_score || 0" size="25" />
				</view>
			</view>
		</view>
		<view class="store-mana">
			<view class="title">门店管理</view>
			<uni-grid :column="4" :showBorder="false" :square="false" @change="change" >
					<uniGriditem class="grid" v-for="(item,index) in 4" :index="index" :key="index">
						<view :class=list[index].icon style="font-size: 60rpx"></view>
						<text class="text">{{list[index].text}}</text>
				</uniGriditem>
			</uni-grid>
		</view>
		<view class="others">
			<view class="item">
				<view class="iconfont icon-help" style="font-size: 42rpx;">
					<view>帮助中心</view>
				</view>
				<view class="iconfont icon-arrow-right"></view>
			</view>
			<view class="item">
				<view class="iconfont icon-set" style="font-size: 42rpx;">
					<view>设置</view>
				</view>
				<view class="iconfont icon-arrow-right"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniGriditem from '@/uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.vue'
	export default {
		data() {
			return {
				imageSrc:'F:/luochen(1)(1)/luochen/jjj_shop_multi/public/uploads/20220308/d2d1a8654e89f92543774ef931ea4d30.jpeg',
				userId: -1,
				storeInfo: {
					fav_count: 0,

				},
				shopId: 0,
				list: [{
						url: 'course/course-list',
						text: '课程管理',
						icon: 'iconfont icon-training',
					},
					{
						text: '代金券管理',
						icon: 'iconfont icon-coupons'
					},
					{
						text: '门店信息',
						url: 'store/store-detail?shopId=' + this.shopId,
						icon: 'iconfont icon-store'
					},
					{
						text: '我的钱包',
						icon: 'iconfont icon-wallet',
						url: 'wallet/wallet?shopId=' + this.shopId,
					},
				]
			}
		},
		components: {
			uniGriditem
		},
		methods: {
			//判断是否绑定了店铺
			hasStore: function(userId) {
				uni.request({
					url: 'http://localhost:8081/hasStore?userId=' + userId,
					success: (res) => {
						console.log(res)
						if (res.data.length == '0') {
							console.log("未绑定")
						} else {
							console.log("已绑定",res.data[0].shop_supplier_id)
							this.shopId = res.data[0].shop_supplier_id
							this.$global.memberObj.shopId = this.shopId
							this.getStoreInfo(this.shopId)
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			//获取店铺信息
			getStoreInfo: function(shopId) {
				console.log("yunxingle")
				uni.request({
					url: 'http://localhost:8081/getStoreInfo?shopId=' + shopId,
					success: (res) => {
						console.log(res)
						if (res.data.length == '0') {
							console.log("未获取到店铺信息")
						} else {
							console.log("已获取到店铺信息", res)
							this.storeInfo = res.data[0]
							if(this.storeInfo.storePic == null){
								this.storeInfo.storePic = '../../static/storePic.png'
							}
							console.log(this.storeInfo.is_full)
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			bindStore() {
				uni.navigateTo({
					url: 'store/store-edit?userId=' + this.userId,
				})
			},
			toGetStore() {
				console.log(this.shopId)
				uni.navigateTo({
					url: 'store/store-detail?shopId=' + this.shopId,
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					}
				})

			},
			change(e) {
				let {
					index
				} = e.detail
				console.log("获取index ",index),
				uni.navigateTo({
					url: this.list[index].url,
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
		},
		onLoad() {
			this.userId = this.$global.memberObj.userId
			if (this.userId != -1) {
				this.hasStore(this.userId)
			} else {
				console.log('未登录', this.storeInfo.is_full)
			}
			
		}
	}
</script>

<style lang="scss">
	@import '@/styles/mine/mine.scss'
</style>
