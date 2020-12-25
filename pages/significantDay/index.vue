<template>
	<view class="">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">纪念日</block>
		</cu-custom>
		<u-time-line class="padding">
			<u-time-line-item v-for="(item,index) in list" nodeTop="2">
				<template v-slot:content>
					<view @click="go(item._id)" >
						<view class="u-order-title">{{item.title}}</view>
						<view class="u-order-desc">{{item.content}}</view>
						<view class="u-order-time">{{item.createTime}}</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>

	</view>
</template>

<script>
	export default {
		data: function() {
			return {
				list: []
			}
		},
		onLoad: function() {
			uniCloud.callFunction({
				name: 'bbs_topic',
				data: {
					cloudAction: "day"
				}
			}).then((result) => {
				console.log(result)
				this.list = result.result.data.list;
			}).catch((err) => {
				console.error(err)
			})
		},
		methods: {
			go:function(id){
				uni.navigateTo({
					url: "../../bbs/topic/show?id=" + id
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.padding {
		padding: 80rpx;
	}

	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}

	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}

	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.u-order-time {
		color: rgb(255, 0, 127);
		font-size: 26rpx;
	}
</style>
