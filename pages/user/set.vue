<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">{{user.nickname}}</block>
		</cu-custom>
		<view v-if="pageLoad">
			<view class="padding-lr padding-tb-xs">
				<button class="cu-btn block shadow bg-gradual-blue margin lg" @click="gourl('../user/password')">修改密码</button>
				<button class="cu-btn block shadow bg-white margin text-red lg" @click="loginOut()">退出登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	 
	export default{
		data:function(){
			return {
				pageLoad:false,
				user: {},
				unLogin:true,
				ssuserid:""
			}
		},
		onLoad:function(option){
		 
			//start 检测登录
			this.ssuserid=getApp().globalData.ssuserid;
			this.unLogin=getApp().globalData.unLogin;
			if(this.ssuserid==''){
				return false;
			} 
			//End 检测是否登录 
			this.getPage();
		},
		 
		methods:{
			getPage: function () {
				var that=this;
				uniCloud.callFunction({
					name:"user-center",
					data:{
						"action":"get",
						id:this.ssuserid
					},
					success:function(e){
						
						var res=e.result;
						if(res.error){
							return false;
						}
						console.log(res)
						that.pageLoad=true;
						that.user=res.data.user;
					}
				}) 
			},
			gourl:function(url){
				uni.navigateTo({
					url:url,
				})
			},
			loginOut:function(){
				var that=this; 
				var that=this;
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'logout',
						uniIdToken: uni.getStorageSync('uniIdToken')
					},
					success(e) {
						uni.removeStorageSync('uniIdToken');
						getApp().globalData.ssuserid='';
						getApp().globalData.unLogin=true;
						uni.reLaunch({
							url:"/pages/index/index"
						})
					},
					fail(e) {
						// console.error(e)
					}
				}) 								
			} 
		},
	}
</script>

<style>
</style>
