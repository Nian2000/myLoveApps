<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">上传头像</block>
		</cu-custom>
		<view v-if="pageLoad" class="padding">		
			<view class="justify-center flex margin-bottom"><text>点击图片就可以更换美美的头像啦！</text></view>
			<view class="justify-center flex"><image style="width: 70vw;" @click="upload()" mode="widthFix" :src="user_head"></image></view>
		</view>
	</view>
</template>

<script>
	export default {
		data: function() {
			return {
				pageLoad: false,
				pageData: {},
				user_head: "",
				user: {},
				unLogin: true,
				ssuserid: ""
			}
		},
		onLoad: function(option) {
			//start 检测登录
			this.ssuserid = getApp().globalData.ssuserid;
			this.unLogin = getApp().globalData.unLogin;
			if (this.ssuserid == '') {
				return false;
			}
			//End 检测是否登录  
			this.getPage();
		},

		methods: {
			getPage: function() {
				var that = this;
				uniCloud.callFunction({
					name: "user-center",
					data: {
						"action": "get",
						id: this.ssuserid
					},
					success: function(e) {

						var res = e.result;
						if (res.error) {
							return false;
						}
						console.log(res)
						that.pageLoad = true;
						that.user = res.data.user;
						that.user_head = res.data.user.avatar;
					}
				})
			},
			upload: function() {
				var that = this;
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uniCloud.uploadFile({
							filePath: tempFilePaths[0],
							cloudPath: this.ssuserid+'.uhead.jpg',
							onUploadProgress: function(progressEvent) {
								console.log(progressEvent);
								var percentCompleted = Math.round(
									(progressEvent.loaded * 100) / progressEvent.total
								);
							},
							success(res) {
								if(res.fileID!=undefined){
									uniCloud.callFunction({
										name:"user-center",
										data:{
											"action":"setAvatar",
											params:{
												avatar:res.fileID
											}
										},
										success:function(e){
											if(e.result.code!=0){
												uni.showToast({
													title:e.result.msg
												})
												return false;
											}
											that.user_head=res.fileID
										}
									})
								}
								 
							},
							fail() {},
							complete() {}
						});
						
					}
				});
			}
		},
	}
</script>

<style>
</style>
