'use strict';
const db = uniCloud.database();
const tablename="bbs-topic"; 
const dbCmd = db.command
exports.main = async (event, context) => {
  let params = event.params
  const action=event.cloudAction;
  let userid=params.userid;
  switch(action){
	  case "my":
			var collection = db.collection("fav")
			var row = await collection.where({
				userid: userid,
				tablename: tablename
			})
			.orderBy("_id","desc")
			.skip(params.start)
			.limit(params.limit)
			.get();
			if(row.data.length>0){
				var ids=[];
				for(var i in row.data){
					ids.push(row.data[i].objectid);
				}
				var res=await uniCloud.callFunction({
					name:"bbs_topic",
					data:{
						cloudAction:"getListByIds",
						params:{
							ids:ids
						}
					}
				})
				return {
					error:0,
					data:{
						list:res.result.data
					}
				}
			}
		break;
  }
  return event
};
