<template>
	<view class="login">
		<button class="wxq-btn loginWx" @click="getUserProfile">一键登录</button>
		<button class="wxq-btn goback">取消登录</button>
		<button open-type=""></button>
	</view>

</template>

<script>
	// import {
	// 	// mapState,  
	// 	mapMutations
	// } from 'vuex';
	export default {
		data() {
			return {
				code: '', //微信临时登录凭证
				openId: '',
				userInfo: {}
			}
		},
		onLoad: function() {
			uni.login({
				success: (res) => {
					if (res.errMsg == "login:ok") {
						this.code = res.code;
						console.log(res)
					} else {
						uni.showToast({
							title: '系统异常，请联系管理员!'
						})
					}
				}
			})
		},
		methods: {
			// ...mapMutations(['login']),
			//微信授权登录
			getUserProfile(e) {
				uni.getUserProfile({
					desc: '用以获取用户昵称、头像等',
					success: (res) => {
						console.log('用户信息，加密数据', res)
						this.userInfo = res.userInfo
						//访问接口,获取openid
						uni.request({
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							url: 'https://api.weixin.qq.com/sns/jscode2session', //你的接口地址
							data: {
								appid: 'wxbbb1162873cb2723',
								secret: '34c8258e941134f5d8cd8ca18efce6b1',
								js_code: this.code,
								grant_type: 'authorization_code'
						
							}, //接口需要的数据
							success: (res) => {
								console.log(res);
								if (res.data.openid) {
									// this.login(res.data); //将接口返回的数据保存在全局变量中.
									this.userInfo['open_id'] = res.data.openid
									// console.log(this.openId)
									uni.request({
										url: 'http://localhost:8081/isRegister?open_id=' + res.data.openid,
										success: (res) => {
											console.log("res", res)
											if (res.data.length == '0') {
												console.log("未注册", res.data)
												this.Register(this.userInfo)
											} else {
												console.log("已注册,user_id:", res.data[0].user_id)
												console.log("已注册", res.data.token)
												this.$global.setMemberObj({userId:res.data[0].user_id});
												// uni.setStorageSync('token', result.data.token);
												// uni.setStorageSync('user_id', result.data.user_id);
												uni.switchTab({
													url:'../mine/index',
													fail: (err) => {
														console.log(err)
													}
												})
												
											}
										},
										fail: (err) => {
											console.log(err)
										}
									})
						
								} else {
									uni.showToast({
										title: '授权登录失败！',
										mask: true,
										icon: 'none'
									})
								}
							}
						})
					}
				})

				
			},
			Register(userInfo) {
				// console.log('userInfo',userInfo)
				delete userInfo.language
				userInfo['reg_source'] = 'wx'
				userInfo['app_id'] = 10001
				uni.request({
					url: 'http://localhost:8081/Register',
					method: 'POST',
					data: {
						userInfo: userInfo,
					},
					success: (res) => {
						if (res.data.length == '0') {
							console.log("注册失败", res.data)
						} else {
							console.log("注册完成", res.data)}
							wx.login({
								
							})
					},
					fail: (err) => {
						console.log(err)

					}

				})
			}
		},


	}
</script>

<style>
	.login {
		width: 750rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.goback {
		width: 90%;
		background: #eee;
		color: #333;
		margin-bottom: 24rpx;
	}

	.loginWx {
		width: 90%;
		background: #04BE02;
		margin-bottom: 24rpx;
	}
</style>
