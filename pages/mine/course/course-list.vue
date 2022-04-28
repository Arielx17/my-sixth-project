<template>
	<view class="content">
		<view class="course-item" v-for="(item,index) of courseList" :key="item.product_id">
			<navigator :url="'course-detail?id='+ item.product_id">
				<view class="top">
					<image class="course-pic" :src="item.coursePic" mode="aspectFill"></image>
					<view class="top-right">
						<view class="course-name">{{item.product_name}}
							<view class="course-price">￥{{item.product_price}}</view>
						</view>
						<view class="sold-stock">已售出：{{item.sales_actual}} · 库存：{{item.product_stock}}</view>
					</view>
				</view>
			</navigator>
			<view class="bottom">
				<view class="edit" @click="edit(item.product_id)">编辑</view>
				<switch :checked="item.product_status == 10 ? true:false" @change="changeStatus($event,item.product_id)" color="#9D95F8"></switch>
			</view>
		</view>
		<view class="add-course" @click="addCourse">
			<view class="iconfont icon-add-select" style="font-size: 60rpx;margin: auto;color: #FFFFFF;width: 60rpx;height: 60rpx;line-height: 100rpx;"></view>
		</view>
	</view>
</template>

<script>
	import axios from '../../../utils/axios.js'
	export default {
		data() {
			return {
				courseList:{},
			};
		},
		onShow(){
			this.getCourseList() 
		},
		methods:{
			addCourse(){
				uni.navigateTo({
					url:'course-edit?shopId='+ this.$global.memberObj.shopId,
				})
			},
			edit:function(courseId){
				console.log("已点击")
				uni.navigateTo({
					url:"course-edit?id=" + courseId,
					fail: (err) => {
						console.log(err)
					}
				})
			},
			getCourseList(){
				uni.request({
					url:this.$global.memberObj.host+'getCourseList?shopId='+this.$global.memberObj.shopId,
					success:(res) => {
						console.log(res.data)
						this.courseList = res.data
						for(var i=0 ; i < res.data.length ; i++){
							this.courseList[i].coursePic = this.$global.memberObj.imgPath + this.courseList[i].coursePic
						}
					}
				})
			},
			changeStatus:(e,id)=>{
				let statusNum = 10
				if(e.detail.value){
					statusNum = 10
				}else{
					statusNum = 20
				}
				uni.request({
					url:'http://localhost:8081/changeCourseStatus?status='+ statusNum +'&id='+id,
					success: (res) => {
						console.log('课程状态已改变',statusNum)
					}
				})
				console.log('发生改变',e.detail.value)
			}
		},
		
	}
</script>

<style lang="scss">
	@import "@/styles/mine/course"

</style>
