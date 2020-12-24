<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">修改密码</block>
		</cu-custom>
		<view v-if="pageLoad">
			<form @submit="submit">
				<view class="cu-form-group margin-top">
					<view class="title">旧密码</view>
					<input placeholder="请输入旧密码" password="password" name="oldpassword"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">新密码</view>
					<input placeholder="请输入新密码" password="password" name="password"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">重复密码</view>
					<input placeholder="请再次输入新密码" password="password" name="password2"></input>
				</view>
				
				<view class="padding flex flex-direction">
					<button type="submit" class="cu-btn bg-blue shadow lg" form-type="submit">保存</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data: function() {
			return {
				pageLoad: true,
				pageData: {}
			}
		},
		onLoad: function(option) {
			this.getPage();
		},

		methods: {
			getPage: function() {

			},
			submit: function(e) {
				var oldPassword=e.detail.value.oldpassword;
				var password=e.detail.value.password;
				var password2=e.detail.value.password2;
				console.log(oldPassword,password,password2)
				uniCloud.callFunction({
					name:"user-center",
					data: {
						action: 'updatePassword',
						params: {
							oldPassword:oldPassword,
							newPassword:password,
							passwordConfirmation:password2
							 
						}
					},
					 
					success:function(e){
						 
						var res=e.result;
						if(res.code!=0){
							uni.showToast({
								title:res.msg
							})
							return false;
						}
						uni.navigateBack({
							
						})
					},
					fail:function(e){
						console.log(e)
					}
				})
			}
		},

	}
</script>

<style>
</style>
