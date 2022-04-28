<template>
	<view class="content">
		<view class="forms" style="position: fixed;">
			<uni-forms ref="baseForm" :value="storeInfo" :rules="rules">
				<uniFormsItem label="商家名称" name="storeName" required>
					<uni-easyinput placeholder="请输入商家名称" v-model="storeInfo.name" />
				</uniFormsItem>

				<uniFormsItem label="商家介绍">
					<uni-easyinput placeholder="请输入商家介绍" v-model="storeInfo.description" type="textarea" />
				</uniFormsItem>
				<uniFormsItem label="商家类型" required>
					<uni-data-checkbox v-model="storeInfo.category_id" :localdata="types" />
				</uniFormsItem>

				<uniFormsItem label="商家地址" name="address" required>
					<view class="map">
						<view @click="inputHandle" v-if="!storeInfo.address">
							<uni-icons type="location"></uni-icons>
							点击选择商家地址
						</view>
						<view @click="inputHandle" v-else>
							<uni-icons type="location"></uni-icons>{{storeInfo.address}}
						</view>
					</view>
				</uniFormsItem>

				<uniFormsItem label="联系人" name="name" required>
					<uni-easyinput placeholder="请输入商家联系人" v-model="storeInfo.link_name" required />
				</uniFormsItem>
				<uniFormsItem label="商家联系电话" name="phone" required>
					<uni-easyinput placeholder="请输入商家联系电话" v-model="storeInfo.link_phone" type="number" />
				</uniFormsItem>
				<uniFormsItem label="营业时间" required>
					<picker mode="time" :value="storeTime.startTime" start="06:00" end="00:00"
						@change="bindTimeChange($event,'startTime')">
						<view class="input-time">{{storeTime.startTime}}</view>
					</picker>
					<view style="float: left;line-height: 60rpx;margin: 0 20rpx;margin-top: 10rpx;">——</view>
					<picker mode="time" :value="storeTime.endTime" start="06:00" end="00:00"
						@change="bindTimeChange($event,'endTime')">
						<view class="input-time">{{storeTime.endTime}}</view>
					</picker>

				</uniFormsItem>
			</uni-forms>
			<view class="chooseImg" @click="chooseImg">营业执照上传</view>
			<image class="imgShow" :src="imageValue" mode="aspectFill" style="z-index: 1;"></image>
			
			<view class="submitForms">
				<button class="submit" @click="submit">提交</button> 
			</view>
		</view>
		<gmy-img-cropper style="z-index: 999999;" ref="gmyImgCropper" quality="0.5" cropperType="free"
			 @getImg="getImg"></gmy-img-cropper>
		
	</view>
</template>

<script>
	import gmyImgCropper from 'gmy-img-cropper/gmy-img-cropper.vue'
	import uniFormsItem from '@/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item'
	export default {
		data() {
			return {
				imageValue: '../../../static/business.png',
				shopId: -1,
				imageInfo:{},
				storeInfo: {
					name: '',
					user_id: '',
					link_name: "",
					link_phone: "",
					description: '',
					category_id: '',
					address: '',
					business_hours: '',
				},
				rules: {
					storeName: {
						rules: [{
							required: true,
							errorMessage: '请输入商家名称'
						}]
					},
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入商家联系人'
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '请输入商家地址'
						}]
					},
					phone: {
						rules: [{
								required: true,
								errorMessage: '请输入商家联系电话'
							},
							{
								pattern: '(^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\\d{8})$)|(^0\\d{2,3}-?\\d{7,8}$)',
								errorMessage: '请输入正确的联系电话',
							},

						],
						validateTrigger: "bind"
					},

				},
				types: [{
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
				//选择地址
				border: true,
				latitude: '',
				longitude: '',
				markers: [{
					latitude: '',
					longitude: '',
				}],
				//选择营业时间
				storeTime: {
					startTime: '08:00',
					endTime: '22:00'
				},
			}
		},
		onLoad: function(option) {
			if (option.userId) {
				console.log('创建', option)
				this.storeInfo.user_id = option.userId
				console.log(this.storeInfo.user_id)
			} else {
				this.shopId = option.shopId
				console.log(this.shopId)
				this.getStoreInfo(this.shopId)
			}
		},
		components: {
			gmyImgCropper,
			uniFormsItem,
		},
		methods: {
			chooseImg: function() {
				// 调用实例的chooseImg方法，拉起图片选择界面，待图片选择完毕后直接进入图片截取界面
				this.$refs.gmyImgCropper.chooseImage();
			},
			// 点击完成时，返回截取图片的临时路径
			getImg: function(e) {
				console.log("父页面拿到了图片", e);
				this.imageValue = e;
			},
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
							this.imageValue = this.storeInfo.businessPic
							console.log(this.storeInfo.is_full)
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			setValue(name, value) {
				// 设置表单某项对应得值来触发表单校验
				// 接受两个参数，第一个参数为表单域的 name ，第二个参数为表单域的值
				this.$refs.form.setValue(name, value)
			},
			frame() {
				uni.chooseLocation({
					success: res => {
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						this.storeInfo.address = res.address;
						this.markers[0].latitude = res.latitude;
						this.markers[0].longitude = res.longitude;
						console.log(this.markers)
					}
				});
			},

			inputHandle(e) {
				this.frame();
			},

			bindTimeChange: function(e, time) {
				this.$set(this.storeTime, time, e.detail.value)
				console.log(e.detail.value, this.storeTime.endTime)
			},
			uploadImage(){
				var date = new Date()
				var year = date.getFullYear()
				var month = date.getMonth() + 1
				var day = date.getDate()
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				
				let str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				let num = '';
				for (let i = 0; i < 10; i++) {
					num += str.charAt(Math.floor(Math.random() * str.length));
				};
				console.log(num)
				console.log(this.imageValue)
				console.log(year + month + day +'/'+ num + '.jpg')
				this.$set(this.imageInfo,'fileSave',year + month + day +'/'+ num + '.jpg')
				uniCloud.uploadFile({
					filePath: this.imageValue,
					cloudPath: this.imageInfo.fileSave,
					onUploadProgress: function(progressEvent) {
						console.log(progressEvent);
						var percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
					},
					success:(res) => {
						console.log("成功存储",res)
						this.$set(this.imageInfo,'fileId',res.fileID)
						uniCloud.getTempFileURL({
							fileList:[this.imageInfo.fileId]
						}).then(res=>{
							console.log('url:',res.fileList[0].tempFileURL)
							this.$set(this.imageInfo,'fileUrl',res.fileList[0].tempFileURL)
						})
					},
					fail(err) {
						console.log("未成功存储",err)
					},
					complete() {}
				});
			},
			updateImage(){
				
			},

			submit() {
				// this.uploadImage()
				this.$refs.baseForm.validate(['id'], (err, formData) => {
					if (!err) {
						this.$set(this.storeInfo, 'business_hours', this.storeTime.startTime + '——' + this
							.storeTime.endTime)
						this.$delete(this.storeInfo,'storePic')
						this.$delete(this.storeInfo,'businessPic')
						if(this.storeInfo.latitude != ""){
							this.$set(this.storeInfo,'latitude',this.markers[0].latitude)
							this.$set(this.storeInfo,'longitude',this.markers[0].longitude)
						}
						console.log('success', this.storeInfo)
						
						if (this.shopId == -1) {
							// this.uploadImage()
							
							setTimeout(()=>{
								// console.log("youba",this.imageInfo.fileUrl)
								// console.log(this.imageInfo.fileSave)
								// console.log(this.imageInfo.fileId)
								uni.request({
									url: 'http://localhost:8081/editStoreInfo',
									method: 'POST',
									data: {
										storeInfo: this.storeInfo,
										// imageInfo:{
										// 	file_url:this.imageInfo.fileUrl,
										// 	save_name:this.imageInfo.fileSave,
										// 	file_name:this.imageInfo.fileId,
										// }
									},
									success: (res) => {
										console.log("店铺提交完成，待审核", res)
										uni.navigateBack({
											success: (e) => {
												var page = getCurrentPages().pop();
												if (page == undefined || page == null) return;
												page.onLoad();
											}
										})
									},
									fail: (err) => {
										console.log("err:", err)
									}
								})
							},600)
							
						} else {
							console.log(this.shopId)
							uni.request({
								url: 'http://localhost:8081/updateStoreInfo',
								method: 'POST',
								data: {
									storeInfo: this.storeInfo,
									shopId: this.shopId,
								},
								success: (res) => {
									console.log("店铺信息保存完毕", res)
									uni.showToast({
											title: '店铺信息保存完毕',
											duration: 2000
										}),
										setTimeout(function() {
											uni.navigateBack({
												success: (e) => {
													var page = getCurrentPages().pop();
													if (page == undefined || page == null) return;
													page.onLoad();
												}
											})
										}, 500)
								},
							})

						}

					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/styles/mine/store-edit";

	page {
		background-color: #FFFFFF;
	}
</style>
