<template>
	<view>
		<view v-if="pageLoad">
			<form @submit="submit">
				<view class="input-flex">
					<view class="input-flex-label">昵称</view>
					<input class="input-flex-text" name="nickname"  :value="user.nickname" >
				</view>
				<button form-type="submit" class="btn-row-submit">提交</button>
			</form>
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
			getPage:function(){
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
			submit:function(e){
				var that=this;			 
			}
		},
	}
</script>

<style>
</style>
