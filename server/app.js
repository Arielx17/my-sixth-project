// const Sequelize = require('sequelize')
const express = require('express');

const course = require('./model/course.js')
const store = require('./model/store.js')
const order = require('./model/order.js')
const user = require('./model/user.js')
const comment = require('./model/comment.js')
const image = require('./model/image.js')

const app = express();
const bodyParser = require('body-parser');

// parse x-www-forn-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

 // parse json
app.use(bodyParser.json()) 

// app.post('/uploadImage',async (req,resp) => {
// 	await image.uploadImage(req.body.)
// 	.then(res => {
// 		resp.send(res)
// 	})
// })

//获取今日数据
app.get('/getToday',async (req,resp)=>{
	await order.getToday(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//同意退款申请
app.get('/agreeApply',async (req,resp)=>{
	await order.agreeApply(req.query.orderId)
	.then(res => {
		resp.send(res)
	})
})

//获取订单
app.get('/getOrder',async (req,resp)=>{
	await order.getOrder(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})
	
//获取七天内每天订单数量
app.get('/getSevenOrders',async (req,resp)=>{
	await order.getSevenOrders(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取30天内每天订单数量
app.get('/getThirtyOrders',async (req,resp)=>{
	await order.getThirtyOrders(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取6个月内每天订单数量
app.get('/getSixmOrders',async (req,resp)=>{
	await order.getSixmOrders(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取七天内每天订单金额
app.get('/getSevenSums',async (req,resp)=>{
	await order.getSevenSums(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取30天内每天订单金额
app.get('/getThirtySums',async (req,resp)=>{
	await order.getThirtySums(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取6个月内每天订单金额
app.get('/getSixmSums',async (req,resp)=>{
	await order.getSixmSums(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取七天内每天顾客数量
app.get('/getSevenMen',async (req,resp)=>{
	await order.getSevenMen(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取30天内每天顾客数量
app.get('/getThirtyMen',async (req,resp)=>{
	await order.getThirtyMen(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取6个月内每天顾客数量
app.get('/getSixmMen',async (req,resp)=>{
	await order.getSixmMen(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})





//判断是否注册
app.get('/isRegister',async (req,resp)=>{
	await user.isRegister(req.query.open_id)
	.then(res => {
		resp.send(res)
	})
})
//注册
app.post('/Register',async (req,resp)=>{
	await user.Register(req.body.userInfo)
	.then(res => {
		resp.send(res)
	})
})
//判断是否已绑定店铺
app.get('/hasStore',async (req,resp)=>{
	await user.hasStore(req.query.userId)
	.then(res => {
		resp.send(res)
	})
})

//获取店铺信息
app.get('/getStoreInfo',async (req,resp)=>{
	await store.getStoreInfo(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})
//提交店铺信息
app.post('/editStoreInfo',async (req,resp)=>{
	await store.editStoreInfo(req.body.storeInfo)
	// await image.uploadImage(req.body.imageInfo)
	// await image.addBusnissid()
	.then(res => {
		resp.send(res)
		console.log("成功了吧",res)
	})
})
//更新店铺信息
app.post('/updateStoreInfo',async (req,resp)=>{
	console.log(req.body.storeInfo)
	console.log(req.body.shopId)
	await store.updateStoreInfo([req.body.storeInfo,req.body.shopId])
	.then(res => {
		resp.send(res)
	})
})

//添加课程
app.post('/addCourse',async (req,resp)=>{
	await course.addCourse([req.body.courseDetail,req.body.id])
	.then(res => {
		resp.send(res)
	})
})

//添加课程图片
app.get('/addCoursePic',async (req,resp)=>{
	await course.addCoursePic(req.query.courseId,req.query.imageId)
	.then(res => {
		resp.send(res)
	})
})

//获取课程列表
app.get('/getCourseList',async (req,resp)=>{
	await course.getAllCourse(req.query.shopId)
	.then(res => {
		resp.send(res)
	})
})

//获取课程信息
app.get('/getCourseDetail',async (req,resp)=>{
	await course.getCourseDetail(req.query.id)
	.then(res => {
		if(res == null){
			console.log("课程信息获取失败")
		}else{
			resp.send(res)
		}
	})
})

//课程状态
app.get('/changeCourseStatus',async (req,resp)=>{
	// console.log([{product_status:req.query.status},req.query.id])
	await course.updateCourse([{product_status:req.query.status},req.query.id])
	.then(res => {
		if(res == null){
			console.log("课程状态编辑失败")
		}else{
			console.log("课程状态编辑成功")
			resp.send(res)
		}
	})
})

//提交课程信息
app.post('/changeCourse',async (req,resp)=>{
	// let courseDetail = JSON.parse(decodeURIComponent(req.query.courseDetail))
	// console.log([courseDetail,req.query.id])
	await course.updateCourse([req.body.courseDetail,req.body.id])
	.then(res => {
		if(res == null){
			console.log("课程编辑失败")
		}else{
			console.log("课程编辑成功")
			resp.send(res)
		}
	})
})

//核销订单
app.get('/WriteoffOrder',async(req,resp)=>{
	await order.WriteoffOrder(req.query.id)
	.then(res =>{
		if(res == null){
			console.log("订单核销失败")
		}else{
			console.log("订单核销成功")
			resp.send(res)
		}
	})
})

//获取所有评价
app.get('/getAllComments',async(req,resp)=>{
	await comment.getAllComments(req.query.shopId)
	.then(res => {
		if(res == null){
			console.log("评价获取失败")
		}else{
			console.log("评价获取成功")
			resp.send(res)
		}
	})
})

//获取评价图片
app.get('/getCommentPic',async(req,resp)=>{
	await comment.getCommentPic(req.query.commentId)
	.then(res => {
		if(res == null){
			console.log("获取失败")
		}else{
			console.log("获取成功")
			resp.send(res)
		}
	})
})

// 设置跨域请求，要在use router 之前
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') 
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (req.method == 'OPTIONS') {
        res.send(200) // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
    } else {
        next()
    }
})

//监听服务端端口
app.listen(8081,()=>{
	console.log("http://localhost:8081")
})
