'use strict';

const db = uniCloud.database()
const dbCmd = db.command
const _table='fans';

exports.main = async (event, context) => {
	//event为客户端上传的参数
	
	// console.log('event : ', event)
	let params = event.params
	
	switch (event.action) {
		case 'add':
			var collection = db.collection(_table)
			var res = await collection.add(params)
			//返回数据给客户端
			return res
		break;
		case 'get':
			var collection = db.collection(_table)
			var {total} = await collection.where({
				bloggerId:params.bloggerId,
				fansId:params.fansId
			}).count()
			//返回数据给客户端
			return total
		break;
		case 'cancel':
			var collection = db.collection(_table)
			var res = await collection.where({
				bloggerId:params.bloggerId,
				fansId:params.fansId
			}).remove()
			//返回数据给客户端
			return res
		break;
		case 'getfans':
			var collection = db.collection(_table)
			var {total} = await collection.where({
				bloggerId:params.bloggerId,
			}).count()
			//返回数据给客户端
			return total
		break;
		case 'getblogger':
			var collection = db.collection(_table)
			var {total} = await collection.where({
				fansId:params.bloggerId,
			}).count()
			//返回数据给客户端
			return total
		break;
	}	
	
};
