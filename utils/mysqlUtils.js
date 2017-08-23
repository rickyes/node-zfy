const mysql = require('mysql')
    , uuid = require('uuid')
    , config = require('../config').dbOption;
var connection = null;
function handleError (err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      console.error(err.stack || err);
    }
  }
}

// 连接数据库
function connect () {
  connection = mysql.createConnection(config);
  connection.connect(handleError);
  connection.on('error', handleError);
}

connect();

exports.add = function(params) {
  if(params == [] || params == null) return;
  var insert_sql = 'insert into zfy_pc(id,idcard,name,img_path,sex,birthtime,nationality,address,idcardimg)'
        +'values("'+uuid.v1()+'",?,?,?,?,?,?,?,?)';
  connection.query(insert_sql,params,function(err,result){
    if(err){
      console.log('insert error'+err.message);
      return;
    }
    return result;
  });
}

exports.medicals = function(cal){
  let sql = 'select * from zfy_pc';
  new Promise((resolve,reject)=>{
    connection.query(sql,function(err,result){
      if(err){
        console.log('list error');
        reject(err);
      }else{
        resolve(result);
      }
    });
  }).then((data)=>{
    cal(data);
  }).catch((err)=>{
    cal(err);
  })
}
