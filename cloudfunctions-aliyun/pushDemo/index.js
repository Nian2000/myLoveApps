'use strict';
const push = require('push')
exports.main = async (event, context) => {
	//单推
	// let res = await push("toSingle", {
	// 	"title": "离线时显示的标题",
	// 	"content": "离线时显示的副标题",
	// 	"payload": JSON.stringify({
	// 		"title": "在线时显示的标题",
	// 		"content": "在线时显示的副标题",
	// 		"data":{
	// 			"username":"uni-app",
	// 			"text":"这是透传的数据data的里面的内容"
	// 		}
	// 	}),
	// 	"clientid": 'fc496e1f22c10e630f331320868a8f56'//'ba4762bf2a476bdfd3c06ea9b0bc922e',
	// 	//用户单clientid 来源 plus.push.getClientInfo()  http://www.html5plus.org/doc/zh_cn/push.html#plus.push.getClientInfo
	// })

	// return res
	let params = event;
	//群推	case "push":
	return await push("toApp", {
		"title": params.title,
		"content": params.content,
		"payload": JSON.stringify(params.p)
	})
	// return await push("toApp",{
	// 	"title" : "【群推】测通知栏标题（长度取最小集）限制 32 字",
	// 	"content" : "【群推】31测通知栏内容（长度取最小集）content 长度小于 80 字",
	// 	"payload" : JSON.stringify({data:"【群推】数据"}) 
	// })
};
