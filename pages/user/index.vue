<template>
	<view>
		
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">个人中心</block>
		</cu-custom>
		
		<un-login v-if="unLogin"></un-login>
		<view v-else-if="pageLoad">
			
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view class="cu-avatar round lg" :style="'backgroundImage:url('+ user.avatar + '?x-oss-process=image/resize,m_fixed,w_100' +')'" @click="gourl('../user/user_head')"></view>
					<view class="content flex-sub">
						<view>{{user.nickname}}</view>
						<view class="text-gray flex justify-between">
							<view class="text-sm">金币：{{user.gold}} 积分：{{user.grade}}</view>			
							<view> 
								<navigator url="/pages/user/set" class="margin-right-xl block text-black">
									<text class="cuIcon-settingsfill"></text>设置
								</navigator> 
							</view>							
						</view>					
					</view>				
				</view>
			</view>

				<view class="cu-list menu sm-border">
					<view class="cu-item arrow" @click="gourl('../../bbs/topic/my')">
						<view class="content">
							<text class="cuIcon-form text-blue"></text>
							<text class="">我发的瞬间</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="gourl('../../bbs/comment/my')">
						<view class="content">
							<text class="cuIcon-comment text-orange"></text>
							<text class="">我的回复</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="gourl('../../bbs/fav/my')">
						<view class="content">
							<text class="cuIcon-like text-red"></text>
							<text class="">我的收藏</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="gourl('../../bbs/love/my')">
						<view class="content">
							<text class="cuIcon-appreciate text-red"></text>
							<text class="">我的赞同</text>
						</view>
					</view>
				</view>

		</view>

		<mt-footer tab="user"></mt-footer>
	</view>
</template>

<script>
	import mtFooter from "../../components/footer.vue";
	export default {
		components: {
			mtFooter
		},
		data: function() {
			return {
				pageLoad: false,
				pageHide: false,
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
		onHide: function() {

		},
		methods: {
			gourl: function(url) {
				uni.navigateTo({
					url: url,
				})
			},
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
						// console.log(res)
						that.pageLoad = true;
						that.user = res.data.user;
					}
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	
</style>
