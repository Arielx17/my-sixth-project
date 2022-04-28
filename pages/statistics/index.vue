<template>
	<view class="content">
		<view class="title1">
			<view class="iconfont icon-store" style="font-size: 50rpx;color: #5A4BE8;"></view>
			您已入驻38天
		</view>
		<view class="today_data">
			<uni-grid :column="2" :show-border="false" :square="false">
				<uniGirdItem class="grid_item">
					<text class="title">支付订单数</text>
					<text class="num">{{todayData.orderNum}}</text>
				</uniGirdItem>
				<uniGirdItem class="grid_item">
					<text class="title">交易金额(元)</text>
					<text class="num">{{todayData.sum}}</text>
				</uniGirdItem>
			</uni-grid>
			<uni-grid :column="2" :show-border="false" :square="false">
				<uniGirdItem class="grid_item">
					<text class="title">顾客数量</text>
					<text class="num">{{todayData.menNum}}</text>
				</uniGirdItem>
				<uniGirdItem class="grid_item_recommend">
					<text class="title">推荐值</text>
					<text class="num">4</text>
				</uniGirdItem>
			</uni-grid>
		</view>
		<view class="title">店铺数据</view>
		<view class="card" style="flex-direction: column;">
			<view class="option">
				<view class="option-box3">
					<view @click="clickChange(0)" :class="{'cur':msg===0}">支付订单数</view>
					<view @click="clickChange(1)" :class="{'cur':msg===1}">交易金额</view>
					<view @click="clickChange(2)" :class="{'cur':msg===2}">顾客数量</view>
				</view>
				<picker @change="bindPickerChange" :value="index" :range="array" :selector-type="picker">
					<view class="input">
						<text>{{array[index]}}</text>
						<view class="iconfont icon-arrow-down"></view>
					</view>
				</picker>
			</view>
			<view class="chart">
				<my-canvas class="uni-ec-canvas" id="line-chart" canvas-id="multi-charts-line" :ec="ec" ref="chart">
				</my-canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import myCanvas from "@/components/uni-ec-canvas/uni-ec-canvas";
	import uniGirdItem from '@/uni_modules/uni-grid/components/uni-grid-item/uni-grid-item';
	export default {
		data() {
			return {
				todayData: {},
				xAxisData: [],
				yAxisData: [],
				shopId: -1,
				msg: 0,
				msgValue: ['Orders', 'Sums', 'Men'],
				index: 0,
				indexValue: ['Seven', 'Thirty', 'Sixm'],
				array: ['近7日', '近30日', '近6个月'],
				ec: {
					option: {
						lazyLoad:true,
						tooltip: {
							trigger: "axis",
							formatter: "{b}\r\n订单量：{c0}",
							axisPointer: {
								type: "line",
								axis: "x",
								label: {
									backgroundColor: "#000000"
								}
							}
						},
						grid: {
							left: "6%",
							right: "6%",
							top: "6%",
							bottom: "6%",
							containLabel: true
						},
						xAxis: {
							type: "category",
							boundaryGap: false,
							data: [],
							axisLine: {
								// y轴
								show: false
							},
							axisTick: {
								// y轴刻度线
								show: false
							},
							splitLine: {
								// 网格线
								show: false
							}
						},
						yAxis: {
							type: "value",
							axisLine: {
								// y轴
								show: false
							},
							axisTick: {
								// y轴刻度线
								show: false
							},
							splitLine: {
								// 网格线
								show: false
							}
						},
						series: [{
							name: "浏览量",
							type: "line",
							smooth: true,
							areaStyle: {
								color: {
									type: "linear",
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
											offset: 0,
											color: "#9D95F8" // 0% 处的颜色
										},
										{
											offset: 1,
											color: "#F7F6FB" // 100% 处的颜色
										}
									],
									global: false // 缺省为 false
								}
							},
							lineStyle: {
								color: "#9D95F8"
							},
							data: []
						}]
					}
				},
			}
		},
		onShow() {

		},
		onReady() {

		},
		methods: {
			clickChange(num) {
				this.msg = num
				this.setData(this.msg, this.index)
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
				this.setData(this.msg, this.index)
			},
			getToday(){
				uni.request({
					url:'http://localhost:8081/getToday?shopId=' + this.shopId,
					success: (res) => {
						console.log(res)
						if (res.data.length == '0') {
							console.log("未获取到")
						} else {
							console.log("已获取到", res)
							this.todayData = res.data[0]
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			async getData(type, num) {
				//ThirtyOrders
				console.log(this.shopId)
				await uni.request({
					url: 'http://localhost:8081/get' + type + '?shopId=' + this.shopId,
					success: (res) => {
						console.log(res)
						if (res.data.length == '0') {
							console.log("未获取到")
						} else {
							console.log("已获取到", res)
							this.xAxisData = []
							this.yAxisData = []
							for (var i = 0; i < num; i++) {
								this.$set(this.xAxisData, i, res.data[i].date)
								this.$set(this.yAxisData, i, res.data[i].val)
							}
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			async setData(msg, index) {
				let num = (index == 0) ? 7 : (index == 1) ? 30 : 6
				// console.log(num)
				let type = this.indexValue[index] + this.msgValue[msg]
				await this.getData(type, num)
				console.log('type', type)
				setTimeout(()=>{
					this.$set(this.ec.option.xAxis,'data',this.xAxisData)
					this.$set(this.ec.option.series[0],'data',this.yAxisData)
				},300)
				
				// this.ec.option.xAxis.data = this.xAxisData
				// this.ec.option.series[0].data = this.yAxisData
				console.log("折线图数据改变啦", this.ec.option.series[0].data + this.ec.option.xAxis.data);
			},
		},
		components: {
			myCanvas,
			uniGirdItem,
		},
		onLoad() {
			if (this.$global.memberObj.shopId != -1) {
				this.shopId = this.$global.memberObj.shopId
				setTimeout(()=>{
					this.$refs['chart'].init()
				},500)
				this.getToday()
				this.setData(0, 0)
			}

		}
	};
</script>

<style lang="scss">
	@import '@/styles/statistics/statistics';
</style>
