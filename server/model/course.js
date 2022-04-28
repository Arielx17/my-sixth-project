//课程模块

const {db} = require('../db.js')

const course = {
	//获取课程信息列表
	getAllCourse:async (shopId)=>{
		const sql = 
			`SELECT
				a.*,
				c.file_url coursePic
			FROM
				jjjshop_product a
			LEFT JOIN jjjshop_product_image b ON a.product_id = b.product_id
			LEFT JOIN jjjshop_upload_file c ON b.image_id = c.file_id
			WHERE
				a.shop_supplier_id = ?`
		return await db(sql,shopId)
	},
	
	//根据课程id获取课程信息
	getCourseDetail:async (courseId)=>{
		const sql = `SELECT
				a.*,
				c.file_url coursePic
			FROM
				jjjshop_product a
			LEFT JOIN jjjshop_product_image b ON a.product_id = b.product_id
			LEFT JOIN jjjshop_upload_file c ON b.image_id = c.file_id
			WHERE
				a.product_id = ?`
		return await db(sql,courseId)
	},
	
	//更新课程信息
	updateCourse:async (arr) => {
		const sql = 'UPDATE jjjshop_product SET ? WHERE product_id=?'
		return await db(sql,arr)
	},
	
	//添加课程
	addCourse:async (arr) => {
		console.log(arr)
		console.log(arr[0])
		console.log(arr[1])
		var keys = [];
		var values = [];
		let sql = 'insert into jjjshop_product(';
		for(var key in arr[0]){
			keys.push(key)
			sql = sql + key + ","
			values.push(arr[0][key])
		}
		values.push(arr[1])
		sql = sql + 'shop_supplier_id,app_id,create_time,update_time) values (?,10001,unix_timestamp(),unix_timestamp())'
		
		console.log(sql);
		console.log([values]);
		return await db(sql,[values])
	},
	
	//添加课程图片
	addCoursePic:async (courseId,picId)=>{
		const sql = `INSERT INTO jjjshop_product_image(product_id,image_id,app_id,create_time) VALUES (?,?,10001,unix_timestamp())`
		return await db(sql,[courseId,picId])
	}
}
module.exports = course