<template>
	<view>
		<view class="course-info">
			<view class="name">{{courseDetail.product_name}}</view>
			<image class="pic" :src="courseDetail.coursePic"></image>
			<view class="card">
				<view class="validity">有效期：30天</view>
				<view class="course">
					<view class="cs-name">{{courseDetail.product_name}}</view>
					<view class="num">1节</view>
					<view class="price">￥
						<text>{{courseDetail.product_price}}</text>
					</view>
				</view>
				<view class="stocksold">
					<view class="stock">库存：{{courseDetail.product_stock}}</view>
					<view class="sold">已售出：{{courseDetail.sales_actual}}</view>
				</view>
			</view>
			<view class="detail">
				<view class="detail_title">
					-- 课程介绍 --
				</view>
				<view class="detail_content" v-html="courseDetail.content">
					{{courseDetail.content}}
				</view>
			</view>
		</view>
		
		<view class="mana">
			<button class="edit"  @click="toEdit">编辑</button>
			<button class="state" v-if="courseDetail.product_status === 20" @click="changeStatus(courseDetail.product_status)">上架</button>
			<button class="state" v-else @click="changeStatus(courseDetail.product_status)">下架</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				courseId:1,
				courseDetail:{},
				content:"",
			}
		},
		onLoad(option) {
			this.courseId = option.id
			// console.log(option.id)
		},
		onShow() {
			// console.log(this.courseId)
			this.getCourseDetail()
		},
		methods: {
			changeStatus:function(status){
				console.log(this.courseId)
				let statusNum = 10
				if(status === 10){
					statusNum = 20
				}else{
					statusNum = 10
				}
				uni.request({
					url:'http://localhost:8081/changeCourseStatus?status='+ statusNum +'&id='+this.courseId,
					success: (res) => {
						console.log('课程状态已改变',statusNum)
						uni.navigateBack({
							success: (e) => {
								var page = getCurrentPages().pop();
								if (page == undefined || page == null) return;
								page.onLoad();
							}
						})
					}
				})
				console.log('发生改变',statusNum)
			},
			getCourseDetail(){
				// console.log('运行了吗')
				uni.request({
					url:'http://localhost:8081/getCourseDetail?id='+this.courseId,
					// data:{
					// 	id:thisid
					// },
					success:(res) => {
						// console.log('运行了')
						this.courseDetail = res.data[0]
						this.courseDetail.coursePic = this.$global.memberObj.imgPath + this.courseDetail.coursePic
					},
					fail:() =>{
						console.log('获取课程信息失败')
					}
				})
			},
			toEdit(){
				console.log("已点击")
				uni.navigateTo({
					url:"course-edit?id=" + this.courseId,
					fail: (err) => {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/styles/mine/course.scss"

</style>
