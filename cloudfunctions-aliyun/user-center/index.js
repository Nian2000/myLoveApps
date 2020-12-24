'use strict';

const uniID = require('uni-id')
const db = uniCloud.database();
const _table='uni-id-users';
exports.main = async (event) => {
	//event为客户端上传的参数
	console.log('event : ' + event)


	let params = event.params
	let res = {}

	let payload = {}

	switch (event.action) {
		case 'get':
			var id=event.id;
			var   collection = db.collection(_table)
			var row = await collection.where({
				_id:id
			}).limit(1).get();
			if(row.data.length<1){
				return {
					error:1,
					message:"数据不存在"
				}
			}
			return {
				error:0,
				data:{
					user:row.data[0]
				},
			};
			break;
		case 'checkToken':
			res = await uniID.checkToken(event.uniIdToken);
			break;
		case 'register':
			res = await uniID.register(event.params);
			break;
		case 'login':
			res = await uniID.login({
				...event.params,
				// 不指定queryField的情况下
				queryField: ['username', 'email', 'mobile']
			});
			break;
		case 'logout':
			res = await uniID.logout(event.uniIdToken);
			break;
		case 'updatePassword':
			payload = await uniID.checkToken(event.uniIdToken)
			console.log('index::payload:', payload);

			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.updatePwd(params);
			break;
		case 'setAvatar':
			payload = await uniID.checkToken(event.uniIdToken)
			console.log('index::payload:', payload);

			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.setAvatar(params);
			break;
		case 'bindMobile':
			payload = await uniID.checkToken(event.uniIdToken)
			console.log('index::payload:', payload);

			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.bindMobile(params);
			break;
		case 'bindEmail':
			payload = await uniID.checkToken(event.uniIdToken)
			console.log('index::payload:', payload);

			if (payload.code && payload.code > 0) {
				return payload
			}
			params.uid = payload.uid

			res = await uniID.bindEmail(params);
			break;
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}

	//返回数据给客户端
	return res
};
