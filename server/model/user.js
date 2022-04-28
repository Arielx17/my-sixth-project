//课程模块

const {
	db
} = require('../db.js')


const user = {
	// //获取课程信息列表
	// getAllCourse:async ()=>{
	// 	const sql = 'select * from jjjshop_user'
	// 	return await db(sql,null)
	// },

	//根据用户openid判断是否已注册
	isRegister: async (openId) => {
		const sql = 'select * from jjjshop_user where open_id=?'
		return await db(sql, openId)
	},

	//注册
	Register: async (userinfo) => {
		var keys = [];
		var values = [];
		let sql = 'insert into jjjshop_user(';
		for (var key in userinfo) {
			keys.push(key)
			sql = sql + key + ","
			values.push(userinfo[key])
		}
		sql = sql + 'create_time,update_time) values (?,unix_timestamp(),unix_timestamp())'

		console.log(sql);
		console.log([values]);
		return await db(sql, [values])
	},
	
	//根据userId判断是否已绑定店铺
	hasStore: async (userId) => {
		const sql = 'select * from jjjshop_supplier where user_id=?'
		return await db(sql, userId)
	},
	
	//创建提交店铺
	createStore: async (userId) => {
		let sql = 'insert into jjjshop_supplier(';
		for (var key in storeInfo) {
			keys.push(key)
			sql = sql + key + ","
			values.push(storeInfo[key])
		}
		sql = sql + 'is_full,create_time,update_time) values (?,0,unix_timestamp(),unix_timestamp())'
	
		console.log(sql);
		console.log([values]);
		return await db(sql, [values])
	},
	
	//获取店铺信息 && 判断店铺状态（未审核0/已通过1/未通过2）
	getStoreInfo: async (shopId) => {
		const sql = 'select * from jjjshop_supplier where shop_supplier_id=?'
		return await db(sql, shopId)
	},
	

	//更新店铺信息
	updateStore:async (arr) => {
		const sql = 'UPDATE jjjshop_supplier SET ? WHERE shop_supplier_id=?'
		return await db(sql,arr)
	},
}

module.exports = user
