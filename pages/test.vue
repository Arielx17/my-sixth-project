<template>
	<view>
		<uni-forms ref="signUpForm" :value="signUpFormData" :rules="rules">
			<uniFormsItem label="" name="username">
				<uni-easyinput type="number" placeholder="请输入登录手机号码" v-model="signUpFormData.username" />
			</uniFormsItem>
			<button form-type="submit" @click="handleSignUp">登录</button>
		</uni-forms>
	</view>
</template>

<script>
	import uniFormsItem from '@/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item'
	export default {
		data() {
			return {
				signUpFormData:{
					username:""
				},
				rules: {
					username: {
						rules: [{
								required: true,
								errorMessage: '请输入注册手机号码'
							},
							{
								pattern: '^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\\d{8})$',
								errorMessage: '请输入正确的手机号',
							},
							
						],
						validateTrigger:"bind"
					}
				}
			}
		},
		methods: {
			// handleSignUp() {
			// 	this.$refs.signUpForm.submit().then(params => {
			// 		params.code = '95'
			// 		params.uuid = this.signUpFormData.uuid
			// 		this.$SignUp.login(params).then(res => {
			// 			console.log(res, 'res')
			// 			uni.navigateTo({
			// 				url: '/pages/template/news/index'
			// 			})
			// 		})
			// 	})
			// }
		},
		components: {
			uniFormsItem
		}

	}
</script>
