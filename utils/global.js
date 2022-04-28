export default {
    memberObj:{
        // userId:15,//新建店铺
		userId:1,//已通过的店铺
		imgPath:'',
		shopId:10002,
		host:'http://localhost:8081/',
		// https://shop.yaler.cn/uploads/
		// this.userId = this.$global.memberObj.userId
    },
    setMemberObj(data){
        this.memberObj = Object.assign({},this.memberObj,data) 
    }
}