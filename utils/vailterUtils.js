exports.isEmpty = function(objs){
    let isEmp = false;
    objs.forEach(function(item,i){
      if(item == null || item == ''){
        isEmp = true;
        return true;
      }
    });
    return isEmp;
}
