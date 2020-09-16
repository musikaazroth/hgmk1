function cstr(str){
  var res = str
  if(typeof(str)=='string'){
    res = str.replace(/[\,\.\[\]\: ]/g,"")
  }
  return res
}
function seqGen(pos,n,m,obj,arr=null,join="",fx=null){
  var defobj = {
    sfx:"",
    pfx:"",
    sfxarr:new Array(),
    pfxarr:new Array()
  }
  if(fx===null){
    fx=defobj
  }else{
    $.each(defobj,function(kfc,vfc){
      if(typeof(fx[kfc])=='undefined'){
        fx[kfc] = vfc
      }
    })
  }

  var keyarr = new Array();
  var temparr = new Array();
  if(typeof(arr)=='number'){
    var temparr = obj.slice(arr);
  }
  for(var i=n;i<(pos+m);i++){
    var fpx = fx.pfx
    var fsx = fx.sfx
    if(fx.pfxarr.length>0&&fx.pfx.includes('@')){
      fpx = fx.pfx.replace('@',fx.pfxarr[i])
    }
    if(fx.sfxarr.length>0&&fx.sfx.includes('@')){
      fsx = fx.sfx.replace('@',fx.sfxarr[i])
    }
    if(arr===null){
      keyarr.push(fpx+obj+fsx)
    }else{
      if(temparr.length>0){
        keyarr.push(fpx+cstr(temparr[i])+fsx)
      }else{
        keyarr.push(fpx+cstr(obj[arr[i]])+fsx)
      }
    }
  }
  var result = keyarr.join(join)
  return result;
}
function nestedGen(tbody,valX,levelarr,dataarr,prefixarr,suffixarr,globalarr){
  $.each(levelarr,function(kz,vz){
    var classX = 'clickable';
    var after = true;
    var behaviour = true;
    var afterAttr = levelarr[(kz+1)];
    var notAttr = '';
    var calcthis = true;
    var calcglobal = false;
    if(kz==0){
      calcthis = false;
      classX += ' retain'
      after = false;
      if(kz+2<=levelarr.length-1){
        notAttr = ':not([key'+levelarr[kz+2]+'])'
      }
    }else if(kz>0&&kz<levelarr.length-1){
      if(kz+2<=levelarr.length-1){
        notAttr = ':not([key'+levelarr[kz+2]+'])'
      }
    }else{
      if(kz==levelarr.length-1){
        calcglobal = true;
        behaviour = false;
        afterAttr = '';
        classX = '';
      }
    }
    if($("#key_"+seqGen(kz,0,1,valX,levelarr,"_")).length==0){
      var htm1A = seqGen(kz,0,0,"<td></td>");
      var htm1B = '<td colspan="'+(levelarr.length)+'">'+(prefixarr.length>0?prefixarr[kz]:'')+valX[dataarr[kz]]+(suffixarr.length>0?suffixarr[kz]:'')+'</td>'
      var htm1C = seqGen(((levelarr.length-1)-kz),0,0,levelarr,(kz+1),"",{pfx:'<td class="sum key',sfx:'">0</td>'});
      var htm1D = "";
      $.each(globalarr,function(kgb,vgb){
        htm1D += '<td class="sumG key'+vgb+'">0</td>';
      })
      var htm0 = `<tr class="`+classX+`" id="key_`+seqGen(kz,0,1,valX,levelarr,"_")+`" `
          htm0 += seqGen(kz,0,1,valX,levelarr," ",{pfx:'key@="',sfx:'"',pfxarr:levelarr})+`>`+htm1A+htm1B+htm1C+htm1D+`</tr>`
      if(after){
        $(tbody+" #key_"+seqGen((kz-1),0,1,valX,levelarr,"_")).after(htm0)
      }else{
        $(tbody).append(htm0)
      }
      if(behaviour){
        var selA = seqGen(kz,0,1,valX,levelarr,"",{pfx:"[key@='",sfx:"']",pfxarr:levelarr})+'[key'+afterAttr+']'
        var selB = selA+notAttr
        $(tbody+" #key_"+seqGen(kz,0,1,valX,levelarr,"_")).click(function(){
          if($(tbody+' tr'+selB+':visible').length==0){
            $(tbody+' tr'+selB).show();
          }else{
            $(tbody+' tr'+selA).hide();
          }
        })
      }
      if(calcthis){
        for(var i=0;i<=kz;i++){
          $(tbody+" #key_"+seqGen(i,0,0,valX,levelarr,"_")+' .sum.key'+vz).html(
            parseInt($(tbody+" #key_"+seqGen(i,0,0,valX,levelarr,"_")+' .sum.key'+vz).html())+1
          )
        }
      }
    }
    if(calcglobal){
      for(var i=0;i<=kz;i++){
      $.each(globalarr,function(kgb,vgb){
        $(tbody+" #key_"+seqGen(i,0,1,valX,levelarr,"_")+' .sumG.key'+vgb).html(
          parseFloat($(tbody+" #key_"+seqGen(i,0,1,valX,levelarr,"_")+' .sumG.key'+vgb).html())+parseFloat(valX[vgb])
        )
      })
      }
    }
  })
}
function hideall(slc){
  $('#tab_'+slc+' tbody tr:not(.retain)').hide()
}
function showall(slc){
  $('#tab_'+slc+' tbody tr:not(.retain)').show()
}
