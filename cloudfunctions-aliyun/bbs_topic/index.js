'use strict';
const db = uniCloud.database();
const table='bbs-topic';
const dbCmd = db.command

exports.main = async (event, context) => {
	let params = event.params
	const action=event.cloudAction;
 
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
			var {total} = await collection
				.where({
					status:dbCmd.eq(0).or(dbCmd.eq(1))
				})
				.count()
			return {
				error:0,
				data:{
					list:res.data,
					total:total
				}
			};		 	
			break;
		case "list":
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
			if(params._id!=undefined){
				var _id=params._id;
				delete params._id;
				var userid=params.ssuserid;
				 
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
				var res = await collection.add(params)
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
			return {
				error:0,
				data:"success",
			};
			break;
		case "addView":
			var _id=params.id;
			var collection = db.collection(table)
			var row = await collection.where({
				_id:_id
			}).limit(1).get();
			
			if(row.data.length<1){
				return {
					error:1,
					message:"数据不存在"
				}
			}
			if(row.data[0].view_num==undefined){
				var view_num=1;
			}else{
				var view_num=row.data[0].view_num+1;
			}
			var res = await collection.doc(_id).update({
				view_num:view_num
			})
			return {
				error:0,
				data:"success",
			};
			break;
		case "getListByIds":
			if(params.ids.length==0){
				return {
					error:1,
					message:"无数据"
				}
			}
			var tb=db.collection(table);
			var res = await tb.where({
				_id:dbCmd.in(params.ids)
			}).get();
			return {
				error:0,
				data:res.data
			}
			break;
	}
  
	return event
};
