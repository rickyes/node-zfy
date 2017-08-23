const express = require('express')
     , app = express()
     , fs = require('fs')
     , bodyParser = require('body-parser')
     , routes = require('./routes')
     , config = require('./config')
     , path = require('path');

app.set('port',config.port);
app.use(express.static(path.join(config.context,'/public')));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
routes.setRoutes(app);

app.listen(app.get('port'),function(){
  console.log('\033[36mstart server port: \033[31m'+ app.get('port')+'\033[37m');
});
