//商家模块

const {db} = require('../db.js')

const store = {
	//获取商店信息
	getStoreInfo:async (shopsupplierId)=>{
		const sql = 
			`SELECT
				a.*, 
				b.file_url storePic,
				c.file_url businessPic
			FROM
				jjjshop_supplier a
			LEFT JOIN jjjshop_upload_file b ON a.logo_id = b.file_id
			LEFT JOIN jjjshop_upload_file c ON a.business_id = c.file_id
			WHERE
				a.shop_supplier_id = ?`
		return await db(sql,shopsupplierId)
	},
	
	//提交商店信息
	editStoreInfo:async (storeinfo,imageinfo)=>{
		var keys = [];
		var values = [];
		let sql = 'INSERT INTO jjjshop_supplier (';
		for(var key in storeinfo){
			keys.push(key)
			sql = sql + key + ","
			values.push(storeinfo[key])
		}
		sql = sql + 'business_id,is_full,app_id,create_time,update_time) values (?,73,0,10001,unix_timestamp(),unix_timestamp());'
	// 	let sql1 = 'INSERT INTO jjjshop_upload_file (';
	// 	var keys1 = [];
	// 	var values1 = [];
	// 	for(var key in imageinfo){
	// 		keys.push(key)
	// 		sql = sql + key + ','
	// 		values1.push(imageinfo[key])
	// 	}
	// 	sql = sql + 'shop_supplier_id,app_id,create_time,update_time) VALUES (?,@@identity,10001,unix_timestamp(),unix_timestamp());'+
	// 'go UPDATE jjjshop_supplier SET business_id =@@identity WHERE shop_supplier_id = (SELECT a.id FROM( SELECT MAX(shop_supplier_id) id FROM jjjshop_supplier)a)'
		
	// 	// sql1 = 'update jjjshop_supplier set app_id=10001 where shop_supplier_id=10010'
		
		console.log(sql);
		console.log([values]);
		return await db(sql,[values])
	},
	
	
	//更新商店信息
	updateStoreInfo:async (arr)=>{
		const sql = 'UPDATE jjjshop_supplier SET ?,is_full=0,update_time=unix_timestamp() WHERE shop_supplier_id=?'
		return await db(sql,arr)
	}
}

module.exports = store