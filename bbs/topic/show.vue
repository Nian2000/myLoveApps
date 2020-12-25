<template>
	<view>		
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">{{data.title}}</block>
		</cu-custom>
		<!-- 加载动画 -->
		<view class="text-gray padding justify-center flex align-center" v-if="!pageLoad" >
			<u-loading mode="circle" color="#fc6e8f" size="40"></u-loading>
			<view class="margin-left-sm">加载中...</view>
		</view>	
		
		<view v-if="pageLoad">
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<view @click="openImg(author.avatar)" class="cu-avatar round lg" :style="'backgroundImage:url('+ author.avatar +'?x-oss-process=image/resize,m_fixed,w_100' +')'"></view>
					<view class="content flex-sub">
						<view>{{author.nickname}}</view>
						<view class="text-gray flex justify-between">
							<view class="text-sm">粉丝：{{fans}} 关注：{{blogger}}</view>
							<view v-if="!unLogin" class="margin-right-sm">
								<button v-if="focus == true" @click="cancelFocus" class="cu-btn shadow bg-grey sm">已关注</button>
								<button v-else-if="focus == false" @click="focusOn" class="cu-btn shadow bg-red sm">关注</button>	
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="cu-card no-card margin-top">
				<view class="cu-item padding">
					<view class="flex justify-center">
						<view class="text-lg margin-bottom-sm"> {{data.title}} </view>
					</view>
					<view class="text-gray flex justify-end">
						<view class="text-sm margin-bottom-sm">{{data.createTime}}</view>									
					</view>
					<image style="width: 100%;" v-for="(item,index) in data.imgList" :key="index" :src="item.imgurl" mode="widthFix" :data-src="index" @tap="openImg"></image>
					<view class="text-content margin-top-sm">
						{{data.content}}
					</view>
					<view  v-if="!unLogin" class="content flex-sub margin-top-sm">				
						<view class="text-gray flex justify-around">
							<view @click="loveToggle(data._id)" v-bind:class="islove?'text-red':''"><text class="cuIcon-appreciatefill"></text>点赞</view>
							<view @click="favToggle(data._id)" v-bind:class="isfav?'text-red':''"><text class="cuIcon-likefill"></text>收藏</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-blue"></text> 回复列表
				</view>
			</view>
			
			<cmform tablename="bbs-topic" :objectid="data._id"></cmform>
		</view>
	</view>
</template>

<script>
	import cmform from "../../components/cmform.vue";
	export default {
		components: {
			cmform
		},
		data: function() {
			return {
				focus : false,
				pageLoad: false,
				author: {},
				data: {},
				id: "",
				islove: false,
				isfav: false,
				ssuserid:"",
				unLogin:true,
				fans: 0,
				blogger:0
			}
		},
		onLoad: function(ops) {
			this.id = ops.id;		
			//start 检测登录
			this.ssuserid=getApp().globalData.ssuserid;
			// console.log(this.ssuserid);
			// console.log(getApp().globalData)
			this.unLogin=getApp().globalData.unLogin;
			// console.log(this.unLogin)
			//End 检测是否登录 
			this.getPage();
			this.addView();
		},
		methods: {
			openImg(e){
				var current = e.target.dataset.src;
				// console.log(current)
				var imageList =[]
				for(var index in this.data.imgList){
					imageList[index] = this.data.imgList[index].imgurl
				}
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
			focusOn(){
				if(this.author._id == this.ssuserid){
					uni.showToast({
						title:'不能关注自己！',
						icon:'none'
					})
					return
				}
				var that = this;
				uniCloud.callFunction({
					name: "fans",
					data: {
						action: "add",
						params:{
							bloggerId: this.author._id,
							fansId: this.ssuserid
						}
					}
				}).then((res) => {				
					if(res.success == true){
						that.focus = true
						uni.showToast({
							title:'关注成功！',
							icon:'none'
						})
					}
				})
			},
			cancelFocus(){
				var that = this;
				uniCloud.callFunction({
					name: "fans",
					data: {
						action: "cancel",
						params:{
							bloggerId: this.author._id,
							fansId: this.ssuserid
						}
					}
				}).then((res) => {
					// console.log(res)		
					if(res.success == true){
						that.focus = false
						uni.showToast({
							title:'取消关注！',
							icon:'none'
						})
					}
				})
			},
			async getPage() {
				var that = this
				await uniCloud.callFunction({
					name: "bbs_topic",
					data: {
						cloudAction: "show",
						params:{
							id: this.id
						}				
					}
				}).then((res) => {
					var res = res.result.data;
					that.data = res.data;				 
					that.author = res.user;
					// console.log(that.author)					
				})
				this.pageLoad = true;
				uniCloud.callFunction({
					name:"love",
					data:{
						cloudAction:"get",
						params:{
							objectid:this.id,
							tablename:"bbs-topic",
							ssuserid:this.ssuserid,
						}
					},
					success:(e)=>{
						// console.log("love",e);
						if(e.result.data==1){
							that.islove=true;
						}else{
							that.islove=false;
						}
					},
				})
				
				uniCloud.callFunction({
					name:"fav",
					data:{
						cloudAction:"get",
						params:{
							objectid:this.id,
							tablename:"bbs-topic",
							ssuserid:this.ssuserid,
						}
					},
					success:(e)=>{
						if(e.result.data==1){
							that.isfav=true;
						}else{
							that.isfav=false;
						}
					},
				})
				await uniCloud.callFunction({
					name: "fans",
					data: {
						action: "get",
						params:{
							bloggerId: this.author._id,
							fansId: this.ssuserid
						}
					}
				}).then((res) => {
					if(res.result == 1){
						that.focus = true
					}
				})
				
				await uniCloud.callFunction({
					name: "fans",
					data: {
						action: "getfans",
						params:{
							bloggerId: this.author._id,
						}
					}
				}).then((res) => {
					that.fans = res.result
				})
				await uniCloud.callFunction({
					name: "fans",
					data: {
						action: "getblogger",
						params:{
							bloggerId: this.author._id,
						}
					}
				}).then((res) => {
					that.blogger = res.result
				})					
			},
			addView() { //记录浏览次数
				var that = this;
				uniCloud.callFunction({
					name: "bbs_topic",
					data: {
						cloudAction: "addView",
						params:{
							id: this.id,
						}
					}
				}).then((res) => {
					// console.log(res)
				})
			},
			favToggle(id) { //收藏or取消收藏
				var that = this;
				var that = this;
				uniCloud.callFunction({
					name:"fav",
					data:{
						cloudAction:"toggle",
						params:{
							objectid:id,
							tablename:"bbs-topic",
							ssuserid:this.ssuserid,
						}
					},
					success:(e)=>{
						if(e.result.data.action=='add'){
							that.isfav=true;
						}else{
							that.isfav=false;
						}						 
					},
					fail:(e)=>{
						// console.log(e)
					}
				}) 
			},
			loveToggle(id) {//点赞or取消点赞
				// console.log(id)
				var that = this;
				uniCloud.callFunction({
					name:"love",
					data:{
						cloudAction:"toggle",
						params:{
							objectid:id,
							tablename:"bbs-topic",
							ssuserid:this.ssuserid,
						}
					},
					success:(e)=>{
						if(e.result.data.action=='add'){
							that.islove=true;
						}else{
							that.islove=false;
						}						 
					},
					fail:(e)=>{
						// console.log(e)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
