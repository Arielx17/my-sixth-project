//util.js文件主要写的是会经常使用到的工具类
//校验邮箱格式
function checkEmail(email){
	return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
}
//校验手机格式
function checkMobile(mobile){
	return RegExp(/^1[34578]\d{9}$/).test(mobile);
}

module.exports = {
	checkEmail : checkEmail,
	checkMobile : checkMobile
}
