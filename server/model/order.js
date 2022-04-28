//评价模块

const {
	db
} = require('../db.js')

const order = {
	//核销订单
	WriteoffOrder: async (orderId) => {
		// const sql1 = 'select order_status from jjjshop_order where order_no=?'
		// let res = await db(sql1,orderId)
		// console.log(res.order_status)
		const sql = 'UPDATE jjjshop_order SET order_status=30 WHERE order_no=?'
		return await db(sql, orderId)
	},
	
	//获取今日数据
	getToday:async (shopId)=>{
		const sql = `select count(*) as orderNum, FORMAT(IFNULL(sum(order_price),0),2) as sum,count(user_id) as menNum
					from jjjshop_order where shop_supplier_id = 10002 and create_time = UNIX_TIMESTAMP(CURDATE())`
		return await db(sql,shopId)
	},
	
	//获取订单
	getOrder:async (shopId)=>{
		// orderStatus 10=>进行中，20=>已经取消，30=>已完成
		// is_agree (0待审核 10已同意 20已拒绝) -1 buz
		// 售后单状态(0进行中 10已拒绝 20已完成 30已取消)
		// '10-1':'订单待核销',
		// '100':'订单待审核',
		// '1010':'已同意取消，退款中',
		// '1020':'已拒绝取消',
		// '20-1':'已取消',
		// '30-1':'订单已完成'
		const sql = `SELECT
			a.order_id,
			a.order_no,
			FORMAT(a.coupon_money,2) payCoupon,
			a.pay_type payType,
			a.order_status orderStatus,
			FROM_UNIXTIME(a.create_time,'%Y-%m-%d %h:%m:%s') create_time,
			b.nickName userName,
			b.avatarUrl userPic,
			c.product_name courseName,
			FORMAT(c.product_price,2) coursePrice,
			c.total_num courseNum,
			FORMAT(c.total_price,2) totalPrice,
			FORMAT(c.total_pay_price,2) payPrice,
			FORMAT(c.supplier_money,2) storeMoney,
			c.is_comment,
			d.file_url picUrl,
			e.apply_desc userReason,
			IFNULL(e.is_agree,-1) is_agree,
			e.refuse_desc storeReason
			
		FROM
			jjjshop_order a
		LEFT JOIN jjjshop_user b ON a.user_id = b.user_id
		LEFT JOIN jjjshop_order_product c ON a.order_id = c.order_id
		LEFT JOIN jjjshop_upload_file d ON c.image_id = d.file_id
		LEFT JOIN jjjshop_order_refund e ON e.order_id = a.order_id
		WHERE a.shop_supplier_id = ?`
		return await db(sql,shopId)
	},
	
	//同意退款申请
	agreeApply: async (orderId) => {
		const sql = `UPDATE jjjshop_order_refund SET is_agree = 10,status = 20 WHERE order_id = ?`
		return await db(sql,orderId)
	},
	

	//获取七天内每天订单数量
	getSevenOrders: async (shopId) => {
		const sql = `select DATE_FORMAT(d.date,'%m-%d') date, IFNULL(T.num,0) val from
			(
				SELECT DATE_SUB(CURDATE(),INTERVAL 6 DAY) AS date UNION ALL
				SELECT DATE_SUB(CURDATE(),INTERVAL 5 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 4 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 3 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 2 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS date UNION ALL
				SELECT CURDATE() AS date
			) d
			left join(
				select FROM_UNIXTIME(create_time, '%Y-%m-%d') as days, count(*) as num 
				from jjjshop_order where shop_supplier_id = ?
				group by days
			) T on T.days = d.date
			GROUP BY d.date, T.num `
		return await db(sql, shopId)
	},
	
	//获取七天内每天顾客数量
	getSevenMen: async (shopId) => {
		const sql = `select DATE_FORMAT(d.date,'%m-%d') date, IFNULL(T.num,0) val from
			(
				SELECT DATE_SUB(CURDATE(),INTERVAL 6 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 5 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 4 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 3 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 2 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS date UNION ALL
				SELECT CURDATE() AS date
			) d
			left join(
				select FROM_UNIXTIME(create_time, '%Y-%m-%d') as days, count(user_id) as num 
				from jjjshop_order where shop_supplier_id = ?
				group by days
			) T on T.days = d.date
			GROUP BY d.date, T.num `
		return await db(sql, shopId)
	},

	//获取七天内每天订单总价
	getSevenSums: async (shopId) => {
		const sql = `select DATE_FORMAT(d.date,'%m-%d') date, FORMAT(IFNULL(T.sum,0),2) val from 
			(
				SELECT DATE_SUB(CURDATE(),INTERVAL 6 DAY) AS date UNION ALL
				SELECT DATE_SUB(CURDATE(),INTERVAL 5 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 4 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 3 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(),INTERVAL 2 DAY) AS date UNION ALL 
				SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS date UNION ALL
				SELECT CURDATE() AS date
			) d
			left join(
				select FROM_UNIXTIME(create_time, '%Y-%m-%d') as days, sum(order_price) as sum 
				from jjjshop_order where shop_supplier_id =? 
				group by days
			) T on T.days = d.date
			GROUP BY d.date, T.sum`
		return await db(sql, shopId)
	},
	

	//获取30天内每天订单总价
	getThirtySums: async (shopId) => {
		const sql = `SELECT DATE_FORMAT(d.dates,'%m-%d') date,FORMAT(IFNULL(T.sum, 0),2) val FROM
			( SELECT @s := @s + 1 AS indexs,DATE_SUB(CURRENT_DATE, INTERVAL @s DAY) AS dates
				FROM mysql.help_topic,(SELECT @s := - 1) temp #不想包含当天，@s:=0
				WHERE @s < 30
				ORDER BY dates
			) d
		LEFT JOIN (
			SELECT FROM_UNIXTIME(create_time, '%Y-%m-%d') AS days,sum(order_price) AS sum
			FROM jjjshop_order
			WHERE shop_supplier_id = ?
			GROUP BY days
		) T ON T.days = d.dates
		GROUP BY d.dates,T.sum`
		return await db(sql, shopId)
	},
	
	//获取30天内每天订单数量
	getThirtyOrders: async (shopId) => {
		const sql = `SELECT DATE_FORMAT(d.dates,'%m-%d') date,IFNULL(T.num, 0) val FROM
			( SELECT @s := @s + 1 AS indexs,DATE_SUB(CURRENT_DATE, INTERVAL @s DAY) AS dates
				FROM mysql.help_topic,(SELECT @s := - 1) temp #不想包含当天，@s:=0
				WHERE @s < 30
				ORDER BY dates
			) d
		LEFT JOIN (
			SELECT FROM_UNIXTIME(create_time, '%Y-%m-%d') AS days,count(*) as num
			FROM jjjshop_order
			WHERE shop_supplier_id = ?
			GROUP BY days
		) T ON T.days = d.dates
		GROUP BY d.dates,T.num`
		return await db(sql, shopId)
	},
	
	//获取30天内每天顾客数量
	getThirtyMen: async (shopId) => {
		const sql = `SELECT DATE_FORMAT(d.dates,'%m-%d') date,IFNULL(T.num, 0) val FROM
			( SELECT @s := @s + 1 AS indexs,DATE_SUB(CURRENT_DATE, INTERVAL @s DAY) AS dates
				FROM mysql.help_topic,(SELECT @s := - 1) temp #不想包含当天，@s:=0
				WHERE @s < 30
				ORDER BY dates
			) d
		LEFT JOIN (
			SELECT FROM_UNIXTIME(create_time, '%Y-%m-%d') AS days,count(user_id) as num
			FROM jjjshop_order
			WHERE shop_supplier_id = ?
			GROUP BY days
		) T ON T.days = d.dates
		GROUP BY d.dates,T.num`
		return await db(sql, shopId)
	},
	
	//获取6个月内每月订单数量
	getSixmOrders: async (shopId) => {
		const sql = `SELECT d.lastDays date,IFNULL(T.num, 0) val FROM
			( SELECT date_format(@lastDay := last_day(date_add(@lastDay, INTERVAL 1 MONTH)),'%Y-%m') lastDays
				FROM
					( SELECT @lastDay := date_add(curdate(), INTERVAL - 6 MONTH)
						FROM mysql.help_topic LIMIT 6
					) a
			) d
		LEFT JOIN (
			SELECT FROM_UNIXTIME(create_time, '%Y-%m') AS months,count(*) AS num
			FROM jjjshop_order WHERE shop_supplier_id = ?
			GROUP BY months
		) T ON T.months = d.lastDays
		GROUP BY d.lastDays,T.num`
		return await db(sql, shopId)
	},
	
	//获取6个月内每月订单总额
	getSixmSums: async (shopId) => {
		const sql = `SELECT d.lastDays date,IFNULL(T.sum, 0) val FROM
			( SELECT date_format(@lastDay := last_day(date_add(@lastDay, INTERVAL 1 MONTH)),'%Y-%m') lastDays
				FROM
					( SELECT @lastDay := date_add(curdate(), INTERVAL - 6 MONTH)
						FROM mysql.help_topic LIMIT 6
					) a
			) d
		LEFT JOIN (
			SELECT FROM_UNIXTIME(create_time, '%Y-%m') AS months,sum(order_price) AS sum
			FROM jjjshop_order WHERE shop_supplier_id = ?
			GROUP BY months
		) T ON T.months = d.lastDays
		GROUP BY d.lastDays,T.sum`
		return await db(sql, shopId)
	},
	
	//获取6个月内每月顾客数量
	getSixmMen: async (shopId) => {
		const sql = `SELECT d.lastDays date,IFNULL(T.num, 0) val FROM
			( SELECT date_format(@lastDay := last_day(date_add(@lastDay, INTERVAL 1 MONTH)),'%Y-%m') lastDays
				FROM
					( SELECT @lastDay := date_add(curdate(), INTERVAL - 6 MONTH)
						FROM mysql.help_topic LIMIT 6
					) a
			) d
		LEFT JOIN (
			SELECT FROM_UNIXTIME(create_time, '%Y-%m') AS months,count(user_id) AS num
			FROM jjjshop_order WHERE shop_supplier_id = ?
			GROUP BY months
		) T ON T.months = d.lastDays
		GROUP BY d.lastDays,T.num`
		return await db(sql, shopId)
	},

}

module.exports = order
