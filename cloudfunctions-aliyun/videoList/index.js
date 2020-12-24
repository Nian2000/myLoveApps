'use strict';

const db = uniCloud.database()
const dbCmd = db.command
const _table='videoList';

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
			var res = await collection
				.where({
					status:dbCmd.eq(1)
				})
				.orderBy("_id","desc")
				.skip(params.start)
				.limit(params.limit)
				.get()
			var {total} = await collection
				.where({
					status:dbCmd.eq(1)
				})
				.count()
			return {
				error:0,
				data:{
					list:res.data,
					total:total
				}
			}
			break;
			
	}	
};
