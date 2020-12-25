//《多厂商推送透传消息带通知》
'use strict';
const config = require('config');
const {
	appId,
	appkey,
	appSecret,
	mastersecret,
	packageName,
} = config.getui
console.log(config.getui)
const BaseUrl = "https://restapi.getui.com/v2/" + appId
var token, intent, push_message, push_channel;

const msgDb = uniCloud.database().collection('msg');

module.exports = async function(funName, data) {
	token = await getToken();
	//console.log("token",token);
	let {
		title,
		content,
		payload
	} = data;
	
	if(funName == 'toSingle'){
		let {id} = await msgDb.add({
			"isRead":false,
			"timestamp":Date.now(),
			...data
		});
		payload = JSON.parse(payload)
		payload.msgId = id
		payload = JSON.stringify(payload)
	}
	
	intent =
		`intent:#Intent;action=android.intent.action.oppopush;launchFlags=0x14000000;package=${packageName};component=${packageName}/io.dcloud.PandoraEntry;S.UP-OL-SU=true;S.title=${title};S.content=${content};S.payload=${payload};end`;
	push_message = {
		"transmission": payload
	}
	push_channel = {
		"android": {
			"ups": {
				"notification": {
					title,
					"body": content,
					"channel_level": 3,
					"click_type": "intent",
					intent,
					"options": [{
						"constraint": "HW",
						"key": "/message/android/notification/badge/class",
						"value": "io.dcloud.PandoraEntry"
					}, {
						"constraint": "HW",
						"key": "/message/android/notification/badge/add_num",
						"value": 1
					},
					/*{
						"constraint": "HW",
						"key": "/message/android/notification/badge/set_num",
						"value": 2
					}*/]
				}
			}
		},
		"ios": {
			"type": "notify",
			payload,
			"aps": {
				"alert": {
					"title": title,
					"body": content
				},
				"content-available": 0,
				"sound": "pushsound.caf"
			},
			"auto_badge": "+1",
		}
	}
	//消息发送完
	let pushRes = await eval(`${funName}`)(data);
	return pushRes
};


async function toApp(data) { //注：此接口频次限制100次/天，每分钟不能超过5次(推送限制和接口根据条件筛选用户推送共享限制)
	const requestData = {
		request_id: "uni" + Date.now() + "push",
		audience: "all",
		push_message,
		push_channel,
		...data
	}
	let res = await post('/push/all', requestData)
	return res.data;
}
async function toSingle(data) {
	const clientid = data.clientid
	delete data.clientid
	const requestData = {
		request_id: "uni" + Date.now() + Math.ceil(Math.random() * 10000000) + "push",
		audience: {
			"cid": [clientid]
		},
		push_message,
		push_channel,
		...data
	}
	let {
		data: pushRes
	} = await post('/push/single/cid', requestData)
	//console.log('requestData', JSON.stringify(requestData));
	if (pushRes.msg == 'success') {
		pushRes.state = pushRes.data[Object.keys(pushRes.data)[0]][clientid]
	}
	return pushRes;
}
async function getToken() {
	const timestamp = Date.now();
	let sign = require('crypto').createHash('sha256')
		.update(appkey + timestamp + mastersecret)
		.digest('hex'); //hex是十六进制
	let res = await uniCloud.httpclient.request(BaseUrl + '/auth', {
		method: 'POST',
		contentType: 'json',
		dataType: 'json',
		data: {
			sign,
			timestamp,
			appkey
		},
	})
	let {
		msg
	} = res.data;
	if (msg == 'success') {
		return res.data.data.token;
	} else {
		console.log('错误请检查，err:' + JSON.stringify(res.data));
		return false
	}
}
async function post(module, requestData) {
	return await uniCloud.httpclient.request(BaseUrl + module, {
		method: 'POST',
		headers: {
			"content-type": "application/json",
			"token": token,
			"cache-control": "no-cache"
		},
		contentType: 'json',
		dataType: "json",
		data: requestData,
	})
}
