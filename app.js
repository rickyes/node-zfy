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
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static(path.join(config.context,'/public')));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
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
app.use(function(req,res,next){
  res.locals.zfy = {
    title: pkg.name,
    description: pkg.description
  };
  next();
});
routes.setRoutes(app);
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
app.use(function(err,req,res,next){
  res.render('error',{
    error: err
  });
});

app.listen(app.get('port'),function(){
  console.log('\033[36mstart server port: \033[31m'+ app.get('port')+'\033[37m');
});
