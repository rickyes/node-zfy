const fs = require('fs')
    , base64Img = require('base64-img')
    , config = require('../config')
    , path = require('path')
    , mysqlUtils = require('../utils/mysqlUtils')
    , vailterUtils = require('../utils/vailterUtils')
    , utils = require('../utils/utils');
exports.medical = (req,res,next) => {
  try{
    let idcard = req.body.idcard;
    let name = req.body.name;
    let sex = req.body.sex;
    let birthtime = req.body.birthtime;
    let nationality = req.body.nationality;
    let address = req.body.address;
    if(idcard == '' || name == '' || sex == '' || birthtime == '' || nationality == '' || address == ''){
      res.json({code:401,result:'上传资料不全！'});
      res.end();
      return;
    }
    let img_path = base64Img.imgSync(req.body.img,path.join(config.context,'public/img/camera'),idcard);
    let idcard_img = base64Img.imgSync(req.body.idcardimg,path.join(config.context,'public/img/idcard'),idcard);
    let tokenTime = utils.getTokenTime();
    let params = [idcard,name,idcard+'.png',sex,birthtime,nationality,address,idcard+'.jpg',tokenTime];
    mysqlUtils.add(params);
    res.json({code:200,result:'上传体检登记资料成功！',physical_number: tokenTime});
  }catch(err){
    res.json({code:401,result:'上传错误！请检查是否拍照'});
  }
  res.end();
}

exports.medicals = (req,res,next) => {
  mysqlUtils.medicals((data)=>{
    res.json(data);
    res.end();
  });
}

exports.findOne = (req,res,next) => {
  let physical_number = req.query.physical_number;
  if(vailterUtils.isEmpty([physical_number])){
    res.json({code:401,result:'体检号为空'});
    res.end();
    return;
  }
  mysqlUtils.find(physical_number,(data)=>{
    res.json({code:200,result:data});
    res.end();
  });
}

exports.setMedicalInfo = (req,res,next)=> {
  let result_info = req.body.result_info;
  let idcard = req.body.idcard;
  if(vailterUtils.isEmpty([result_info,idcard])){
    res.json({code:401,result:'体检号为空'});
    res.end();
    return;
  }
  try {
    mysqlUtils.setMedicalInfo([result_info,idcard]);
    res.json({code:200,result:'提交体检意见成功！'});
  } catch (err) {
    console.log(err);
    res.json({code:401,result:'提交体检意见错误'});
  } finally {
    res.end();
  }
}
