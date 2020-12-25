<template>
	<div>
		
		<h4>content======输出打印======={{content}}</h4>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				content : [],
			}
		},
		onLoad() {
			this.getCalllog()
		},
		onShow() {
			this.getCalllog()
		},
		methods:{
			getCalllog(){
				//#ifdef APP-PLUS
				// 权限处理  
				plus.android.requestPermissions(  
					['android.permission.READ_CALL_LOG', 'android.permission.WRITE_CALL_LOG', 'android.permission.READ_SMS'],  
					function(e) {  
						if (e.deniedAlways.length > 0) {  
							//权限被永久拒绝  
							// 弹出提示框解释为何需要定位权限，引导用户打开设置页面开启 
							console.log('Always Denied!!! ' + e.deniedAlways.toString());  
						}  
						if (e.deniedPresent.length > 0) {  
							//权限被临时拒绝  
							// 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限  
							console.log('Present Denied!!! ' + e.deniedPresent.toString());  
						}  
						if (e.granted.length > 0) {  
							//权限被允许  
							//调用依赖获取定位权限的代码  
							console.log('Granted!!! ' + e.granted.toString());  
						}  
					},  
					function(e) {  
						console.log('Request Permissions error:' + JSON.stringify(e));  
					}  
				)
				// 获取通话记录的主体代码 顺序不能够乱
				var CallLog = plus.android.importClass('android.provider.CallLog');
				var Activity = plus.android.runtimeMainActivity();
				var ContentResolver = plus.android.importClass('android.content.ContentResolver');
				var resolver = Activity.getContentResolver();
				plus.android.importClass(resolver);
				var String = plus.android.importClass("java.lang.String");
				
				var cs = resolver.query(CallLog.Calls.CONTENT_URI,null,null,null, CallLog.Calls.DEFAULT_SORT_ORDER);
				plus.android.importClass(cs); 
				
				var count = 0; // 记录多少条 用于处理循环跳出
				
				if(cs.moveToFirst()){
					while (cs.moveToNext()) {
						count++;
						//号码
						var number = cs.getString(cs.getColumnIndex(CallLog.Calls.NUMBER));
						//呼叫类型
						var type;
						switch (parseInt(cs.getString(cs.getColumnIndex(CallLog.Calls.TYPE))))
						// 判断通话类型
						{
							case CallLog.Calls.INCOMING_TYPE:
								type = "呼入";
								break;
							case CallLog.Calls.OUTGOING_TYPE:
								type = "呼出";
								break;
							case CallLog.Calls.MISSED_TYPE:
								type = "未接";
								break;
							default:
								type = "挂断"; 
								break;
						}
						// 获取时间
						var date = new Date(parseInt(
							cs.getString(cs.getColumnIndexOrThrow(CallLog.Calls.DATE))));
						// 联系人
						var Name_Col = cs.getColumnIndexOrThrow(CallLog.Calls.CACHED_NAME);
						var name = cs.getString(Name_Col);
						// 号码归属地 返回：北京 联通
						var numberLocation = cs.getString(
							cs.getColumnIndex(CallLog.Calls.GEOCODED_LOCATION)
						);
						//通话时间,单位:s
						var Duration_Col = cs.getColumnIndexOrThrow(CallLog.Calls.DURATION);
						var duration = cs.getString(Duration_Col);
						
						// 存入数组 
						this.content.push({
							name: name, // 联系人的姓名
							mobile: number, // 联系人电话
							numberLocation: numberLocation, // 号码的归属地
							callTime: this.formatDate(date), // 呼入或呼出时间
							talkTime: duration, // 通话时长
							type: type
						});
						
						if(count > 50){
							break;
						}
					}
				}
				//#endif
			},
			// 毫秒转日期
			formatDate (now) {
			  const date = new Date(now)
			  var y = date.getFullYear() // 年份
			  var m = date.getMonth() + 1 // 月份，注意：js里的月要加1
			  var d = date.getDate() // 日
			  var h = date.getHours() // 小时
			  var min = date.getMinutes() // 分钟
			  var s = date.getSeconds() // 秒
			  return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
			},
			
		}
	}
</script>

<style>
</style>
