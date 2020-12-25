<template>
	<view class="content">
		<view class="box">
			<button type="primary" @click="sendSms">发送短信</button>
		</view>
		<view class="box">
			<button type="primary" @click="dial">拨号</button>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
			}
		},
		onLoad() {
			
		},
		methods: {
			// 发送短信
			sendSms : function () {
				// ['17755555555','17866666666']  //群发短信
				var toNum  = ['17866666666'];     //单发短信
				var toBody = `北京时间${new Date()}谁谁谁你好，邀请你测试`
				this.typeSms(toNum,toBody);
			},
			// 短信主体（封装）
			typeSms : function (toNum,toBody) {
				// #ifdef APP-PLUS
				var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
				msg.to = toNum ;
				msg.bodyType = "text/html" ;
				msg.body = toBody ;
				plus.messaging.sendMessage( msg );
				// #endif
			},
			// 拨号
			dial : function () {
				// #ifdef APP-PLUS
				plus.device.dial("17819700736", false);
				// #endif
			},
		}
	}
</script>

<style>
	.box{
		width: 100%;
		margin-top: 50rpx;
	}
</style>
