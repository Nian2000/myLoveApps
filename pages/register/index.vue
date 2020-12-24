<template>
	<view class="regBg">
		<view class="regBox" v-if="pageLoad">
			<form @submit="formSubmit">		
			
			<view class="cu-form-group margin-top">
				<view class="title">用户名</view>
				<input type="text" placeholder="请填写用户名" name="nickname"></input>
			</view>
			
			<view class="cu-form-group">
				<view class="title">密码</view>
				<input name="password" type="text" password=true  placeholder="请填写密码"></input>
			</view>				
			
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input name="password2" type="text" password=true  placeholder="请填写密码"></input>
			</view>	
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue shadow lg" style="background-color: #fb678a;" type="primary" form-type="submit">立即注册</button>
			</view>
		   
			</form>
		</view>
	</view>
</template>

<script>
	 
	var yzmTimer=60,yzmTime=59,yzmEnable=true;
	export default{
		data:function(){
			return {
				pageLoad:false, 
				pageData:{},			 
			};
		},
		onLoad:function(option){
			this.pageLoad=true;
		},
		 
		methods:{
			 
			formSubmit:function(e){
				var that=this;
				e.detail.value.username=e.detail.value.nickname;
				if(e.detail.value.password2!=e.detail.value.password){
					uni.showToast({
						title:"两次密码不一样"
					})
					return false;
				}
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'register',
						params: {
							username: e.detail.value.username,
							password: e.detail.value.password,
							nickname:e.detail.value.nickname,
							gold:0,
							grade:0,
							avatar:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hzqasl/7ff730f0-f4d1-11ea-b680-7980c8a877b8.png"
						}
					},
					success(e) {
						uni.showModal({
							showCancel: false,
							content: e.result.msg
						})
						if(e.result.code==0){
							uni.setStorageSync('uniIdToken', e.result.token);
							var callRes=uniCloud.callFunction({
								name:'user-center',
								data:{
									action:'checkToken'
								},
								success:function(callRes){
									if(callRes.result.uid==undefined){
										return false;
									}
									getApp().globalData.ssuserid=callRes.result.uid;
									getApp().globalData.unLogin=false;
									uni.reLaunch({
										url:"/pages/index/index"
									})
								}
							})
							
						}
						
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '注册失败，请稍后再试'
						})
					}
				}) 
				
			}
		},
	}
</script>

<style scoped lang="scss">
	.yzmDisable{
		background-color: #eee;
		color: #999;
	}
	.regBox{
		position: absolute;
		top: 50%;
		left: 30upx;
		right: 30upx;
		margin-top: -390upx;
		padding:30upx 20upx;
		background-color: #fff; 
		border-radius: 20upx;
	}
	.regBg{
		background: linear-gradient(to right, rgb(255, 129, 156), rgb(247, 74, 117), rgb(250, 135, 46));
		position: absolute;
		top: 0upx;
		bottom: 0upx;
		left: 0upx;
		right: 0upx;
	}
</style>
