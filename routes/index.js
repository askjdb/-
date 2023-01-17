var express = require('express');
const md5=require('blueimp-md5')
const {userModel}=require("../bin/model")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册接口
router.post("/register",function(req, res){
  const {username,password,type}=req.body;
  userModel.findOne({username},(_,docs)=>{
    if(docs){
      res.send({code:1,msg:"用户已存在"})
    }
    else {
      new userModel({username,type,password:md5(password)}).save((_,docs)=>{
        res.cookie("users",docs._id,{maxAge:1000*60*60*24})
        const data={username,type,_id:docs._id}
        res.send({code:0,data})
      })
    }
  })
})


//登录接口
router.post("/login",(req, res)=>{
  const {username,password}=req.body;
  userModel.findOne({username,password:md5(password)},{password:0},(_,docs)=>{
    if(docs){
      res.cookie("users",docs._id,{maxAge:1000*60*60*24})
      res.send({code:0,data:docs})
    }
    else{
      res.send({code:1,msg:"用户名或密码错误"})
    }
  })
})

//数据更新接口
router.post("/update",(req,res)=>{
  const id=req.cookies.users;
  if (!id){
    return res.send({code:1,msg:"用户未登录"})
  }
  else{
    const user=req.body;
    userModel.findByIdAndUpdate({_id:id},user,(_,oldData)=>{
      if(!oldData){
        res.clearCookie("users")
        res.send({code:1,msg:"用户未登录"})
      }
      else{
        const {_id,username,type}=oldData
        const data=Object.assign(user,{_id,username,type})
        res.send({code:0,data})
      }
    })
  }
})

//请求用户数据
router.get('/user',(req,res)=>{
  const id=req.cookies.users;
  if (!id){
    return res.send({code:1,msg:"用户未登录"})
  }
  else{
    userModel.findOne({_id:id},{password:0},(_,data)=>{
      if(!data){
        res.clearCookie("users")
        res.send({code:1,msg:"用户未登录"})
      }
      else{
        res.send({code:0,data})
      }
    })  
  }
})
module.exports = router;
