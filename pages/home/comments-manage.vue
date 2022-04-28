<template>
	<view>
		<view class="option">
			<view class="option-box3">
				<view @click="msg=0" :class="{'cur':msg===0}">好评</view>
				<view @click="msg=1" :class="{'cur':msg===1}">中评</view>
				<view @click="msg=2" :class="{'cur':msg===2}">差评</view>
			</view>
<!-- 			<picker @change="bindPickerChange" :value="index" :range="array">
				<view class="input">
					<text>{{array[index]}}</text>
					<view class="iconfont icon-arrow-down"></view>
				</view>
			</picker> -->
		</view>
			<view class="comments">
				<!-- 评价列表 -->
				<view class="comment-item" v-for="(item,index) in commentList.filter(obj => obj.score === (msg === 0 ? 10 : (msg === 1 ? 20 : 30)))" :key="item.comment_id">
					<!-- 头像 -->
					<image referrer="no-referrer|origin|unsafe-url"
					:src="item.userPic"></image>
					<!-- 详情+用户名+星级 -->
					<view class="item-middle">
						<text class="comment-info">{{item.content}}</text>
						<view class="comment-pic" v-if="item.is_picture === 1" >
							<image v-for="(itemPic,indexPic) in item.commentPic.slice(0,3)" :key="indexPic" :src="item.commentPic[indexPic]" mode="aspectFill"></image>
						</view>
<!-- 						<view class="comment-pic" v-if="item.is_picture === 1">
							<image src="../../static/2022031210191596b607600.jpg" mode="aspectFill">?</image>
						</view> -->
						<view>
							<text class="comment-username">{{item.username}}</text>
							<view class="comment-stars">
								<uni-rate readonly="true" :value=item.describe_score size="17"/>
							</view>
						</view>
					</view>
					<!-- 回复+申诉 -->
					<view class="item-right">
						<view class="reply">
							<view>回复</view>
						</view>
<!-- 						<view class="appeal">申诉</view> -->
					</view>
				</view>
			</view>
	</view>
</template>



<script>
	
	export default {
		data() {
			return {
				commentList:[],
				commentPic:[],
				msg:0,
				index:0,
				array:['全部评价','好 评','中差评','正在申诉']
			}
		},
		methods: {
			bindPickerChange:function(e){
				this.index = e.target.value,
				console.log(this.msg)
			},
			getAllComments(shopId){
				uni.request({
					url:this.$global.memberObj.host + 'getAllComments?shopId='+shopId,
					success: (res) => {
						console.log("成功",res)
						this.commentList = res.data
						for(var i = 0 ; i < this.commentList.length ; i++){
							if(this.commentList[i].commentPic){
								let picList = this.commentList[i].commentPic.split(',')
								console.log(picList)
								this.commentList[i].commentPic = picList
								
							}
						}
						console.log(this.commentList)
					},
					fail: (err) => {
						console.log("失败",err)
					}
				})
			},
			getCommentPic(commentId){
				uni.request({
					url:this.$global.memberObj.host + 'getCommentPic?commentId='+commentId,
					success: (res) => {
						console.log("成功",res.data)
						this.commentPic.push(res.data)
						this.commentPic.push(commentId)
						console.log(this.commentPic)
					},
					fail: (err) => {
						console.log("失败",err)
					}
				})
			}
		},
		onLoad(){
			this.getAllComments(this.$global.memberObj.shopId)
		}
	}
</script>

<style lang="scss">
	@import "@/styles/home/home.scss";
	page{
	    font-size:28rpx;
	    background-color: #fff;
	    color: #515151;
	}
</style>
