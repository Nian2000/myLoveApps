<template>
	<view>
		<u-grid :col="3" @click="open">
			<u-grid-item v-for="(item, index) in list" :index="index+''" :key="index">
				<u-icon name="photo" :size="80" :style="'color:'+item.color+';'"></u-icon>
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
				list: [{
					name: "圣诞节",
					url: "http://qq.h2t.me/m1",
					color: "#ff557f",
					icon: "photo",
					p: {
						a: 1
					}
				}, {
					name: "圣诞节1",
					url: "http://qq.h2t.me/m2",
					color: "#4838ff",
					icon: "photo",
					p: {
						a1: 1
					}
				}]
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
				console.log(url, options)
				browser.init(options)
				browser.show(url)
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
