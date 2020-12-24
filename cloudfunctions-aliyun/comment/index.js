'use strict';
const db = uniCloud.database();
const table='comment';
const dbCmd = db.command
exports.main = async (event, context) => {
	const action=event.cloudAction;
	let params = event.params;
	var objectid = params.objectid;
	var ssuserid = params.ssuserid;
	var tablename = params.tablename;
	
	switch(action){
		case "index":
			var collection = db.collection(table)
			var res = await collection
				.where({
					status:dbCmd.eq(0).or(dbCmd.eq(1))
				})
				.orderBy("_id","desc")
				.skip(params.start)
				.limit(params.limit)
				.get();
			return {
				error:0,
				data:{
					list:res.data
				}
			};		 	
			break;
		case "list":
			var collection = db.collection(table)
		 
			var res = await collection
				.where({
					status:dbCmd.eq(0).or(dbCmd.eq(1)),
					objectid:objectid,
					tablename:tablename
				})
				.orderBy("_id","desc")
				.skip(params.start)
				.limit(params.limit)
				.get();
			var uids=[];
			if(res.data.length>0){
				for(var i in res.data){
					uids.push(res.data[i].userid)
				}
				var uRes = await uniCloud.callFunction({
				    name: "user",
				    data: { 
						cloudAction:"getListByIds",
						params:{
							uids: uids
						}
					}
				})
				console.log("listRes",uids,uRes.result);
			 
				var users=uRes.result.data;
				var us=[];
				for(var i in users){
					us[users[i]._id]=users[i];
				}
				/*
				console.log("uids",uids)
				var tb_user=db.collection("uni-id-users");
				var users = await tb_user.where({
					_id:dbCmd.in(uids)
				}).get();
				console.log("users:",users)
				var us=[];
				for(var i in users.data){
					us[users.data[i]._id]=users.data[i];
				}
				*/
				for(var i in res.data){
					res.data[i].user=us[res.data[i].userid];
				}
			}	
				
			return {
				error:0,
				data:{
					list:res.data
				}
			};
			break;
		case "show":
			var id=params.id;
			var   collection = db.collection(table)
			var res = await collection.where({
				_id:id
			}).limit(1).get();
			//获取作者
			var userid=res.data[0].userid;
			var tb_user=db.collection("uni-id-users");
			var user = await tb_user.where({
				_id:userid
			}).limit(1).get();
			
			return {
				error:0,
				data:{
					data:res.data[0],
					user:user.data[0]
				},
			};
			break;
		case "my":
			var collection = db.collection(table)
			var res = await collection.where({
				userid:params.ssuserid
			})
			.orderBy("_id","desc")
			.skip(params.start)
			.limit(params.limit)
			.get();
			return {
				error:0,
				data:{
					list:res.data
				}
			};			 	
			break;				
		case "add":
			var id=params.id;
			var   collection = db.collection(table)
			var res = await collection.where({
				_id:id
			}).limit(1).get();
			var userid=params.ssuserid;
			delete params.ssuserid;
		 
			if(res.data.length<1){
				return {
					error:1,
					message:"数据不存在"
				}
			}
			if(res.data[0].userid!=userid){
				return {
					error:1,
					message:"您无权限"  
				}
			}
			return {
				error:0,
				data:res,
			};
			break;
		case "save":
			var   collection = db.collection(table)
			if(params.userid==''){
				return {
					error:1,
					message:"用户信息出错"
				}
			}
			if(params._id!=undefined){
				var _id=params._id;
				delete params._id;
				var userid=params.userid;
				var row = await collection.where({
					_id:_id
				}).limit(1).get();
				
				if(row.data.length<1){
					return {
						error:1,
						message:"数据不存在"
					}
				}
				if(row.data[0].userid!=userid){
					return {
						error:1,
						message:"您无权限"  
					}
				}
				var res = await collection.doc(_id).update(params)
			}else{
				var res = await collection.add(params);
				//更新主表
				var pTable = db.collection(tablename);
				var pRow = await pTable.where({
					_id: objectid
				}).limit(1).get();
				console.log(objectid,tablename,pRow)
				var pRes = await pTable.doc(objectid).update({
					comment_num: pRow.data[0].comment_num + 1
				})
				//结束主表
			}
			
			return {
				error:0,
				data:res,
			};
			break;
		case "delete":
			var id=params.id;
			var collection = db.collection(table)
			var res = await collection.doc(id).remove();
			//更新主表
			var pTable = db.collection(tablename);
			var pRow = await pTable.where({
				_id: objectid
			}).limit(1).get();
			
			var pRes = await pTable.doc(objectid).update({
				comment_num: pRow.data[0].comment_num - 1
			})
			//结束主表
			return {
				error:0,
				data:"success",
			};
			break;
		
	}
  
	return event
};
