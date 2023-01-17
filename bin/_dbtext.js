/*使用 mongoose 操作 mongodb 的测试文件
1. 连接数据库
1.1. 引入 mongoose
1.2. 连接指定数据库(URL 只有数据库是变化的)
1.3. 获取连接对象
1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的 Model
2.1. 字义 Schema(描述文档结构)
2.2. 定义 Model(与集合对应, 可以操作集合)
3. 通过 Model 或其实例对集合数据进行 CRUD 操作
3.1. 通过 Model 实例的 save()添加数据
3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
3.4. 通过 Model 的 remove()删除匹配的数据
*/
const mongoose = require('mongoose');
const md5=require('blueimp-md5');

mongoose.connect("mongodb://localhost:27017/gzhipin_text2");
const conn = mongoose.connection;
conn.on("connected", () => {
    console.log('链接成功');
})

const userSchema = mongoose.Schema({
    username: { type: "string", required: true },
    password: {type: "string", required: true},
    type: { type: "string", require: true },
    headers: { type: "string" }
})
const UserModel = mongoose.model("users",userSchema);

function text(){
    const userModel=new UserModel({
        username:"王睿霆",
        password:md5('123'),
        type:"laoban",
    })
    userModel.save((err,docs)=>{
        console.log(err,docs);
    })
}

// text()
function textFind(){
    UserModel.findOne({_id:"639ac353b86b20b5afa99e81"},(err,docs)=>{
        console.log(err,docs);
    })
    UserModel.find((_,docs)=>{
        console.log(docs);
    })
}
// textFind()
function textUpdate(){
    UserModel.findByIdAndUpdate({_id:"639ac353b86b20b5afa99e81"},{username:"张珂"},(err,docs)=>{
        console.log(err,docs);
    })
}
// textUpdate()
function textDelete(){
    UserModel.deleteOne({_id:"639ac353b86b20b5afa99e81"},(err,docs)=>{
        console.log(err,docs);
    })
}
textDelete()