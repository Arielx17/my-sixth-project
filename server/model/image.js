//存储图片

const {
	db
} = require('../db.js')

const image = {
	uploadImage: async (imageInfo) => {
		var keys = [];
		var values = [];
		let sql = 'INSERT INTO jjjshop_upload_file (';
		for (var key in imageInfo) {
			keys.push(key)
			sql = sql + key + ","
			values.push(imageInfo[key])
		}
		sql = sql +
			'shop_supplier_id,app_id,create_time,update_time) VALUES (?,@@identity,10001,unix_timestamp(),unix_timestamp())'
		return await db(sql, [values])
	},
	addBusnissid: async () => {
		const sql =
			`UPDATE jjjshop_supplier SET business_id = @@identity WHERE shop_supplier_id = (SELECT a.id FROM( SELECT MAX(shop_supplier_id) id FROM jjjshop_supplier)a)`
		return await db(sql)
	}
}

module.exports = image
