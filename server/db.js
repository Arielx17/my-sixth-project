const mysql = require('mysql');

const config = {
	database:'class',
	user: 'root',
    password: 'a123',
}

exports.db = (sql,sqlParams)=>{
	return new Promise((resolve,reject)=>{
		const pool = mysql.createPool(config)
		pool.getConnection((err,conn)=>{
			if(!err){
				conn.query(sql,sqlParams,(err,result)=>{
					console.log("err:",err)
					console.log("result:",result)
					if(!err){
						console.log("result",result)
						resolve(result)
						conn.destroy()
					}else{
						// console.log("sql:",err)
						// reject("sql:",err1)
						console.log("sql:",err)
					}
				})
			}else{
				console.log("conn err:",err)
				reject(err)
			}
			
		})
	}).catch((e) => {})
}