<template>
	<view class="videoBox">
		<!-- <cu-custom bgColor="bg-gradual-blue">
			<block slot="content">视频</block>
		</cu-custom> -->
		
		<video id="myvideo" class="myvideo" 
			@fullscreenclick="next" 
			@click="next"
			:src="videosrc"
			:loop="true"
			object-fit="cover"
			:controls="true" 
			:autoplay="true">
		</video>
		
		<view class="text-content padding-left padding-right" style="width:100%;">
			{{videocontent}}
		</view>
		
		<!-- <view class="padding flex flex-direction">
			<button class="cu-btn bg-gradual-blue shadow lg" @click="playVideo">进入全屏</button>
			<view class="text-gray justify-center flex text-sm margin-top-sm"><text class="text-red">*</text><text>进入全屏后点击屏幕即可播放下一个视频。</text></view>
		</view> -->
		<view class="text-gray justify-between flex text-sm padding-left padding-right">
			<view><text class="text-red">*</text><text>♥进入全屏后点击屏幕即可播放下一个视频哦。</text></view>
			<view>{{index + 1 + start}}/{{total}}</view>
		</view>
		<view class="flex justify-around margin-top-sm">
			<button class="cu-btn bg-gradual-blue shadow " @click="playVideo">全屏</button>
			<button class="cu-btn bg-gradual-orange shadow" @click="prev" :disabled="prevBtn">上一个</button>
			<button class="cu-btn bg-gradual-green shadow" @click="next" :disabled="nextBtn">下一个</button>
		</view>
		
		<m-footer tab="video"></m-footer>
	</view>
</template>

<script>
	import mFooter from "@/components/footer.vue";
	export default {
		components: {
			mFooter
		},
		data() {
			return {
				videoContext:null,
				videosrc:'',
				videoList:[],
				index:0,
				videocontent:'',
				total:10,
				start:0,
				limit:10,
				prevBtn:false,
				nextBtn:false
			}
		},
		onLoad() {
			this.initPage()
		},
		onReady(){
			// 页面初次渲染！  createVideoContext uni video自带 上下文 如果不懂可以去百度
			this.videoContext = uni.createVideoContext('myvideo');
		},
		methods: {
			playVideo(){
				// console.log('点击全屏,我要全屏了')
				// 全屏
				this.$nextTick(()=>{
					// requestFullScreen全屏 direction 屏幕得角度！
					this.videoContext.requestFullScreen({
						direction:0
					})
				})
			},
			async prev(){
				this.prevBtn = true
				if(this.start === 0){
					if(this.index === 0){
						uni.showToast({
							title:'这是第一个！',
							icon:'none'
						})
						this.prevBtn = false
						return
					}else{
						this.index = this.index - 1
					}	
				}else{
					if(this.index === 0){
						this.start = this.start - 10
						await this.initPage()
						this.index = this.videoList.length -1
					}else{
						this.index = this.index - 1
					}
				}
				this.videosrc = this.videoList[this.index].video_src
				this.videocontent = this.videoList[this.index].content
				this.prevBtn = false
			},
			async next(){
				this.nextBtn = true
				if(this.index === this.videoList.length -1){
					if(this.start + this.index + 1 === this.total){
						uni.showToast({
							title:'这是最后一个！',
							icon:'none'
						})
						this.nextBtn = false
						return
					}
					this.start = this.start + 10
					this.index = 0
					await this.initPage()	
				}else{
					this.index = this.index + 1
				}
				this.videosrc = this.videoList[this.index].video_src
				this.videocontent = this.videoList[this.index].content
				this.nextBtn = false
			},
			async initPage(){
				var that = this
				await uniCloud.callFunction({
					name: 'videoList',
					data: {
						action: "get",
						params:{
							start: this.start,
							limit: this.limit
						}
					},
				}).then((res) => {
					const result = res.result.data.list
					that.total = res.result.data.total
					that.videoList = result
				}).catch((err) => {
					console.error(err)
				})
				this.videosrc = this.videoList[0].video_src
				this.videocontent = this.videoList[0].content
			},
		}
	}
</script>

<style scoped lang="scss">
	.myvideo{
		width: 100%;
		height: 80vh;
	}
	.videoBox{
		height: 100vh;
		background-color: #FFFFFF;
	}
</style>
