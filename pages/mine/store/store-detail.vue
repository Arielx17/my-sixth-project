<template>
	<view class="content">
		<view class="license">
			<view class="title">营业执照</view>
			<view class="pic">
				<image :src="storeInfo.businessPic" mode="aspectFill"></image>
			</view>
		</view>
		<view class="detail">
			<view class="title">店铺信息
				<view class="edit" @click="toEdit">编辑></view>
			</view>
			
			<view class="box">
				<view class="detail1">
					<view class="left">
						<image :src="storeInfo.storePic" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="name">{{storeInfo.name}}</view>
						<view class="type" v-if="storeInfo.category_id == 1">类型：{{types[0].text}}</view>
						<view class="type" v-if="storeInfo.category_id == 2">类型：{{types[1].text}}</view>
						<view class="type" v-if="storeInfo.category_id == 3">类型：{{types[2].text}}</view>
						<view class="type" v-if="storeInfo.category_id == 4">类型：{{types[3].text}}</view>
						<view class="type" v-if="storeInfo.category_id == 5">类型：{{types[4].text}}</view>
						<view class="type" v-if="storeInfo.category_id == 6">类型：{{types[5].text}}</view>
					</view>
				</view>
				<view class="detail2">
					<view class="intro">{{storeInfo.description}}</view>
					<view class="address">
						<uni-icons type="location"></uni-icons>{{storeInfo.address}}
					</view>
				</view>
				<view class="detail3">
					联系人：{{storeInfo.link_name}}<br>
					商家联系电话：{{storeInfo.link_phone}}<br>
					营业时间：{{storeInfo.business_hours}}<br>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				shopId: this.$global.memberObj.shopId,
				storeInfo:{
				},
				types: [
					{
						"value": 1,
						"text": "学业"
					},
					{
						"value": 2,
						"text": "运动"
					},
					{
						"value": 3,
						"text": "音乐"
					},
					{
						"value": 4,
						"text": "美术"
					},
					{
						"value": 5,
						"text": "语言"
					},
					{
						"value": 6,
						"text": "早教"
					},
				],
			}
		},
		methods:{
			getStoreInfo: function(shopId) {
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
								this.storeInfo.storePic = '../../../static/storePic.png'
							}
							console.log(this.storeInfo.is_full)
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			toEdit:function(){
				uni.navigateTo({
					url:'store-edit?shopId='+this.shopId
				})
			}
		},
		components:{
			
		},
		onLoad(option) {
			// this.shopId = option.shopId
			this.getStoreInfo(this.shopId)
		}
	}
</script>

<style lang="scss">
	@import '@/styles/mine/store-detail.scss'
</style>
