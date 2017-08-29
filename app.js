const express = require('express')
     , app = express()
     , fs = require('fs')
     , bodyParser = require('body-parser')
     , routes = require('./routes')
     , config = require('./config')
     , path = require('path')
     , winston = require('winston')
     , expressWinston = require('express-winston')
     , pkg = require('./package');

app.set('port',config.port);
//设置页面路径
app.set('views',path.join(__dirname,'/views'));
//设置模板引擎
app.set('view engine','ejs');
//设置静态文件托管路径
app.use(express.static(path.join(config.context,'/public')));
//设置请求解析json的大小（解决上传图片base编码大小的问题）
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
//成功访问的日记
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
//设置res变量，页面可以直接访问
app.use(function(req,res,next){
  res.locals.zfy = {
    title: pkg.name,
    description: pkg.description
  };
  next();
});
//接口路由
routes.setRoutes(app);
//错误访问的日记
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));
//自定义访问错误的页面
app.use(function(err,req,res,next){
  res.render('error',{
    error: err
  });
});
//监听3000端口
app.listen(app.get('port'),function(){
  console.log('\033[36mstart server port: \033[31m'+ app.get('port')+'\033[37m');
});
