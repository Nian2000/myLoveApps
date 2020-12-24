<template>
	<view>
		
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">首页</block>
		</cu-custom>
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
		<!--  @init="mescrollInit" @down="downCallback" @up="upCallback"为固定值,不可删改(与mescroll-mixins保持一致) 
			:down="downOption" :up="upOption" 绝大部分情况无需配置 
			:top="顶部偏移量" :bottom="底部偏移量" :topbar="状态栏" :safearea="安全区" (常用)
			字节跳动小程序 ref="mescrollRef" 必须配置 
			此处支持写入原生组件 -->
			<view class="cu-card case isCard">
				<view class="cu-item shadow" v-for="(item,index) in list" :key="index" @click="goDetail(item._id)">
					<view class="image">
						<image class="sglist-imglist-img" mode="widthFix" :src="item.imgList[0].imgurl"></image>
						<view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{item.title}}</text></view>
					</view>
					<view class="text-content padding-sm text-cut" style="width:100%;">
						{{item.content}}
					</view>
					<view class="content flex-sub">				
						<view class="text-gray flex justify-around padding-bottom">
							<view><text class="cuIcon-appreciatefill"></text> {{item.love_num}}</view>
							<view><text class="cuIcon-messagefill"></text> {{item.comment_num}}</view>
							<view><text class="cuIcon-attentionfill"></text> {{item.view_num}}</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>	
		<m-footer tab="home"></m-footer>
	</view>
</template>

<script>
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import mFooter from "@/components/footer.vue";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			mFooter
		},
		data() {
			return {
				list: [],
				upOption:{
					page:{
						num : 0 ,
						size : 4 ,
						time : null
					},
					noMoreSize: 4					
				},
				response:''
			}
		},
		onLoad: function() {
			
		},
		methods: {
			/*下拉刷新的回调*/
			downCallback(){
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 设置为4
				
				var that = this;
				uniCloud.callFunction({
					name: "bbs_topic",
					data: {
						cloudAction: "index",
						params:{
							start: (pageNum-1) * pageSize,
							limit: pageSize
						}
					},					
					success:(response) => {
						// console.log(result)
						let res = response.result.data
						let curPageData = res.list
						let curPageLen = pageSize
						let totalSize = res.total
						
						//设置列表数据
						if(page.num == 1) that.list = []; //如果是第一页需手动置空列表
						that.list = that.list.concat(curPageData); //追加新数据					
						// 请求成功,隐藏加载状态
						that.mescroll.endBySize(curPageLen, totalSize)
					},
					fail:()=>{
						//  请求失败,隐藏加载状态
						that.mescroll.endErr()
					}
				})				
				// 此处仍可以继续写其他接口请求...
				// 调用其他方法...
			},
			goDetail: function(id) {
				uni.navigateTo({
					url: "../../bbs/topic/show?id=" + id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
