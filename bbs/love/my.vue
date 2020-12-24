<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">我的点赞</block>
		</cu-custom>
		<un-login v-if="unLogin"></un-login> 
		<view v-else >
			<view class="text-gray padding justify-center flex" v-if="Object.keys(list).length==0" ><text>暂无数据</text></view>	
					
			<view class="cu-card case isCard">
				<view class="cu-item shadow" v-for="(item,index) in list" :key="index" @click="goDetail(item._id)">
					<view class="image">
						<image mode="widthFix" :src="item.imgList[0].imgurl"></image>
						<view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{item.title}}</text></view>
					</view>
					<view class="text-content padding-sm text-cut" style="width:100%;">
						{{item.content}}
					</view>
				</view>
			</view>
		
		</view>
		 
	</view>
</template>

<script>
	 
	export default {		 
		data() {
			return {
				pageLoad:false,
				list: [],
				isFirst:true,
				start:0,
				limit:4,
				unLogin:true,
				ssuserid:""
			}
		},
		onLoad:function(){
			this.getPage();
		},
		onPullDownRefresh:function(){		 
			this.getPage();
			uni.stopPullDownRefresh();
		}, 
		onReachBottom:function(){		
			this.getList();		
		},
		methods: {
			goDetail:function(id){
				uni.navigateTo({
					url:"../topic/show?id="+id
				})
			},		 
			getPage:function(){
				var that=this;
				//start 检测登录
				this.ssuserid=getApp().globalData.ssuserid;
				this.unLogin=getApp().globalData.unLogin;
				if(this.ssuserid==''){
					return false;
				} 
				//End 检测是否登录 
				uniCloud.callFunction({
					name:"bbs_love",
					data:{
						cloudAction:"my",
						params:{
							userid:this.ssuserid,
							start:0,
							limit:this.limit,
						}
					}
				}).then((result)=>{
					var res = result.result.data;
					that.list = res.list;
					that.isFirst = false;
					that.start = 0 + that.limit;
					that.pageLoad = true;
					console.log(111)
				})
			},
			getList: function() {
				var that = this;
				if(that.start==0 && !that.isFirst){
					return false;
				}
				 
				uniCloud.callFunction({
					name: "bbs_love",
					data: {
						cloudAction: "my",
						params:{
							userid:this.ssuserid,
							start:this.start,
							limit:this.limit,
						}
					}
				}).then((result) => {
					var res=result.result.data;
					// console.log(res)
					if(that.isFirst){
						that.list = res.list;
						that.isFirst= false ;
					}else{
						// console.log(res.list)
						if(res.list.length==0){
							that.start=0;
							return false;
						}
						for(var i in res.list){
							that.list.push(res.list[i])
						}
					}
					that.start=that.start+that.limit;
				})
			},
			
		}
	}
</script>

<style scoped lang="scss">
	
</style>
