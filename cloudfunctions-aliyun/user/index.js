'use strict';
const db = uniCloud.database();
const _table = 'uni-id-users';
const dbCmd = db.command
exports.main = async (event, context) => {
	const action = event.cloudAction;
	let params = event.params;
	 
	switch (action) {
		case "get":
			var id = event.id;
			var collection = db.collection(_table)
			var row = await collection.where({
				_id: id
			}).limit(1).get();
			if (row.data.length < 1) {
				return {
					error: 1,
					message: "数据不存在"
				}
			}
			return {
				error: 0,
				data: {
					user: row.data[0]
				},
			};
			break;
		case "getListByIds":
		
			if(params.uids.length==0){
				return {
					error:1,
					message:"无数据"
				}
			}
			var tb_user=db.collection("uni-id-users");
			var users = await tb_user.where({
				_id:dbCmd.in(params.uids)
			}).field({
				_id:true,
				nickname:true,
				avatar:true
			}).get();
			return {
				error:0,
				data:users.data
			}
			break;
		default:
			return {
				error:123456
			}
			break;
	}
	return event
};
