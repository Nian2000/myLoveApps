<template>
	<view class="">
		<view class="">

			<view class="time">
				<view class="timep">
					{{d}}天
				</view>

				<view class="timep">
					{{h}}时
				</view>

				<view class="timep">
					{{m}}分
				</view>

				<view class="timep">
					{{s}}秒
				</view>
			</view>
		</view>

		<view class="tps">
			小王与小念在一起的时间<br>
			定个小目标 99999天
		</view>
		<view class="zan">
			<likeButton :throttle="100" :large="2">
				<div class="heart" @click="love"></div>

			</likeButton>
		</view>
		<fireworks v-if="isReady" />
	<mt-footer></mt-footer>
	</view>
</template>
<script>
	import mtFooter from "../../components/footer.vue";
	//引入js文件
	//import browser from '../../js_sdk/ww-browser/libs/browser.js'

	//使用
	// var options = {
	//     'data': '123' // 自定义参数
	// }
	// browser.init(options)
	// browser.show("http://www.icoolc.com")
	import likeButton from '@/components/like-button/like-button.vue'

	import fireworks from '@/components/sanshui-fireworks/index.vue'


	export default {
		components: {
			likeButton,
			fireworks,
			mtFooter
		},
		data() {
			return {
				isReady: false,
				d: 0,
				h: 0,
				m: 0,
				s: 0
			}
		},
		onReady() {
			this.isReady = true;
			this.time()
		},
		methods: {
			love: function() {
				uni.request({
				    url: 'http://love.h2t.me:520/send', //仅为示例，并非真实接口地址。
				    data: {
				        text: 'uni.request'
				    },
				    header: {
				        'custom-header': 'hello' //自定义请求头信息
				    },
				    success: (res) => {

				    }
				});

			},
			time: function() {
				var myDate = new Date(); //获取当前时间
				var endtime = new Date("2020,12,16"); //获取结束时间
				//换算成秒 小数点向下舍入取整
				var ltime = Math.floor((endtime.getTime() - myDate.getTime()) / 1000);
				ltime = Math.abs(ltime);
				//换算成天 小数点向下舍入取整
				this.d = Math.floor(ltime / (24 * 60 * 60));
				//换算成小时取去掉天数的余数（也就是小时） 小数点向下舍入取整
				this.h = Math.floor(ltime / (60 * 60) % 24);
				//换算成分钟取去掉小时的余数（也就是分钟） 小数点向下舍入取整
				this.m = Math.floor(ltime / 60 % 60);
				//换算成分钟取去掉分钟的余数（也就是秒） 小数点向下舍入取整
				this.s = Math.floor(ltime % 60);
				setTimeout(this.time, 1000 )
			}
		}
	}
</script>

<style>
	.zan {
		margin: 200rpx 100rpx;
		text-align: center;
	}

	button {
		background-color: #ff007f;
		color: #FFFFFF;
	}

	.time {
		padding-top: 280rpx;
		display: flex;
		justify-content: center;
	}

	.timep {
		width: 100rpx;
		height: 100rpx;
		background-color: #ff007f;
		line-height: 100rpx;
		text-align: center;
		color: #FFFFFF;
		margin: 2rpx;
		border-radius: 10rpx;
	}


	/* //心 */
	.heart {
		background-color: crimson;
		display: inline-block;
		width: 50px;
		height: 50px;
		position: relative;
		top: 0;
		transform: rotate(-45deg);
		position: absolute;
		left: 45%;
		top: 45%;
		animation: heartbeat 1.25s infinite;
	}

	.heart::before,
	.heart::after {
		content: "";
		background-color: crimson;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		position: absolute;
		animation: pulsecolor 1.25s infinite;
	}

	.heart::before {
		top: -25px;
		left: 0;
	}

	.heart::after {
		top: 0;
		left: 25px;
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1) rotate(-45deg);
		}

		10% {
			transform: scale(1.25) rotate(-45deg);
			background-color: #ff007f;
		}

		100% {
			transform: scale(1) rotate(-45deg);
		}
	}

	@keyframes pulsecolor {
		10% {
			background-color: #ff007f;
		}
	}

	.tps {
		margin-top: 28rpx;
		text-align: center;
		font-size: 12rpx;
		color: #9f9f9f;
	}
</style>
