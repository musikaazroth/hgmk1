function logisticCalc(daySpan,curveSteep,point){
  curveSteep = (curveSteep/100)*(daySpan)
  var returnVal = 0;
  var varA = (daySpan/1)-1;
  var varB = Math.pow((((daySpan/curveSteep)-1)/varA),(1/(daySpan/2)));
  var varC = 100/(1+varA*Math.pow(varB,point));
  if(varC){
    returnVal = varC;
    if(varC>=100){
      varC = 100;
    }
    if(varC<0){
      varC = 0;
    }
  }
  return returnVal;
}
function maxCalc(arr,grp=null){
  var returnVal = 0;
  if(grp!==null){
    if(typeof(arr)=='object'&&typeof(arr[grp])=='undefined'){
      var obj = arr.map(function(v){ return v[grp] })
      arr = obj
    }
  }
  if(typeof(arr)=='object'&&typeof(arr[0])!='undefined'){
    returnVal = arr.reduce(function(x,v){ return Math.max(x,v) })
  }
  return returnVal;
}
function sumCalc(arr,grp=null){
  var returnVal = 0;
  if(grp!==null){
    if(typeof(arr)=='object'&&typeof(arr[grp])=='undefined'){
      var obj = arr.map(function(v){ return v[grp] })
      arr = obj
    }
  }
  if(typeof(arr)=='object'&&typeof(arr[0])!='undefined'){
    returnVal = arr.reduce(function(x,v){ return x+v })
  }
  return returnVal;
}
