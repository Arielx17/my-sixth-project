//评价模块

const {
	db
} = require('../db.js')

const comment = {

	//获取评价列表
	getAllComments: async (shopId) => {
		const sql =
			`SELECT
				a.comment_id,
				a.score,
				a.describe_score,
				a.content,
				a.is_picture,
				b.product_name courseName,
				c.nickName username,
				c.avatarUrl userPic,
				d.file_url coursePic,
				GROUP_CONCAT(f.file_url) commentPic
			FROM
				jjjshop_comment a
			LEFT JOIN jjjshop_order_product b ON a.order_product_id = b.order_product_id
			LEFT JOIN jjjshop_user c ON a.user_id = c.user_id
			LEFT JOIN jjjshop_upload_file d ON d.file_id = b.image_id
			LEFT JOIN jjjshop_comment_image e ON e.comment_id = a.comment_id
			LEFT JOIN jjjshop_upload_file f ON f.file_id = e.image_id
			WHERE
				a.shop_supplier_id = ?
			AND a.is_delete = 0
			AND a.status = 1
			GROUP BY a.comment_id`
		return await db(sql, shopId)
	},
	
	//获取评价图片
	getCommentPic: async (commentId) => {
		const sql = 
			`SELECT
				a.comment_id,
				b.file_name
			FROM
				jjjshop_comment_image a
			LEFT JOIN jjjshop_upload_file b ON b.file_id = a.image_id
			WHERE
				a.comment_id = ?`
		return await db(sql,commentId)
	},

	//更新评价状态为0 (0=待审核 1=审核通过 2=审核不通过)
	updateStatus: async (arr) => {
		const sql = 'UPDATE jjjshop_comment SET status=0 WHERE comment_id=?'
		return await db(sql, arr)
	},
}

module.exports = comment
