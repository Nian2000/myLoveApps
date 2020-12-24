'use strict';
const db = uniCloud.database();
const table = 'love';
const dbCmd = db.command
exports.main = async (event, context) => {
	const action = event.cloudAction;
	let params = event.params
	switch (action) {
		case "get":
			var objectid = params.objectid;
			var ssuserid = params.ssuserid;
			var tablename = params.tablename;
			var collection = db.collection(table)
			var row = await collection.where({
				objectid: objectid,
				userid: ssuserid,
				tablename: tablename
			}).limit(1).get();
			if (row.data.length > 0) {
				return {
					error:0,
					data:1
				}
			}else{
				return {
					error:0,
					data:0
				}
			}	
			break;
		case "toggle":
			var objectid = params.objectid;
			var ssuserid = params.ssuserid;
			var tablename = params.tablename;
			var collection = db.collection(table)
			var row = await collection.where({
				objectid: objectid,
				userid: ssuserid,
				tablename: tablename
			}).limit(1).get();
			if (row.data.length > 0) {
				var res = await collection.doc(row.data[0]._id).remove();
				//更新主表
				var pTable = db.collection(tablename);
				var pRow = await pTable.where({
					_id: objectid
				}).limit(1).get();

				var pRes = await pTable.doc(objectid).update({
					love_num: pRow.data[0].love_num - 1
				})
				//结束主表
				return {
					error: 0,
					data: {
						"action": "delete"
					}
				}
			} else {
				var res = await collection.add({
					objectid: objectid,
					userid: ssuserid,
					tablename: tablename
				})
				//更新主表
				var pTable = db.collection(tablename);
				var pRow = await pTable.where({
					_id: objectid
				}).limit(1).get();

				var pRes = await pTable.doc(objectid).update({
					love_num: pRow.data[0].love_num + 1
				})
				//结束主表
				return {
					error: 0,
					data: {
						"action": "add"
					}
				}
			}
			break;
	}
	return event
};
