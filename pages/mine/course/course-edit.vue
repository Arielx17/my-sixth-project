<template>
	<view class="content">
		<view class="forms">
			<uni-forms ref="baseForm" :modelValue="courseDetail" :rule="rules" validate-trigger="bind">
				<uniFormsItem label="课程名称" name="courseName" required>
					<uni-easyinput placeholder="请输入课程名称" v-model="courseDetail.product_name" />
				</uniFormsItem>
				<uniFormsItem label="原价" name="price" required>
					<uni-easyinput placeholder="请输入原价" v-model="courseDetail.line_price" type="number"
						style="z-index: 0;" />
				</uniFormsItem>
				<uniFormsItem label="现价" name="priceNow" required>
					<uni-easyinput placeholder="请输入现价" v-model="courseDetail.product_price" type="number" />
				</uniFormsItem>
				<uniFormsItem label="库存" required>
					<uni-easyinput placeholder="请输入库存" v-model="courseDetail.product_stock" type="number" />
				</uniFormsItem>

				<uniFormsItem label="课程介绍">
					<view v-if="!courseDetail.content" @click="navigateRich">点击编辑</view>
					<rich-text :nodes="courseDetail.content" @click="navigateRich" v-else></rich-text>
				</uniFormsItem>
			</uni-forms>
			<view class="chooseImg" @click="chooseImg">更换课程图片</view>
			<image class="imgShow" :src="imageValue" mode="aspectFill"></image>
		</view>
		<view class="submitForms">
			<button class="submit" @click="submitDetail(courseId != -1 ? 'changeCourse': 'addCourse')">提交</button>
		</view>
		<gmy-img-cropper style="z-index: 9999;" ref="gmyImgCropper" quality="0.5" cropperType="ratio" :ratio="16 / 9"
			@getImg="getImg"></gmy-img-cropper>
	</view>

</template>

<script>
	import gmyImgCropper from 'gmy-img-cropper/gmy-img-cropper.vue'
	import uniFormsItem from '@/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item'
	export default {
		components: {
			gmyImgCropper,
			uniFormsItem,
		},
		onLoad(option) {
			if (option.id) this.courseId = option.id
		},
		onShow() {
			this.getCourseDetail()
		},
		data() {
			return {
				courseId: -1,
				courseDetail: {
					product_name:'',
					line_price:0,
					product_price:0,
					product_stock:0,
					content:0,
				},
				// formData: {
				// 	courseName: '',
				// 	price: 0,
				// 	priceNow: 0,
				// 	stock: 0,
				// },
				rules: {
					courseName: {
						rulels: [{
								required: true,
								errorMessage: '请输入课程名称！'
							},
							{
								minLength: 3,
								maxLength: 12,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					price: {
						rules: [{
							required: true,
							errorMessage: '请输入原价！'
						}]
					},
					priceNow: {
						rules: [{
							required: true,
							errorMessage: '请输入现价！'
						}]
					},
					stock: {
						rules: [{
							required: true,
							errorMessage: '请输入库存！'
						}]
					}
				},
				imageValue: "../../../static/activityPicHolder.jpeg"
			}
		},
		methods: {
			//获取课程信息
			getCourseDetail: function() {
				uni.request({
					url: 'http://localhost:8081/getCourseDetail?id=' + this.courseId,
					success: (res) => {
						let pages = getCurrentPages();
						let currPage = pages[pages.length - 1]; //当前页面
						//如果点击编辑进入页面
						if (!currPage.data.intro) {
							// console.log(this.courseId)
							if(this.courseId != -1){
								this.courseDetail = res.data[0]
								this.imageValue = this.courseDetail.coursePic
							}
							else{
								this.$set(this.courseDetail,'content','')
								
							}
						} else {
							//如果从富文本编辑器返回页面
							if (currPage.data.intro == "empty") this.courseDetail.content = ""
							else {
								var item = JSON.parse(decodeURIComponent(currPage.data.intro));
								this.$set(this.courseDetail,'content',item.html)
							}
						}
					},
					fail: (err) => {
						console.log('获取课程信息失败', err)
					}
				})
			},
			//提交课程信息
			submitDetail: function(url) {
				let id = this.courseId != -1 ? this.courseId : this.$global.memberObj.shopId
				this.$delete(this.courseDetail,'coursePic')
				console.log(url)
				uni.request({
					url: 'http://localhost:8081/' + url,
					method: 'POST',
					data: {
							courseDetail: this.courseDetail,
							id: id,
						},
					success: (res) => {
						console.log('课程提交完成', res)
						uni.request({
							url:'http://localhost:8081/addCoursePic?courseId='+res.data.insertId+'&imageId=20',
							success: (res) => {
								console.log("保存图片成功",res)
							},
							fail: (err) => {
								consol.log("err:",err)
							}
						})
						uni.showToast({
								title: '课程提交完成',
								duration: 2000
							}),
							setTimeout(function() {
								uni.navigateBack()
							}, 1000)
					},
					fail: (err) => {
						console.log('课程提交失败', err)
						uni.showToast({
							icon: 'error',
							title: '课程提交失败',
							duration: 2000
						});
					}
				})
			},
			//打开富文本编辑器
			navigateRich: function() {
				uni.navigateTo({
					url: '../../richtest2',
					events: {
						//添加一个监听器
						acceptDataFromOpenedPage: function(data) {
							console.log(data)
						},
					},
					success: (res) => {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('acceptDataFromOpenerPage', {
							data: this.courseDetail.content
						})
					}
				})
			},
			chooseImg: function() {
				// 调用实例的chooseImg方法，拉起图片选择界面，待图片选择完毕后直接进入图片截取界面
				this.$refs.gmyImgCropper.chooseImage();
			},

			// 点击完成时，返回截取图片的临时路径
			getImg: function(e) {
				console.log("父页面拿到了图片", e);
				this.imageValue = e;
			},

		}
	}
</script>

<style lang="scss">
	@import "@/styles/mine/course";

	page {
		background-color: #FFFFFF;
	}
</style>
