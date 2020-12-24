<template>
	<view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(img,imgIndex) in imgsList" :key="imgIndex">
				 <image :src="img.imgurl+'?x-oss-process=image/resize,m_fixed,h_100,w_100'" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @click="delImg(imgIndex)">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @click="upImg()">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<!-- 模拟弹窗 -->
		<u-modal :show-cancel-button="true" v-model="confirmShow" :content="confirmContent" @confirm="confirm"></u-modal>
		<!-- 模拟提示 -->	
		<u-toast ref="uToast" />
		<u-popup v-model="show" mode="center" :mask-close-able="false" border-radius="24" width="580">
			<view class="padding-xl">
				<view>当前进度：{{imgsList.length}}/{{imageList.length}}</view>
				<u-line-progress active-color="#2979ff" height="20" :percent="progress"></u-line-progress>
			</view>
		</u-popup>		
	</view>
</template>

<script>
 
	export default {
		name:"upimg-box",
		props:{
			defaultImgsList:Array,
		},
		data:function(){
			return {
				confirmContent:'',
				confirmShow:false,
				show:false,
				progress:0,
				imageList:[],
				imgsList:this.defaultImgsList,
			}
		},
		methods:{
			upImg:function(){
				var that=this;
				this.imageList = []
				uni.chooseImage({
					count:9, //默认是9张
					sizeType:['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success:res=>{
						this.imageList = this.imageList.concat(res.tempFilePaths);
						this.confirmShow = true
						this.confirmContent = '是否上传？共'+this.imageList.length+'张图片。'
					}
				});
			},
			async confirm(){
				var that=this
				this.show = true
				const tempFilePaths = this.imageList
				const len = tempFilePaths.length
				for(var i=0;i<len;i++){
					this.progress = 0
					await uniCloud.uploadFile({
						filePath: tempFilePaths[i],
						cloudPath: Date.now()+'.jpg',
						dataType:"json",
						onUploadProgress: function(progressEvent) {
							// console.log(progressEvent)
							that.progress = (progressEvent.loaded/progressEvent.total)*100
						},
						success: function (res) {
							// console.log(res.fileID)
							if(res.success==true){
								that.show = false
								that.imgsList.push({
									imgurl:res.fileID
								})
								that.$refs.uToast.show({ //提示成功并返回上个页面
									title: '上传成功！',
									type: 'success',
									icon: true,
									duration: 2000,
								})
								that.$emit("callParent",that.imgsList)
								// console.log(that.imgsList)
							}									 
						}
					});
				}	
			},
			delImg:function(index){
				uni.showModal({
					title: '提示',
					content: '是否要删除该图片',
					success: res => {
						if (res.confirm) {
							this.imgsList.splice(index, 1)
							this.$emit("callParent",this.imgsList)
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
