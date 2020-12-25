<template>
	<view>
		<view class="text-gray padding justify-center flex" v-if="Object.keys(list).length==0" ><text>暂无评论</text></view>
		<view v-else id="comment-list" class="comment-list">
			
			<view class="cu-list menu-avatar comment">
				<view class="cu-item" v-for="(item,key) in list" :key="key">
					<view class="cu-avatar round" :style="'background-image:url('+ item.user.avatar +'?x-oss-process=image/resize,m_fixed,w_100' +');'"></view>
					<view class="content">
						<view class="text-grey">{{item.user.nickname}}</view>
						<view class="text-gray text-content text-df" :pid="item.id" :title="'回复@'+item.nickname" :reply_text="'回复@'+item.nickname">
							{{item.content}}
						</view>
						<view class="flex justify-between">
							<view class="text-gray text-df">{{item.createTime}}</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="text-gray padding justify-center flex" v-if="listShow" @click="getList"><text>查看更多评论</text></view>
		<view v-if="!unLogin" class="padding-tb-xl margin-top-xl">
			<view class="cu-bar foot bg-white justify-end flex">
				<view class="padding-right-xl">
					<button class="cu-btn bg-blue shadow lg" @click="show = true">回复</button>
				</view>		
			</view>	
		</view>
		
		<u-popup v-model="show" mode="bottom">
			<view class="wrap">
				<form @submit="cmFormSubmit" class="">
					<view style="display: none;">
						<input type="text" name="tablename" :value="tablename" />
						<input type="text" name="objectid" :value="objectid" />
					</view>
					<view class="cu-form-group align-start">
						<view class="title">评论</view>
						<textarea name="content" maxlength="-1" placeholder="请输入内容"></textarea>
					</view>
					<view class="flex justify-center padding">
						<button @click="show = false" class="cu-btn shadow margin-right-xl bg-red">取消</button>
						<button formType="submit" class="cu-btn shadow bg-blue">评论</button>
					</view>
				</form>			
			</view>			
		</u-popup>
		
	</view>
</template>

<script>
	import mdate from "../common/date.js"; 
	export default {
		props:{
			tablename:"",
			objectid:""
		},
		data:function(){
			return {
				rscount:0,
				list:[],
				cmFormClass:"",
				cmBtnClass:"",
				unLogin:true,
				ssuserid:"",
				show: false,
				start: 0,
				limit: 4,
				listShow: true
			}
		},
		created:function(){		 
			this.getPage();
			//start 检测登录
			this.ssuserid=getApp().globalData.ssuserid;
			// console.log(getApp().globalData)
			this.unLogin=getApp().globalData.unLogin;			 
			//End 检测是否登录 
		},
		methods:{
			getPage:function(){
				var that=this;
				// console.log(this.objectid)
				uniCloud.callFunction({
					name:"comment",
					data:{
						cloudAction:"list",
						params:{
							objectid: this.objectid,
							tablename: this.tablename,
							start: 0,
							limit: this.limit,
						}
					},
					success:function(e){
						var res = e.result.data;
						that.list = []
						if(res.list.length < that.limit){							
							that.listShow = false							
						}else{
							that.listShow = true							
						}
						for(var i in res.list){
							that.list.push(res.list[i])
						}
						that.start = 0 + that.limit;
						// console.log(that.start)
						// console.log(that.list)
					},
					fail:function(e){
						// console.log(e)
					}
					 
				})
			},
			getList:function(){
				var that=this;
				// console.log(this.objectid)
				uniCloud.callFunction({
					name:"comment",
					data:{
						cloudAction:"list",
						params:{
							objectid: this.objectid,
							tablename: this.tablename,
							start: this.start,
							limit: this.limit,
						}
					},
					success:function(e){
						var res = e.result.data;
						if(res.list.length < that.limit){
							for(let i in res.list){
								that.list.push(res.list[i])
							}
							that.start = that.start + that.limit;
							uni.showToast({
								title:'没有评论了！',
								icon:'none'
							})
							that.listShow = false
							// console.log(that.start)
						}else{
							for(let i in res.list){
								that.list.push(res.list[i])
							}
							that.start = that.start + that.limit;
						}
						// console.log(that.list)
					},
					fail:function(e){
						// console.log(e)
					}
					 
				})
			},
			cmFormSubmit:function(e){			
				var that=this;
				var params=e.detail.value;
				if(params.content == ''){
					uni.showToast({
						title:'评论内容不能为空！',
						icon:'none'
					})
					return
				}
				this.show = false
				params.userid=this.ssuserid;
				params.status=0;
				params.createTime=new Date().Format("yyyy-MM-dd hh:mm:ss");
				uniCloud.callFunction({
					name:"comment",
					data:{
						cloudAction:"save",
						params:params
					},
					success:function(e){
						if(e.result.error){
							uni.showToast({
								title:e.result.message
							})
							return false;
						}
						that.getPage();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
