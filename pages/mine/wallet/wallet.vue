<template>
	<view class="content">
		<view class="card">
			<view class="mymoney">
				总收入：{{storeInfo.total_money}}
			</view>
			<view class="unsettled">
				待结算：0
			</view>
			<view class="unsettled">
				可用余额：{{storeInfo.money}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				shopId: 10001,
				storeInfo:{},
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
							console.log(this.storeInfo.is_full)
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
		},
		onLoad(option) {
			// this.shopId = option.shopId
			this.getStoreInfo(this.shopId)
		}
	}
</script>

<style lang="scss">
	@import '@/styles/mine/wallet'
</style>
