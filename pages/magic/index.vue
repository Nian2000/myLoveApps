<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">魔法工具箱</block>
		</cu-custom>
		<u-grid :col="3" @click="open">
			<u-grid-item v-for="(item, index) in list" :index="index+''" :key="index">
				<u-icon :name="item.icon" :size="80" :style="'color:'+item.color+';'"></u-icon>
				<view class="grid-text">{{item.name}}</view>
			</u-grid-item>
		</u-grid>

		<m-footer tab="friend"></m-footer>
	</view>
</template>

<script>
	import mFooter from "@/components/footer.vue";
	import browser from '../../js_sdk/ww-browser/libs/browser.js';


	export default {

		components: {
			mFooter
		},
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			uniCloud.callFunction({
				name: 'magic',
				data: {
					cloudAction: "get",
				}
			}).then((res) => {
				this.list = res.result.data;
			}).catch((err) => {
				console.error(err)
			})
		},
		methods: {
			open(e) {
				var options = this.list[e].p;
				var url = this.list[e].url;
				console.log(url)
				if(url.indexOf("http")!= -1){
					browser.init(options)
					browser.show(url)
				}else{
					uni.navigateTo({
						url:url
					})
				}
				
			}
		}
	}
</script>

<style>
	.grid-text {
		font-size: 20rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.item {
		height: 150rpx;
	}
</style>
