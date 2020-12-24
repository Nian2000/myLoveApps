<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">我的评论</block>
		</cu-custom>
		<un-login v-if="unLogin"></un-login> 
		<view v-else >
			<view class="text-gray padding justify-center flex" v-if="Object.keys(list).length==0" ><text>暂无数据</text></view>
			<view class="cu-item padding bg-white solid-bottom" v-for="(item,key) in list" :key="key">
				<view class="content">
					<view class="text-content">
						{{item.content}}
					</view>
					<view class="flex justify-end">
						<view @click="del(item._id)" class="text-red"><text class="cuIcon-delete"></text>删除</view>	
					</view>
				</view>
			</view>
		</view>
		<m-footer tab="user"></m-footer>
	</view>
</template>

<script>
	import mFooter from "../../components/footer.vue";
	export default {
		components:{
			mFooter
		},
		data() {
			return {
				pageLoad:false,
				list: [],
				isFirst:true,
				start:0,
				limit:10,
				unLogin:true,
				ssuserid:"",
				tablename:"bbs_topic"
			}
		},
		onLoad:function(ops){
			if(ops.tablename!=undefined){
				this.tablename=ops.tablename;
			}
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
					name:"comment",
					data:{
						cloudAction:"my",
						params:{
							tablename:this.tablename,
							ssuserid:this.ssuserid,
							start:0,
							limit:this.limit,
						}
					}
				}).then((result)=>{
					var res=result.result.data;
					that.list = res.list;
					that.isFirst = false;
					that.start = 0 + that.limit;
					that.pageLoad = true;
				})
			},
			getList: function() {
				var that = this;
				if(that.start == 0 && !that.isFirst){
					return false;
				}
				// console.log(111)
				uniCloud.callFunction({
					name: "comment",
					data: {
						cloudAction: "my",
						params:{
							tablename:this.tablename,
							ssuserid:this.ssuserid,
							start:this.start,
							limit:this.limit,
						}
					},
				}).then((result) => {
					var res=result.result.data;					
					if(that.isFirst){
						that.list = res.list;
						that.isFirst=false;
					}else{
						// console.log("getList")
						// console.log(that.start,res.list)
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
			del:function(id){
				var that=this;
				uni.showModal({
					title:"删除提示",
					content:"删除后不可恢复",
					success:function(res){
						if(res.confirm){
							uniCloud.callFunction({
								name:"comment",
								data:{
									cloudAction:"delete",
									params:{
										tablename:this.tablename,
										id:id,
										ssuserid:this.ssuserid,
									}
								}
							}).then((res)=>{
								for(var i in that.list){
									if(that.list[i]._id==id){
										that.list.splice(i,1);
										 
									}
								}
								 
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
