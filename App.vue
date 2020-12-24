<script>
import Vue from 'vue'
export default {

	onLaunch: function() {
		//检测是否登录
		var that=this;
		var callRes=uniCloud.callFunction({
			name:'user-center',
			data:{
				action:'checkToken',
				uniIdToken: uni.getStorageSync('uniIdToken')
			},
			success:function(callRes){	
				// console.log(callRes)				
				if(callRes.result.uid==undefined){
					return false;
				}				
				setTimeout(function(){
					getApp().globalData.ssuserid=callRes.result.uid;
					getApp().globalData.unLogin=false;
				},30)		
			}
		})
		
		uni.getSystemInfo({
			success: function(e) {				
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				};
				// #endif
		
				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif		
		
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		})
		//End 检测是否登录 
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData:{
		ssuserid:"",
		unLogin:true
	}
};
</script>

<style lang="scss">
// @import "./common/dt-ui-uni.css";

@import "uview-ui/index.scss";
@import "./common/iconfont.css";
@import "colorui/main.css";
@import "colorui/icon.css";

</style>
