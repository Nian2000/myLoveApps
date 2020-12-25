<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">发布到星球</block>
		</cu-custom>

		<u-tabs name="cate_name" :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<u-gap height="20" bg-color="#f1f1f1"></u-gap>
		<un-login v-if="unLogin"></un-login>

		<view v-else>
			<form @submit="formSubmit" v-show="current === 0">
				<view class="cu-form-group align-start">
					<view class="title">标题</view>
					<textarea name="title" maxlength="100" placeholder="亲爱的,我们又有了什么重要回忆？"></textarea>
				</view>
				<view class="cu-form-group align-start">
					<textarea name="content" maxlength="2000" placeholder="爱你就像要记录的内容一样,说不完."></textarea>
				</view>
				<view class="flex padding" style="flex-direction:row-reverse; background-color:#fff;">
					<switch color="#fc6c8d" name="day" /><text style="font-size: 10rpx; line-height: 50rpx; padding:0rpx 20rpx;">纪念日</text>
				</view>
				<view class="bg-white">
					<upimg-box @callParent="callImgList" :defaultImgsList="[]"></upimg-box>

					<view class="padding flex flex-direction margin-top-sm">
						<button class="cu-btn bg-gradual-blue shadow lg" form-type="submit">发布</button>
					</view>
				</view>
			</form>

			<form v-show="current === 1">
				<view class="bg-white">
					<view class="cu-form-group align-start">
						<view class="title">视频描述</view>
						<textarea v-model="video.content" maxlength="100" placeholder="这个小视频有什么描述嘛？"></textarea>
					</view>
					<view v-if="video.video_src" style="position:relative;width:250rpx;height:200rpx; margin: 20upx 0 20upx 40upx;">
						<video style="width:250upx;height:200upx;" :src="video.video_src"></video>
						<view style="position:absolute; right: -20rpx; top: -20rpx; z-index:9999;" @tap="delectVideo">
							<image style="width:30rpx;height:30rpx;" src="../../static/del.png" mode=""></image>
						</view>
					</view>
					<view v-if="videoShow" @tap="chooseVideo" style="width: 250rpx;height:250rpx;background-color: #F1F1F1; margin: 20rpx auto 0;display:flex; justify-content: center; align-items: center; flex-direction: column;">
						<image src="../../static/photo.png" style="width:100rpx;height:100rpx;" mode=""></image>
						<view style="font-size:30rpx;">视频</view>
					</view>
					<view class="padding flex flex-direction margin-top-sm">
						<button class="cu-btn bg-gradual-blue shadow lg" @click="Submit">发布</button>
					</view>
				</view>
			</form>
		</view>

		<!-- 模拟弹窗 -->
		<u-modal :show-cancel-button="true" v-model="confirmShow" :content="confirmContent" @confirm="confirm"></u-modal>
		<!-- 模拟提示 -->
		<u-toast ref="uToast" />
		<u-popup v-model="show" mode="center" :mask-close-able="false" border-radius="24" width="580">
			<view class="padding-xl">
				<view>当前进度：</view>
				<u-line-progress active-color="#fb6588" height="20" :percent="progress"></u-line-progress>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import upimgBox from "@/components/upimgbox.vue";
	import mtFooter from "@/components/footer.vue";
	import mdate from "@/common/date.js";

	export default {
		components: {
			mtFooter,
			upimgBox
		},
		data: function() {
			return {
				unLogin: true,
				ssuserid: "",
				imgsList: [],
				list: [{
					cate_name: '记录瞬间'
				}, {
					cate_name: '发小视频'
				}],
				current: 0,
				video: {
					content: '',
					video_src: '',
					video_img: '',
					love_num: 0,
					comm_num: 0,
					redo_num: 0,
					add_time: '',
					update_time: '',
					userid: '',
					status: 1
				},
				srcVideo: '',
				videoShow: true,
				confirmShow: false,
				confirmContent: '',
				show: false,
				progress: 0
			}
		},
		onLoad: function(e) {
			if (e.type == 1) {
				this.current = 1;
			} else {
				this.current = 0;
			}
			this.getPage()
		},
		methods: {
			change(index) {
				this.current = index
			},
			chooseVideo() {
				//上传视频
				uni.chooseVideo({
					maxDuration: 60, //拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
					count: 1,
					camera: 'back', //'front'、'back'，默认'back'
					sourceType: ['album', 'camera'],
					success: res => {
						this.srcVideo = res.tempFilePath
						this.confirmShow = true
						this.confirmContent = '是否上传视频？'
					}
				})
			},
			confirm() {
				this.videoShow = false
				this.show = true
				this.progress = 0
				var that = this
				const FilePaths = this.srcVideo
				uniCloud.uploadFile({
					filePath: FilePaths,
					cloudPath: Date.now() + '.mp4',
					dataType: "json",
					onUploadProgress: function(progressEvent) {
						// console.log(progressEvent)
						that.progress = (progressEvent.loaded / progressEvent.total) * 100
					},
					success: function(res) {
						// console.log(res.fileID)
						if (res.success == true) {
							that.show = false
							that.video.video_src = res.fileID
							that.$refs.uToast.show({ //提示成功并返回上个页面
								title: '上传视频成功！',
								type: 'success',
								icon: true,
								duration: 2000,
							})
						}
					}
				})
			},
			Submit() {
				if (this.video.content == '' || this.video.video_src == '') {
					uni.showToast({
						title: "内容未填或视频未上传成功！",
						icon: 'none'
					})
					return
				}
				this.video.add_time = new Date().Format("yyyy-MM-dd hh:mm:ss")
				this.video.userid = this.ssuserid
				uniCloud.callFunction({
					name: 'videoList',
					data: {
						action: "add",
						params: this.video
					}
				}).then((res) => {
					uni.showToast({
						title: "发布成功"
					})
					uni.reLaunch({
						url: "/pages/video/index"
					})
				}).catch((err) => {
					console.error(err)
				})
			},
			delectVideo() {
				this.video.video_src = ''
				this.videoShow = true
			},
			callImgList: function(e) {
				this.imgsList = e;
			},
			getPage: function() {
				//start 检测登录
				this.ssuserid = getApp().globalData.ssuserid;
				// console.log(getApp().globalData)
				this.unLogin = getApp().globalData.unLogin;
				if (this.ssuserid == '') {
					return false;
				}
				//End 检测是否登录 
			},
			formSubmit: function(e) {
				var params = e.detail.value;
				// console.log(params)
				if (params.title == '' || params.content == '' || this.imgsList.length == 0) {
					uni.showToast({
						title: "标题、内容必填，图片至少上传一张！",
						icon: 'none'
					})
					return
				}
				params.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
				params.imgList = this.imgsList;
				params.userid = this.ssuserid;
				params.love_num = 0;
				params.view_num = 1;
				params.comment_num = 0;
				params.status = 0;
				uniCloud.callFunction({
					name: 'bbs_topic',
					data: {
						cloudAction: "save",
						params: params
					}
				}).then((res) => {
					uni.showToast({
						title: "发布成功"
					})
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}).catch((err) => {
					console.error(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
