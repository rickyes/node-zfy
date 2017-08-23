const fs = require('fs')
    , base64Img = require('base64-img')
    , config = require('../config')
    , path = require('path')
    , mysqlUtils = require('../utils/mysqlUtils');
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
    console.log(img_path);
    let idcard_img = base64Img.imgSync(req.body.idcardimg,path.join(config.context,'public/img/idcard'),idcard);
    console.log(idcard_img);
    let params = [idcard,name,idcard+'.png',sex,birthtime,nationality,address,idcard+'.jpg'];
    mysqlUtils.add(params);
    res.json({code:200,result:'上传体检登记资料成功！'});
  }catch(err){
    console.log(err);
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
