function esriplugin(Gmap,Etoken,callback){
  if(typeof(Gmap)=='undefined'){
    callback(false);
  }
  Gmap.EsriVar = new Object();
  Gmap.EsriVar.debug = false;
  Gmap.EsriVar.ready = true;
  Gmap.EsriVar.esribounds
  Gmap.EsriVar.vectors = new Object();
  Gmap.EsriVar.vectorIDs = new Object();
  Gmap.EsriVar.rasters = new Object();
  Gmap.EsriVar.esriRAM = new Object();
  Gmap.EsriVar.esriInit = false;
  Gmap.EsriVar.rasterconfig = new Object();
  Gmap.EsriVar.rasterlegend = new Object();
  Gmap.EsriVar.vectorconfig = new Object();
  Gmap.EsriVar.iconpath = null;
  Gmap.EsriVar.geocoder = null;
  Gmap.EsriVar.defStyle = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      zIndex:1
  }
  Gmap.EsriVar.esritoken = Etoken;
  Gmap.EsriVar.identifylayers = new Array();
  if(typeof(Gmap.getZoom)=='function'){
    Gmap.EsriVar.Mzoom = Gmap.getZoom();
    setTimeout(function(){
      Gmap.EsriVar.esribounds = GCtoEC(Gmap)
      Gmap.__proto__.getvector = getvector
      Gmap.__proto__.getraster = getraster
      Gmap.__proto__.clearvector = clearvector
      Gmap.__proto__.clearraster = clearraster
      Gmap.__proto__.identify = identify
      Gmap.__proto__.createIdentify = createIdentify
      Gmap.__proto__.spatialQuerySeq = spatialQuerySeq
      Gmap.__proto__.spatialQueryPar = spatialQueryPar
      Gmap.__proto__.createvector = createvector
      Gmap.__proto__.deletevector = deletevector
      Gmap.__proto__.editvector = editvector
      Gmap.__proto__.EisExist = EisExist
      Gmap.__proto__.customControllers = customControllers
      Gmap.__proto__.fitPolygon = fitPolygon
      Gmap.__proto__.reveseGeocode = reverseGeocode
      Gmap.__proto__.readData = readData
      if(typeof(callback)=='function'){
        callback(Gmap.EsriVar)
      }
    },500)
    Gmap.addListener('bounds_changed', function() {
      Gmap.EsriVar.Mzoom = Gmap.getZoom();
      Gmap.EsriVar.esribounds = GCtoEC(Gmap);
      if(Gmap.EsriVar.esriInit){
        $.each(Gmap.EsriVar.esriRAM,function(k,v){
          Gmap.EsriVar.esriRAM[k] = false;
        })
      }
    });
    var Dnex = 95;
    var Dney = 6;
    var Dswx = 141.75;
    var Dswy = -11.134;
    Gmap.EsriVar.eventlistenerDOM = new google.maps.Polygon({
          path: [
            {lat: Dney, lng: Dnex},
            {lat: Dney, lng: Dswx},
            {lat: Dswy, lng: Dswx},
            {lat: Dswy, lng: Dnex},
            {lat: Dney, lng: Dnex}
          ],
          strokeColor: '#FF0000',
          strokeOpacity: 0,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0,
          zIndex:9999,
          map:Gmap
    })
  }else{
    Gmap.createvector = createvector
    Gmap.deletevector = deletevector
    Gmap.editvector = editvector
    Gmap.spatialQuerySeq = spatialQuerySeq
    Gmap.spatialQueryPar = spatialQueryPar
    Gmap.readData = readData
    Gmap.EisExist = EisExist
    Gmap.EsriVar.esriInit = true
    if(Gmap.EsriVar.esriInit){
      $.each(Gmap.EsriVar.esriRAM,function(k,v){
        Gmap.EsriVar.esriRAM[k] = false;
      })
    }
    if(typeof(callback)=='function'){
      callback(Gmap.EsriVar)
    }
  }
}
function checkparam(objfc,mandatory,defobjfc){
  if(mandatory==null){
    mandatory = new Array();
  }
  if(defobjfc==null){
    defobjfc = new Object();
  }
  if(typeof(mandatory)=='string'||$.isNumeric(mandatory)){
    mandatory = new Array(mandatory);
  }
  if(typeof(mandatory)!='array'&&typeof(mandatory)!='object'){
    return false;
  }
  if(typeof(objfc)!='array'&&typeof(objfc)!='object'){
    return false;
  }
  if(typeof(defobjfc)!='array'&&typeof(defobjfc)!='object'){
    return false;
  }
  var returnnow = false;
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      returnnow = true
    }
  })
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        returnnow = true
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  if(returnnow){
    return false;
  }
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  return objfc;
}
var reverseGeocode = function reverseGeocode(objfc,callback){
  var Gmap = this;
  objfc = checkparam(objfc,'latlng',null)
  if(!objfc){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  if(Gmap.EsriVar.geocoder==null){
    Gmap.EsriVar.geocoder = new google.maps.Geocoder;
  }
  var latlng = objfc.latlng
  Gmap.EsriVar.geocoder.geocode({location:latlng},function(result,status){
    if(status==="OK"){
      if(result.length>0){
        if(typeof(callback)=='function'){
          callback(result[0])
        }
      }else{
        if(typeof(callback)=='function'){
          callback(false)
        }
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
        return
      }
    }else{
      return false;
    }
  })
}
//sample,fc=null,pos='BOTTOM_RIGHT'
var customControllers = function customControllers(objfc,callback){
  var Gmap = this;
  var mandatory = ['sample']
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var defobjfc = {
    fc:null,
    pos:'BOTTOM_RIGHT'
  }
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true
    }
  })
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(Fcexit){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  var sample = objfc.sample
  var sampleID = objfc.sample;
  var fc = objfc.fc
  var pos = objfc.pos
  var controlDiv = document.createElement('div');
  var controlUI = document.createElement('div');
  if($('#'+sample).length==0){
    return;
  }
  sample = $(setColorCSS($('#'+sample)))[0]
  if(pos.indexOf('BOTTOM')!==false){
    controlUI.style.paddingBottom = "20px";
  }
  if(pos.indexOf('TOP')!==false){
    controlUI.style.paddingTop = "10px";
  }
  if(pos.indexOf('LEFT')!==false){
    controlUI.style.paddingLeft = "10px";
  }
  if(pos.indexOf('RIGHT')!==false){
    controlUI.style.paddingRight = "20px";
  }
  if(typeof(objfc.paddingTop)!='undefined'){
    controlUI.style.paddingTop = objfc.paddingTop;
  }
  if(typeof(objfc.paddingRight)!='undefined'){
    controlUI.style.paddingRight = objfc.paddingRight;
  }
  if(typeof(objfc.paddingBottom)!='undefined'){
    controlUI.style.paddingBottom = objfc.paddingBottom;
  }
  if(typeof(objfc.paddingLeft)!='undefined'){
    controlUI.style.paddingLeft = objfc.paddingLeft;
  }
  var controlIn = document.createElement('div');
  setCSS(sample,controlIn)
  controlIn.innerHTML = sample.innerHTML
  controlIn.id = sampleID
  var sampleclasslist = sample.className.split(/\s+/);
  $.each(sampleclasslist,function(k,v){
    controlIn.classList.add(v)
  })
  var attrexcl = ['id','style','class']
  $.each(sample.attributes,function(k,v){
    if(!attrexcl.includes(v.name)){
      controlIn.setAttribute(v.name,sample.getAttribute(v.name))
    }
  })
  controlUI.appendChild(controlIn);
  controlDiv.appendChild(controlUI);
  if(fc!=null&&typeof(fc)=='function'){
    controlUI.addEventListener('click', function() {
      fc()
    });
  }
  controlDiv.index = 1;
  $(sample).remove()
  Gmap.controls[google.maps.ControlPosition[pos]].push(controlDiv);
  if(typeof(callback)=='function'){
    var controlsInterval = setInterval(function(){
      if(typeof($('#'+sampleID).length)!='undefined'){
        if($('#'+sampleID).length>0){
          clearInterval(controlsInterval)
          callback();
        }
      }
    },500)
  }
}
function setColorCSS(element){
  if($(element).css('color')){
    $(element).css('-webkit-text-fill-color',$(element).css('color'));
  }
  var newelement = element
  if($(element).children().length>0){
    $(element).children().each(function(k,v){
      var tobeappend = $(setColorCSS($(v)))
      $(newelement).append(tobeappend)
    })
  }
  return newelement;
}
function setCSS(getelem,applyelemto){
  var result = false;
  var styleNode = new Array();
  if(typeof(document.defaultView.getComputedStyle)=='function'){
    var getstyle = document.defaultView.getComputedStyle(getelem, '');
    var applystyle = applyelemto.style
    for(prop in applystyle){
      if(applystyle.hasOwnProperty(prop)){
        applyelemto.style[prop] = getstyle[prop]
      }
    }
    applyelemto.style['WebkitTextFillColor'] = $(getelem).css('color')
  }
}
var GCtoJC = function(instance) {
  var type = null
  var JC = null
  var polyopt = true
  if(typeof(instance.getBounds)=='function'||(typeof(instance.north)!=='undefined'&&typeof(instance.east)!='undefined')){
    type = 'bounds'
  }
  if(typeof(instance.getPosition)=='function'||typeof(instance.latLng)=='object'){
    type = 'point'
  }
  if(typeof(instance.getPath)=='function'||typeof(instance.paths)!='undefined'){
    type = 'polyline'
    if(typeof(instance.paths)!='undefined'){
      if(JSON.stringify(instance.paths[0])==JSON.stringify(instance.paths[instance.paths.length-1])){
        type = null
      }else{
        polyopt = false
      }
    }
  }
  if(typeof(instance.getPaths)=='function'||typeof(instance.paths)!='undefined'){
    type = 'polygon'
    if(typeof(instance.paths)!='undefined'){
      if(JSON.stringify(instance.paths[0])!=JSON.stringify(instance.paths[instance.paths.length-1])){
        type = null
      }else{
        polyopt = false
      }
    }else{
      if(typeof(instance.getPaths().getAt(0))=='object'){
        var objpath = instance.getPaths().getAt(0)
        var objpathl = objpath.getLength()
        if(typeof(objpath.getAt(0))=='object'){
          if(JSON.stringify(objpath.getAt(0))!=JSON.stringify(objpath.getAt(objpath.getLength()-1))&&objpath.getLength()<=3){
            type = null
          }else{
            polyopt = false;
          }
        }
      }
    }
  }
  if(typeof(jsts)=='object'){
    if(typeof(jsts.geom.GeometryFactory)=='function'&&type!=null){
      JC = new Array();
      switch(type){
        case 'polygon':
          if(polyopt){
            carr = instance.getPaths()
            carr.forEach(function(v){
              v.forEach(function(vl){
                var tmp = new Array();
                tmp.push(new jsts.geom.Coordinate(vl.toJSON().lng,vl.toJSON().lat));
                JC.push(tmp)
              })
            })
          }else{
            if(typeof(instance.paths)=='object'){
              carr = instance.paths
              $.each(carr,function(k,v){
                var tmp = new jsts.geom.Coordinate(v.lng,v.lat)
                JC.push(tmp)
              })
            }else{
              carr = instance.getPaths()
              carr.forEach(function(v){
                v.forEach(function(vl){
                  var tmp = new Array();
                  JC.push(new jsts.geom.Coordinate(vl.toJSON().lng,vl.toJSON().lat));
                })
              })
            }
          }
          break;
      }
      return JC
    }else{
      return false
    }
  }else{
    return false
  }
};
var JStoGC = function(geometry) {
  var coordArray = geometry.getCoordinates();
  GMcoords = [];
  for (var i = 0; i < coordArray.length; i++) {
    GMcoords.push({lng:coordArray[i].x, lat:coordArray[i].y});
  }
  return GMcoords;
}
function GCtoEC(instance){
  var type = null
  var EC = null
  var polyopt = true;
  if(typeof(instance.getBounds)=='function'||(typeof(instance.north)!=='undefined'&&typeof(instance.east)!='undefined')){
    type = 'bounds'
  }
  if(typeof(instance.getPosition)=='function'||typeof(instance.latLng)=='object'||typeof(instance.coords)=='object'||typeof(instance.lat)=='function'||typeof(instance.lat)!='undefined'){
    type = 'point'
  }
  if(typeof(instance.getPath)=='function'||typeof(instance.paths)!='undefined'){
    type = 'polyline'
    if(typeof(instance.paths)!='undefined'){
      if(JSON.stringify(instance.paths[0])==JSON.stringify(instance.paths[instance.paths.length-1])){
        type = null
      }else{
        polyopt = false
      }
    }
  }
  if(typeof(instance.getPaths)=='function'||typeof(instance.paths)!='undefined'){
    type = 'polygon'
    if(typeof(instance.paths)!='undefined'){
      if(JSON.stringify(instance.paths[0])!=JSON.stringify(instance.paths[instance.paths.length-1])){
        type = null
      }else{
        polyopt = false
      }
    }
  }
  switch(type){
    case 'bounds':
      if(typeof(instance.getBounds)=='function'){
        var carr = instance.getBounds().toJSON();
      }else{
        var carr = instance
      }
      if(typeof(carr.north)!='undefined'){
        var Xs = [carr.west,carr.east];
        var Ys = [carr.south,carr.north];
        EC = {xmin:Math.min(...Xs),ymin:Math.min(...Ys),xmax:Math.max(...Xs),ymax:Math.max(...Ys)}
      }
      break;
    case 'point':
      if(typeof(instance.getPosition)=='function'){
        var carr = instance.getPosition().toJSON();
      }
      if(typeof(instance.latLng)=='object'){
        var carr = instance.latLng.toJSON();
      }
      if(typeof(instance.coords)!='undefined'){
        var carr = {lat:instance.coords.latitude,lng:instance.coords.longitude}
      }
      if(typeof(instance.lat)=='function'){
        var carr = instance.toJSON();
      }else{
        if(typeof(instance.lat)!='undefined'){
          var carr = instance
        }
      }
      if(typeof(carr.lat)!='undefined'){
        EC = {x:carr.lng,y:carr.lat}
      }
      break;
    case 'polyline':
      var carr = null
      EC = new Object()
      EC.paths = new Array(1);
      EC.paths[0] = new Array();
      if(polyopt){
        carr = instance.getPath()
        carr.forEach(function(v){
          var tmp = new Array();
          tmp.push(v.toJSON().lng,v.toJSON().lat);
          EC.paths[0].push(tmp)
        })
      }else{
        carr = instance.paths
        $.each(carr,function(k,v){
          var tmp = new Array(v.lng,v.lat)
          EC.rings[0].push(tmp)
        })
      }
      break;
    case 'polygon':
      EC = new Object()
      EC.rings = new Array(1);
      EC.rings[0] = new Array();
      if(polyopt){
        carr = instance.getPaths()
        carr.forEach(function(v){
          v.forEach(function(vl){
            var tmp = new Array();
            tmp.push(vl.toJSON().lng,vl.toJSON().lat);
            EC.rings[0].push(tmp)
          })
        })
      }else{
        carr = instance.paths
        $.each(carr,function(k,v){
          var tmp = new Array(v.lng,v.lat)
          EC.rings[0].push(tmp)
        })
      }
      break;
  }
  return EC;
}
function ECtoGC(arr){
  var type = 'polys';
  var GC = null;
  if(typeof(arr.xmin)!='undefined'){
    if($.isNumeric(arr.xmin)){
      type = 'bounds'
    }
  }
  if(typeof(arr.x)!='undefined'){
    if($.isNumeric(arr.x)){
      type = 'point'
    }
  }
  switch(type){
    case 'bounds':
      GC = {north:arr.ymax,south:arr.ymin,east:arr.xmax,west:arr.xmin}
      break;
    case 'point':
      GC = {lat:arr.y,lng:arr.x}
      break;
    case 'polys':
      GC = new Array();
        $.each(arr,function(k,v){
          //console.log(v)
          var tmp = new Object();
          tmp.lat = v[1];
          tmp.lng = v[0];
          if($.isNumeric(v[0])&&$.isNumeric(v[1])){
            GC.push(tmp);
          }
        })
      break;
  }
  return GC;
}
var fitPolygon = function fitPolygon(instance){
  var Gmap = this;
  var boundingfit = new google.maps.LatLngBounds();
  instance.getPaths().forEach(function(v){
    v.forEach(function(vl){
      boundingfit.extend(vl);
    })
  })
  Gmap.fitBounds(boundingfit);
}
function drawCircle(point, rds){
	var dir = 1;
	var radius = rds/1609.344;
	var d2r = Math.PI / 180;
	var r2d = 180 / Math.PI;
	var earthsradius = 3963;
	var points = 64;

	var rlat = (radius / earthsradius) * r2d;
	var rlng = rlat / Math.cos(point.lat * d2r);

	var path = new Array();
	if (dir==1) {var start=0;var end=points+1}
	else{var start=points+1;var end=0}
	for (var i=start; (dir==1 ? i < end : i > end); i=i+dir){
		var theta = Math.PI * (i / (points/2));
		ey = point.lng + (rlng * Math.cos(theta));
		ex = point.lat + (rlat * Math.sin(theta));
		path.push({lat:ex,lng:ey});
	}
	return path;
}
var getraster = function getraster(objfc,callback){
  var Gmap = this
  var mandatory = ['layerurl','layername','configurator']
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true
    }
  })
  if(Fcexit){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  var defobjfc = {
    token:Gmap.EsriVar.esritoken,
    layers:null
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  var token = objfc.token
  var layerurl = objfc.layerurl
  var layername = objfc.layername
  var configurator = objfc.configurator
  var getrastercreateIdentify = null
  var layers = objfc.layers
  Gmap.EsriVar.rasterconfig[layername] = configurator
  configurator = Gmap.EsriVar.rasterconfig[layername]
  $.post('https:'+layerurl,{
    f:'json',
    token:token
  },function(rT){
    if(typeof(rT.capabilities)!='undefined'){
    if((rT.capabilities.split(",")).includes("Tilemap")||typeof(rT.tileInfo)!='undefined'){
        $.post('https:'+layerurl+"/query",{
          f:'json',
          outSR:4326,
          option:'footprints',
          token:token
        },function(r){
          var cekurlarr = layerurl.split("/");
          cekurlarr.pop()
          cekurlarr.pop()
          var cekurl = cekurlarr.join("/");
          var tgtlyr = null;
          if(typeof(rT.mapName)!='undefined'){
            tgtlyr = rT.mapName;
          }
          if(tgtlyr!=null&&tgtlyr!='Layers'){
            $.post('https:'+cekurl,{
              f:'json',
              token:token
            },function(rC){
              if(typeof(rC.services)!='undefined'){
                $.each(rC.services,function(ksr,vsr){
                  if((vsr.name.split("/")).includes(tgtlyr)){
                    var tgturl = cekurl+"/"+((vsr.name.split("/")).reverse())[0]+"/"+vsr.type
                    $.post('https:'+tgturl,{
                      f:'json',
                      token:token
                    },function(rF){
                      if(typeof(rF.capabilities)!=undefined){
                        if(rF.capabilities.indexOf("Query")>-1){
                          if(typeof(rF.layers)!='undefined'){
                            Gmap.createIdentify({
                              type:'raster',
                              arr:rF,
                              str:tgturl,
                              tag:layername,
                              token:token
                            },function(a){
                              getrastercreateIdentify = a
                            });
                          }
                        }
                      }
                    },'json')
                  }
                })
              }
            },'json')
          }else{
            Gmap.createIdentify({
              type:'raster',
              arr:rT,
              str:layerurl,
              tag:layername,
              token:token
            },function(a){
              getrastercreateIdentify = a
            })
          }
          var jsonbounds = r.featureCollection.layers[0].layerDefinition.extent
          var fromEsriVar = false;
          if(token==Gmap.EsriVar.esritoken){
            fromEsriVar = true;
          }
          var imageMapType = new google.maps.ImageMapType({
            getTileUrl:function(coord,zoom) {
                var tilesarr = new Object();
                tilesarr.xmin = project(jsonbounds,'xmin')
                tilesarr.ymin = project(jsonbounds,'ymin')
                tilesarr.xmax = project(jsonbounds,'xmax')
                tilesarr.ymax = project(jsonbounds,'ymax')
                function project(val,xom) {
                  var scale = 1 << zoom
                  switch(xom.substr(0,1)){
                    case 'x':
                      var rX = Math.floor((256 * (0.5 + val[xom] / 360))*scale/256)
                      break;
                    case 'y':
                      var siny = Math.sin(val[xom] * Math.PI / 180);
                          siny = Math.min(Math.max(siny, -0.99999999), 0.99999999);
                      var rX = Math.floor((256 * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)))*scale/256)
                      break;
                  }
                  switch(xom){
                    case 'xmin':
                      rX = rX-Math.round(0.0002*Math.exp(zoom*0.6943))
                      break;
                    case 'ymin':
                      rX = rX+Math.round(0.0005*Math.exp(zoom*0.6879))
                      break;
                    case 'xmax':
                      rX = rX-Math.round(0.00008*Math.exp(zoom*0.6887))
                      break;
                    case 'ymax':
                      rX = rX-Math.round(0.0002*Math.exp(zoom*0.704))
                      break;
                  }
                  return rX
                }
                var activetiles = false;
                if((coord.x>=tilesarr.xmin&&coord.x<=tilesarr.xmax)&&(coord.y<=tilesarr.ymin&&coord.y>=tilesarr.ymax)){
                  activetiles = true;
                }
                tileurl = layerurl+'/tile/'+(Gmap.EsriVar.Mzoom>18?18:zoom)+'/'+coord.y+'/'+coord.x
                if(token!=''){
                  tileurl += '?token='+(fromEsriVar?Gmap.EsriVar.esritoken:token)
                }
                if(zoom<=12){
                if(activetiles&&Gmap.EsriVar.rasterconfig[layername]){
                  return tileurl
                }else{
                  return null
                }
              }else{
                //ss
              }
              },
            tileSize:new google.maps.Size(256, 256),
            name:layername
          });
          var getrasteritr = setInterval(function(){
            if(getrastercreateIdentify!=null){
              clearInterval(getrasteritr)
              if(getrastercreateIdentify){
                if(typeof(Gmap.EsriVar.rasters)!='undefined'){
                  Gmap.EsriVar.rasters[layername] = {name:layername,type:'tiles',item:imageMapType}
                }
                Gmap.overlayMapTypes.push(imageMapType);
                if(!Gmap.EsriVar.esriInit){
                  Gmap.EsriVar.esriInit = true;
                }
                if(typeof(callback)=='function'){
                  callback(true)
                  if(Gmap.EsriVar.debug){
                    console.log("Tile Set",layername,layerurl)
                  }
                }
              }else{
                if(typeof(callback)=='function'){
                  callback(true)
                  if(Gmap.EsriVar.debug){
                    console.log("Tile Set FAIL ",layername,layerurl)
                  }
                }
              }
            }
          },500)
        },'json')
      }
      if((rT.capabilities.split(",")).includes("Map")&&typeof(rT.tileInfo)=='undefined'){
        if(typeof(Gmap.EsriVar.rasters[layername])=='undefined'){
        Gmap.addListener('idle',function(){
          var imgw = 1000;
          var imgv = imgw*(Math.abs(Gmap.EsriVar.esribounds.ymin-Gmap.EsriVar.esribounds.ymax)/Math.abs(Gmap.EsriVar.esribounds.xmin-Gmap.EsriVar.esribounds.xmax))
          var bbox = Gmap.EsriVar.esribounds.xmin+","+Gmap.EsriVar.esribounds.ymin+","+Gmap.EsriVar.esribounds.xmax+","+Gmap.EsriVar.esribounds.ymax
          if(Gmap.EsriVar.rasterconfig[layername]){
            var exportobj = {
              f:'json',
              bbox:bbox,
              bbSR:4326,
              size:imgw+","+imgv,
              transparent:true,
              imageSR:4326,
              token:token
            }
            if(layers!==null){
              exportobj.layers = "show:"+layers
            }
            $.post('https:'+layerurl+"/export",
            exportobj
            ,function(rTx){
              if(Gmap.EsriVar.ready){
              if(typeof(Gmap.EsriVar.rasters)!='undefined'){
                Gmap.clearraster(layername);
              }
              var imgbounds = {
                north:rTx.extent.ymax,
                south:rTx.extent.ymin,
                east:rTx.extent.xmax,
                west:rTx.extent.xmin
              }
              if(typeof(imgbounds.north)!='undefined'){
              historicalOverlay = new google.maps.GroundOverlay(
                rTx.href,
                imgbounds
              );
              if(typeof(Gmap.EsriVar.rasters)!='undefined'){
                Gmap.EsriVar.rasterconfig[layername]=true;
                Gmap.createIdentify({
                  type:'raster',
                  arr:rT,
                  str:layerurl,
                  tag:layername
                },function(a){
                  getrastercreateIdentify = a
                });
                Gmap.EsriVar.rasters[layername] = {name:layername,type:'image',item:historicalOverlay};
                Gmap.EsriVar.rasters[layername].item.setMap(Gmap)
                Gmap.EsriVar.rasters[layername].item.setOpacity(0.5)
              }else{
                if(typeof(Gmap.EsriVar.rasters[layername].item.getMap)=='function'){
                  getrastercreateIdentify = true
                }else{
                  getrastercreateIdentify = false
                }
              }
              }
              }
            },'json')
          }
        })
      }else{
        Gmap.createIdentify({
          type:'raster',
          arr:rT,
          str:layerurl,
          tag:layername
        },function(a){
          getrastercreateIdentify = a
        });
      }
        google.maps.event.trigger(Gmap,'idle')
        var getrasteritr = setInterval(function(){
          if(getrastercreateIdentify!=null){
            clearInterval(getrasteritr)
            if(getrastercreateIdentify){
              if(!Gmap.EsriVar.esriInit){
                Gmap.EsriVar.esriInit = true;
              }
              if(typeof(callback)=='function'){
                callback(true)
                if(Gmap.EsriVar.debug){
                  console.log("Tile Set",layername,layerurl)
                }
              }
            }else{
              if(typeof(callback)=='function'){
                callback(true)
                if(Gmap.EsriVar.debug){
                  console.log("Tile Set FAIL",layername,layerurl)
                }
              }
            }
          }
        },500)
      }
      //ss
      Gmap.EsriVar.rasterlegend[layername] = new Array();
      $.post('https:'+layerurl+'/legend',{
        f:'json',
        token:token
      },function(rL){
        var hasharr = new Array();
        if(typeof(rL.layers)!='undefined'){
          $.each(rL.layers,function(kLg,vLg){
            if(typeof(vLg.legend)!='undefined'){
              $.each(vLg.legend,function(kyLg,vlLg){
                var hash = btoa(JSON.stringify(vlLg))
                if(!hasharr.includes(hash)){
                  hasharr.push(hash)
                  Gmap.EsriVar.rasterlegend[layername].push(vlLg);
                }
              })
            }
          })
        }
      },'json')
    }
  },'json')
}
var getvector = function getvector(objfc,callback){
  var Gmap = this;
  var mandatory = ['layerurl','layername','configurator','vectorType']
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true
    }
  })
  if(Fcexit){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  var defobjfc = {
    token:Gmap.EsriVar.esritoken,
    vectorStyle:Gmap.EsriVar.defStyle,
    redrawable:true,
    whereClause:"1=1",
    sptlGeom:JSON.stringify(Gmap.EsriVar.esribounds),
    sptlType:"esriGeometryEnvelope",
    sptlMethod:"esriSpatialRelIntersects",
    identify:false,
    drawnow:true,
    cluster:false,
    mxZcluster:8,
    mnNcluster:10,
    scalefc:(-0.004*(Math.log(Gmap.EsriVar.Mzoom)))+0.0104
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  var token = objfc.token
  var layerurl = objfc.layerurl
  if(!layerurl.split("/").includes("query")){
    layerurl += "/query"
  }
  var layername = objfc.layername
  var configurator = objfc.configurator
  var vectorType = objfc.vectorType
  var vectorStyle = objfc.vectorStyle
  var redrawable = objfc.redrawable
  var whereClause = objfc.whereClause
  var sptlGeom = objfc.sptlGeom
  var sptlType = objfc.sptlType
  var sptlMethod = objfc.sptlMethod
  var identify = objfc.identify
  var drawnow = objfc.drawnow
  var cluster = objfc.cluster
  var mxZcluster = objfc.mxZcluster
  var mnNcluster = objfc.mnNcluster
  var scalefc = objfc.scalefc
  Gmap.EsriVar.vectorconfig[layername] = configurator
  configurator = Gmap.EsriVar.vectorconfig[layername]
  if(!identify){
    var idturl = layerurl.split("/")
    idturl.pop()
    var tgtidturl = idturl.join("/")
    idturl.pop()
    $.post("https:"+tgtidturl,{
      f:'json',
      token:token
    },function(rV){
      var Varr = {layers:[{name:rV.name,id:rV.id}]}
      Gmap.createIdentify({
        type:'vector',
        arr:Varr,
        str:idturl.join("/"),
        tag:layername
      },function(a){

      })
    },'json')
  }
  if(typeof(Gmap.EsriVar.vectors[layername])=='undefined'){
    Gmap.EsriVar.vectors[layername] = new Array()
    Gmap.EsriVar.vectorIDs[layername] = new Array()
  }
  if(Gmap.EsriVar.vectorconfig[layername]){
      var RAMaddress = (new Date()).getTime()
      Gmap.EsriVar.esriRAM[RAMaddress] = true;
      // var scalefc = (-0.004*(Math.log(Gmap.EsriVar.Mzoom)))+0.0104
      var esriurl = "https:"+layerurl;
      var esriobjcount = {
        where:whereClause,
        f:'json',
        geometry:sptlGeom,
        geometryType:"esriGeometryEnvelope",
        spatialRel:"esriSpatialRelIntersects",
        inSR:"{wkid:4326,latestWkid:4326}",
        returnGeometry:"false",
        returnIdsOnly:"true",
        token:token
      }
      var esriobj = {
        where:whereClause,
        f:"json",
        outSR:"4326",
        geometryPrecision:"8",
        geometry:sptlGeom,
        geometryType:sptlType,
        spatialRel:sptlMethod,
        outFields:'*',
        inSR:"{wkid:4326,latestWkid:4326}",
        token:token
      }
      if(scalefc>0){
        esriobj.maxAllowableOffset=scalefc
      }
      $.post(esriurl,esriobjcount,function(r){
        var esriobjitr = esriobj
        var featuresets = new Array();
        itrstate = true;
        if(typeof(r.objectIds)!='undefined'){
          if(r.objectIds.length>0&&(redrawable||r.objectIds.length>Gmap.EsriVar.vectors[layername].length)){
            var esriI = Math.ceil(r.objectIds.length/150)
            for(i=0;i<esriI;i++){
              if(!Gmap.EsriVar.esriRAM[RAMaddress]){
                break;
              }
              itrstate = itrstate&&false;
              var instate = (r.objectIds.slice((150*i),((150*(i+1))))).join(",");
              esriobjitr.objectIds = instate
              $.post(esriurl,esriobjitr,function(rs){
                itrstate = true;
                $.each(rs.features,function(k,v){
                  featuresets.push(v);
                })
              },'json')
            }
            var esriitrInterval = setInterval(function(){
              if(itrstate&&featuresets.length>=r.objectIds.length&&Gmap.EsriVar.esriRAM[RAMaddress]){
                clearInterval(esriitrInterval)
                if(redrawable){
                  $.each(Gmap.EsriVar.vectors[layername],function(k,v){
                    v.setMap(null);
                  })
                  if(Gmap.EsriVar.debug){
                    console.log("Map Reset",esriobjcount)
                  }
                  Gmap.EsriVar.vectors[layername] = new Array();
                  Gmap.EsriVar.vectorIDs[layername] = new Array()
                }
                $.each(featuresets,function(k0,v0){
                  switch(vectorType){
                    case 'polygon':
                      $.each(v0.geometry.rings,function(k1,v1){
                        vectorStyle.path = ECtoGC(v1);
                        var vector = new google.maps.Polygon(vectorStyle)
                            vector.attributes = v0.attributes
                        if(redrawable){
                            Gmap.EsriVar.vectors[layername].push(vector);
                            Gmap.EsriVar.vectorIDs[layername].push(v0.attributes.fid)
                        }else{
                          if(!Gmap.EsriVar.vectorIDs[layername].includes(v0.attributes.fid)||identify){
                            Gmap.EsriVar.vectors[layername].push(vector);
                            Gmap.EsriVar.vectorIDs[layername].push(v0.attributes.fid)
                          }
                        }
                      })
                      break;
                    case 'polyline':
                      $.each(v0.geometry.paths,function(k1,v1){
                        vectorStyle.path = ECtoGC(v1);
                        var vector = new google.maps.Polyline(vectorStyle)
                        if(redrawable){
                          Gmap.EsriVar.vectors[layername].push(vector);
                          Gmap.EsriVar.vectorIDs[layername].push(v0.attributes.fid)
                        }else{
                          if(!Gmap.EsriVar.vectorIDs[layername].includes(v0.attributes.fid)){
                            Gmap.EsriVar.vectors[layername].push(vector);
                            Gmap.EsriVar.vectorIDs[layername].push(v0.attributes.fid)
                          }
                        }
                      })
                      break;
                    case 'point':
                      if($.isNumeric(v0.geometry.y)&&$.isNumeric(v0.geometry.y)){
                      vectorStyle.position = ECtoGC(v0.geometry);
                      var vector = new google.maps.Marker(vectorStyle)
                          vector.attributes = v0.attributes
                        if(redrawable){
                          if(!Gmap.EsriVar.vectorIDs[layername].includes(v0.attributes.fid)){
                            Gmap.EsriVar.vectors[layername].push(vector);
                            Gmap.EsriVar.vectorIDs[layername].push(v0.attributes.fid)
                          }
                        }else{
                          if(!Gmap.EsriVar.vectorIDs[layername].includes(v0.attributes.fid)){
                            Gmap.EsriVar.vectors[layername].push(vector);
                            Gmap.EsriVar.vectorIDs[layername].push(v0.attributes.fid)
                          }
                        }
                      }
                      break;
                  }
                })
                if(!cluster||typeof(MarkerClusterer)!='function'){
                  $.each(Gmap.EsriVar.vectors[layername],function(k1,v1){
                    if(vectorType=='point'){
                      if(!identify&&drawnow){
                        v1.setMap(Gmap)
                      }
                    }else{
                      if(drawnow){
                        v1.setMap(Gmap)
                      }
                    }
                  })
                }else{
                  if(vectorType=='point'&&layername!='selected'&&layername!='selectedgroup'){
                    var markerCluster = new MarkerClusterer(Gmap,Gmap.EsriVar.vectors[layername],{
                      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                      averageCenter: true,
                      maxZoom:mxZcluster,
                      minimumClusterSize:mnNcluster
                    });
                    if(Gmap.EsriVar.iconpath!=null){
                    var markerStyle = markerCluster.getStyles()
                      $.each(markerStyle,function(k,v){
                        markerStyle[k].url = Gmap.EsriVar.iconpath+'/'+layername+'.png'
                      })
                      markerCluster.setStyles(markerStyle)
                    }
                    if(typeof(Gmap.EsriVar.vectorclusters)=='undefined'){
                      Gmap.EsriVar.vectorclusters = new Object();
                    }
                    Gmap.EsriVar.vectorclusters[layername] = markerCluster
                  }else{
                    $.each(Gmap.EsriVar.vectors[layername],function(k1,v1){
                      if(vectorType=='point'){
                        if(!identify||drawnow){
                          v1.setMap(Gmap)
                        }
                      }else{
                        if(drawnow){
                          v1.setMap(Gmap)
                        }
                      }
                    })
                  }
                }
                if(Gmap.EsriVar.debug){
                  console.log("Map Set",esriobjcount)
                }
                delete Gmap.EsriVar.esriRAM[RAMaddress]
                if(!Gmap.EsriVar.esriInit){
                  Gmap.EsriVar.esriInit = true;
                }
              }
              if(!Gmap.EsriVar.esriRAM[RAMaddress]){
                clearInterval(esriitrInterval)
                delete Gmap.EsriVar.esriRAM[RAMaddress]
                if(typeof(callback)=='function'){
                  callback(true);
                }
              }
            },500)
          }else{
            Gmap.EsriVar.esriRAM[RAMaddress] = false
            delete Gmap.EsriVar.esriRAM[RAMaddress]
            if(typeof(callback)=='function'){
              callback(false);
            }
          }
        }
      },'json')
  }else{
    Gmap.clearvector(layername);
    if(typeof(Gmap.EsriVar.vectorclusters)!='undefined'){
      if(typeof(Gmap.EsriVar.vectorclusters[layername])!='undefined'){
        if(typeof(Gmap.EsriVar.vectorclusters[layername].clearMarkers)=='function'){
          Gmap.EsriVar.vectorclusters[layername].clearMarkers()
        }
      }
    }
    if(typeof(callback)=='function'){
      callback(false);
    }
  }
}
var createIdentify = function createIdentify(objfc,callback){
  var Gmap = this;
  var RAMaddress = ((new Date()).getTime()*100)+3
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  var mandatory = ['type','arr','str','tag']
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true
    }
  })
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  var defobjfc = {
    token:null
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  var arr = objfc.arr
  var type = objfc.type
  var str = objfc.str
  var tag = objfc.tag
  var token = objfc.token
  var createIdentifystate = true;
  var createIdentifyflag = 0;
  if(typeof(arr.layers)=='undefined'){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false)
    }
    return
  }
  $.each(arr.layers,function(kly,vly){
    createIdentifystate = createIdentifystate && false
    var pushid = true;
    var idtlyrname = (vly.name).replace(/[.*+\-?^${}()|[\]\\ ,!]/g,"_")
    $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
      if(vid.name==idtlyrname){
        pushid = false;
      }
    })
    if(pushid){
      $.post('https:'+str+"/"+vly.id,{
        f:'json',
        token:(token==null?Gmap.EsriVar.esritoken:token)
      },function(rkly){
        if(typeof(rkly.geometryType)!='undefined'){
          var idtType = (rkly.geometryType.split("esriGeometry")[1]).toString().toLowerCase();
          var idtAttributes = new Array();
          $.each(rkly.fields,function(kfd,vfd){
            idtAttributes.push(vfd.name);
          })
          Gmap.EsriVar.identifylayers.push({
            url:str+"/"+vly.id+"/query",
            name:idtlyrname,
            attribute:(idtAttributes.length>0?(idtAttributes[0]).toString():'fid'),
            attributes:idtAttributes,
            type:idtType,
            parentlayer:type+"_"+tag,
            draw:true,
            token:(token==null?Gmap.EsriVar.esritoken:token)
          })
        }
        createIdentifyflag++
        createIdentifystate = true;
      },'json')
    }else{
      Gmap.EsriVar.esriRAM[RAMaddress] = false;
      delete Gmap.EsriVar.esriRAM[RAMaddress];
    }
  })
  var createIdentifyitr = setInterval(function(){
    if(createIdentifystate&&createIdentifyflag>=arr.layers.length){
      clearInterval(createIdentifyitr);
      Gmap.EsriVar.esriRAM[RAMaddress] = false;
      delete Gmap.EsriVar.esriRAM[RAMaddress];
      if(typeof(callback)=='function'){
        callback(true)
      }
    }
  },500)
}
var readData = function readData(objfc,callback){
  var Gmap = this
  var mandatory = ['coord','layerurl']
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true
    }
  })
  if(Fcexit){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  var defobjfc = {
    token:null,
    options:{
      returnGeometry:"false",
      inSR:"{wkid:4326,latestWkid:4326}",
      outSR:"{wkid:4326,latestWkid:4326}",
      resultOffset:0,
      resultRecordCount:2000,
      outFields:"*",
      where:"1=1",
      geometryType:"esriGeometryPoint",
      f:"json",
      spatialRel:"esriSpatialRelIntersects"
    }
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  var token = objfc.token
  var coord = JSON.stringify(objfc.coord)
  var layerurl = objfc.layerurl
  var options = objfc.options
  $.each(defobjfc.options,function(k,v){
    if(typeof(options[k])=='undefined'){
      options[k] = defobjfc[k]
    }
  })
  options.geometry =  coord
  if(token!==null){
    options.token = token
  }
  $.post(layerurl,options,function(r){
    if(typeof(callback)=='function'){
      callback(r);
    }
  })
}
var identify = function identify(objfc,callback){
  var Gmap = this
  var mandatory = ['coord']
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true
    }
  })
  if(Fcexit){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return
  }
  var defobjfc = {
    tokens:new Array(),
    layername:'selected',
    layerurl:new Array(),
    attributes:new Array(),
    vectorTypes:new Array(),
    configurator:new Array(),
    identifylayername:new Array(),
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  var tokens = objfc.token
  var layername = objfc.layername
  var coord = objfc.coord
  var layerurl = objfc.layerurl
  var attributes = objfc.attributes
  var vectorTypes = objfc.vectorTypes
  var configurator = objfc.configurator
  var tokens = objfc.tokens
  var identifylayername = objfc.identifylayername
  var typeobjectArr = new Array();
  Gmap.EsriVar.esriRAM = new Object()
  var retAttributes = new Array();
  if(typeof(Gmap.EsriVar.vectors[layername])=='undefined'){
    Gmap.EsriVar.vectors[layername] = new Array()
  }
  if(typeof(layerurl)=='string'){
    layerurl = [layerurl]
    identifylayername = ['singleItem']
  }
  if(typeof(attributes)=='string'){
    attributes = [attributes]
  }
  if(typeof(vectorTypes)=='string'){
    vectorTypes = [vectorTypes]
  }
  if(typeof(configurator)=='boolean'){
    configurator = [configurator]
  }
  if(typeof(vectorTypes)=='string'){
    tokens = [tokens]
  }
  if(layerurl.length+attributes.length+vectorTypes.length+configurator.length!=layerurl.length*4){
    if(typeof(callback)=='function'){
      callback(false)
    }
    if(Gmap.EsriVar.debug){
      console.log('Insufficient Param(s)',objfc);
    }
    return;
  }
  if(typeof(layerurl)=='array'||typeof(layerurl)=='object'){
    if(layerurl.length==0){
      $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
        if($.inArray(vid.parentlayer.split('_')[0],typeobjectArr)==-1){
          typeobjectArr.push(vid.parentlayer.split('_')[0])
        }
        attributes.push(vid.attribute)
        layerurl.push(vid.url)
        vectorTypes.push(vid.type)
        configurator.push(vid.draw)
        tokens.push(vid.token)
        identifylayername.push(vid.parentlayer)
      })
    }
  }
  var RAMaddress = (((new Date()).getTime())*100)+1
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  identifystate = true
  var calcRad = Math.pow(2.5529*Gmap.getZoom(),2)-105.86*Gmap.getZoom()+1103.3
  $.each(layerurl,function(ku,vu){
    if(Gmap.EsriVar.esriRAM[RAMaddress]){
      identifystate = identifystate&&false
      var esriurl = "https:"+vu;
      var coordxy = JSON.stringify(GCtoEC(coord))
      var coordxy = JSON.stringify(GCtoEC({paths:drawCircle(ECtoGC(GCtoEC(coord)),calcRad)}))
      var esriobjcount = {
        where:"1=1",
        f:'json',
        geometry:coordxy,
        geometryType:"esriGeometryPolygon",
        spatialRel:"esriSpatialRelIntersects",
        inSR:"{wkid:4326,latestWkid:4326}",
        returnGeometry:"false",
        outFields:'*',
        token:tokens[ku]
      }
      $.post(esriurl,esriobjcount,function(r){
        if(typeof(r.features)!='undefined'){
          if(r.features.length>0){
            if(typeof(r.features[0].attributes[attributes[ku]])!='undefined'){
              if(Gmap.EsriVar.debug){
              }
              var objattributes = r.features[0].attributes
                  objattributes.url = vu
                  objattributes.error = 0;
                  objattributes.identifyloc = ECtoGC(GCtoEC(coord));
                  objattributes.layername = identifylayername[ku]
              retAttributes.push(objattributes)
              identifyStyle = Gmap.EsriVar.defStyle
              identifyStyle.zIndex = 9998
              Gmap.clearvector('selectedgroup')
              var attributor = r.features[0].attributes[attributes[ku]]
              if(!$.isNumeric(attributor)){
                attributor = "'"+attributor+"'";
              }
              Gmap.getvector({
                token:tokens[ku],
                layerurl:vu,
                layername:'selectedgroup',
                configurator:configurator[ku],
                vectorType:vectorTypes[ku],
                vectorStyle:identifyStyle,
                redrawable:false,
                whereClause:attributes[ku]+"="+attributor,
                identify:true
              },function(ec){
                if(ec>-1||ec===true){
                  identifystate = true
                }
              })
            }else{
              retAttributes.push({url:vu,error:"Error Selection: No Attributes LIKE "+attributes[ku],identifyloc:ECtoGC(GCtoEC(coord)),layername:identifylayername[ku]})
              Gmap.clearvector('selectedgroup')
              identifystate = true
              if(identifystate&&retAttributes.length==layerurl.length&&Gmap.EsriVar.esriRAM[RAMaddress]){
                delete Gmap.EsriVar.esriRAM[RAMaddress]
              }
            }
          }else{
            retAttributes.push({url:vu,error:"No Vector Selected",identifyloc:ECtoGC(GCtoEC(coord)),layername:identifylayername[ku]})
            Gmap.clearvector('selectedgroup')
            identifystate = true
            if(identifystate&&retAttributes.length==layerurl.length&&Gmap.EsriVar.esriRAM[RAMaddress]){
              delete Gmap.EsriVar.esriRAM[RAMaddress]
            }
          }
        }else{
          retAttributes.push({url:vu,error:"URL Not Valid",identifyloc:ECtoGC(GCtoEC(coord)),layername:identifylayername[ku]})
          Gmap.clearvector('selectedgroup')
          identifystate = true
          if(identifystate&&retAttributes.length==layerurl.length&&Gmap.EsriVar.esriRAM[RAMaddress]){
            delete Gmap.EsriVar.esriRAM[RAMaddress]
          }
        }
      },'json')
    }
  })
  if(typeobjectArr.length==1){
    identifystate = true
  }
  var identifyInterval = setInterval(function(){
    if(identifystate&&retAttributes.length==layerurl.length&&Gmap.EsriVar.esriRAM[RAMaddress]){
      clearInterval(identifyInterval)
      delete Gmap.EsriVar.esriRAM[RAMaddress]
    }
    if(!Gmap.EsriVar.esriRAM[RAMaddress]){
      clearInterval(identifyInterval)
      if(typeof(callback)=='function'){
        callback(retAttributes);
      }
    }
  },500)
}
var clearvector = function clearvector(layername=null){
  var Gmap = this
  if(layername==null){
    $.each(Gmap.EsriVar.vectors,function(k,v){
      $.each(Gmap.EsriVar.vectors[k],function(ky,vl){
        vl.setMap(null)
      })
      if(typeof(Gmap.EsriVar.vectorclusters)!='undefined'){
        if(typeof(Gmap.EsriVar.vectorclusters[k])!='undefined'){
          if(typeof(Gmap.EsriVar.vectorclusters[k].clearMarkers)=='function'){
            Gmap.EsriVar.vectorclusters[k].clearMarkers()
          }
        }
      }
      Gmap.EsriVar.vectors[k] = new Array()
      Gmap.EsriVar.vectorIDs[k] = new Array()
      Gmap.EsriVar.vectorconfig[k] = false
    })
    $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
      if(vid.parentlayer.indexOf('vector')>-1){
        delete Gmap.EsriVar.identifylayers[kid]
      }
    })
    Gmap.EsriVar.vectorIDs = new Array();
  }else{
    if(Gmap.EsriVar.vectors[layername]!='undefined'){
      $.each(Gmap.EsriVar.vectors[layername],function(k,v){
        v.setMap(null)
      })
      $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
        if(vid.parentlayer=='vector_'+layername&&layername!='selected'&&layername!='selectedgroup'){
          delete Gmap.EsriVar.identifylayers[kid]
        }
      })
      Gmap.EsriVar.vectors[layername] = new Array()
      Gmap.EsriVar.vectorIDs[layername] = new Array()
      Gmap.EsriVar.vectorconfig[layername] = false
      if(typeof(Gmap.EsriVar.vectorclusters)!='undefined'){
        if(typeof(Gmap.EsriVar.vectorclusters[layername])!='undefined'){
          if(typeof(Gmap.EsriVar.vectorclusters[layername].clearMarkers)=='function'){
            Gmap.EsriVar.vectorclusters[layername].clearMarkers()
          }
        }
      }
    }
  }
  var newIdentifylayers = new Array()
  $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
    if(typeof(Gmap.EsriVar.identifylayers[kid])!='undefined'){
      newIdentifylayers.push(vid)
    }
  })
  Gmap.EsriVar.identifylayers = newIdentifylayers;
}
var clearraster = function clearraster(layername=null){
  var Gmap = this;
  if(typeof(Gmap.EsriVar.rasters)!='undefined'){
    $.each(Gmap.EsriVar.rasters,function(kr,vr){
      if(layername!==null){
        if(vr.name==layername){
          switch(vr.type){
            case 'image':
              vr.item.setMap(null);
              break;
            case 'tiles':
              var rasteraddress = null
              Gmap.overlayMapTypes.forEach(function(v,k){
                if(v.name==layername){
                  rasteraddress = k
                }
              })
              if(rasteraddress>-1){
                Gmap.overlayMapTypes.removeAt(rasteraddress)
              }
              break;
          }
          $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
            if(vid.parentlayer=='raster_'+layername&&layername!='selected'&&layername!='selectedgroup'){
              delete Gmap.EsriVar.identifylayers[kid]
            }
          })
          Gmap.EsriVar.rasterconfig[layername] = false;
        }
      }else{
        switch(vr.type){
          case 'image':
            vr.item.setMap(null);
            break;
          case 'tiles' :
            do{
              Gmap.overlayMapTypes.removeAt(0)
            }while(Gmap.overlayMapTypes.getArray().length>0)
            break;
        }
        $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
          if(vid.parentlayer.indexOf('raster')>-1){
            delete Gmap.EsriVar.identifylayers[kid]
          }
        })
        Gmap.EsriVar.rasterconfig[kr] = false;
      }
    })
  }
  var newIdentifylayers = new Array()
  $.each(Gmap.EsriVar.identifylayers,function(kid,vid){
    if(typeof(Gmap.EsriVar.identifylayers[kid])!='undefined'){
      newIdentifylayers.push(vid)
    }
  })
  Gmap.EsriVar.identifylayers = newIdentifylayers;
}
var spatialQuerySeq = function spatialQuerySeq(objfc,callback){
  var Gmap = this
  var RAMaddress = ((new Date()).getTime()*100)+4
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var mandatory = ['mainlayers','masklayers','attributes','methods']
  var defobjfc = {
    groupby : new Object(),
    token : Gmap.EsriVar.esritoken
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        Fcexit = true
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true;
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(typeof(objfc.masklayers)=='string'){
    objfc.masklayers = {map:GCtoEC(JSON.parse(objfc.masklayers))}
  }
  if(typeof(objfc.mainlayers)=='string'){
    objfc.mainlayers = {map:objfc.mainlayers}
  }
  $.each(objfc.mainlayers,function(k,v){
    if(typeof(objfc.groupby[k])=='undefined'){
      objfc.groupby[k] = new Array();
    }
  })
  if(typeof(objfc.attributes)=='string'){
    objfc.attributes = {map:[objfc.attributes]}
  }
  if(typeof(objfc.methods)=='string'){
    objfc.methods = {map:[[objfc.methods]]}
  }
  var mainlayerskeys = (typeof(objfc.mainlayers)!='undefined'?Object.keys(objfc.mainlayers):new Array())
  var attributeskeys = (typeof(objfc.attributes)!='undefined'?Object.keys(objfc.attributes):new Array())
  var methodskeys = (typeof(objfc.methods)!='undefined'?Object.keys(objfc.methods):new Array())
  var groupbykeys = (typeof(objfc.groupby)!='undefined'?Object.keys(objfc.groupby):new Array())
  var esritoken = objfc.token
  if(!Fcexit){
    $.each(mainlayerskeys,function(k,v){
      if(!attributeskeys.includes(v)||!methodskeys.includes(v)){
        Fcexit = true
      }
    })
    $.each(attributeskeys,function(k,v){
      if(!mainlayerskeys.includes(v)||!methodskeys.includes(v)){
        Fcexit = true
      }
    })
    $.each(methodskeys,function(k,v){
      if(!mainlayerskeys.includes(v)||!attributeskeys.includes(v)){
        Fcexit = true
      }
    })
    $.each(objfc.attributes,function(k,v){
      if(v.length!=(typeof(objfc.methods[k])!='undefined'?objfc.methods[k].length:-1)){
        Fcexit = true
      }
    })
    $.each(objfc.methods,function(k,v){
      if(v.length!=(typeof(objfc.attributes[k])!='undefined'?objfc.attributes[k].length:-1)){
        Fcexit = true
      }
    })
  }
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false);
    }
    if(Gmap.EsriVar.debug){
      console.log("Insufficient Param(s)",objfc)
    }
    return;
  }
  var mainlayers = objfc.mainlayers
  var masklayers = objfc.masklayers
  var attributes = objfc.attributes
  var methods = objfc.methods
  var groupby = objfc.groupby
  var result = false;
  var queryflag = true;
  var queryitr = 0;
  var querytgt = 0;
  $.each(mainlayers,function(k,v){
    $.each(masklayers,function(ky,vl){
      $.each(attributes[k],function(key,val){
        querytgt++
      })
    })
  })
  if((typeof(mainlayers)=='array'||typeof(mainlayers)=='object')
      &&(typeof(masklayers)=='array'||typeof(masklayers)=='object')
      &&(typeof(attributes)=='array'||typeof(attributes)=='object')
      &&(typeof(methods)=='array'||typeof(methods)=='object')){
    result = new Object();
    $.each(mainlayers,function(k,v){
      if(typeof(result[k])=='undefined'){
        result[k] = new Object()
      }
      $.each(masklayers,function(ky,vl){
        if(typeof(result[k][ky])=='undefined'){
          result[k][ky] = new Object()
        }
        $.each(attributes[k],function(key,val){
          if(typeof(result[k][ky][val])=='undefined'){
            result[k][ky][val] = new Object()
          }
          var statQ = new Array();
          $.each(methods[k][key],function(keys,vals){
            if(typeof(result[k][ky][val][vals])=='undefined'){
              result[k][ky][val][vals] = new Array()
            }
            var tmp = {
              statisticType:vals,
              onStatisticField:val,
              outStatisticFieldName:vals
            }
            statQ.push(tmp)
          })
          var layerurl = "https:"+v
          var grp = "";
          $.each(groupby[k],function(kgr,vgr){
            if(kgr>0){
              grp +=","
            }
            grp += vgr
          })
          var statobj = {
            where:"1=1",
            geometry:JSON.stringify(vl),
            geometryType:'esriGeometryEnvelope',
            spatialRel:'esriSpatialRelIntersects',
            inSR:4326,
            outStatistics:JSON.stringify(statQ),
            groupByFieldsForStatistics:grp,
            token:esritoken,
            f:'json'
          }
          queryflag = queryflag&&false
          var page = 0;
          fetchquery();
          function fetchquery(p=0){
            if(p>0){
              statobj.resultOffset = p
              statobj.resultRecordCount = 2000
            }
            $.post(layerurl,statobj,function(rst){
              if(typeof(rst.features)!='undefined'){
                $.each(rst.features,function(kf,vf){
                  if(typeof(vf.attributes)!='undefined'){
                    $.each(vf.attributes,function(kat,vat){
                      if(typeof(groupby[k])=='undefined'){
                        groupby[k] = new Array()
                      }
                      if(!groupby[k].includes(kat)){
                        var temp={
                          mainlayer:k,
                          masklayer:ky,
                          attribute:val,
                          method:kat,
                          val:vat,
                          grupby:new Array(),
                          grupval:new Array()
                        }
                        $.each(groupby[k],function(kg,vg){
                          if(vf.attributes[vg]=='DI Bumi Agung'){
                            console.log(vf.attributes[vg],vat)
                          }
                          temp.grupby.push(vg)
                          temp.grupval.push(vf.attributes[vg])
                        })
                        result[k][ky][val][kat].push(temp)
                      }
                    })
                  }
                })
              }
              if(typeof(rst.exceededTransferLimit)!='undefined'){
                if(!rst.exceededTransferLimit){
                  queryflag = true
                  queryitr++
                }else{
                  page += 2000
                  fetchquery(page)
                }
              }
            },'json')
          }
        })
      })
    })
    var queryInterval = setInterval(function(){
      if(queryflag&&queryitr==querytgt){
        clearInterval(queryInterval);
        Gmap.EsriVar.esriRAM[RAMaddress] = false;
        delete Gmap.EsriVar.esriRAM[RAMaddress];
        if(typeof(callback)=='function'){
          callback(result)
          if(Gmap.EsriVar.debug){
            console.log('Spatial Query Finished',objfc)
          }
        }
      }
    },500)
  }
}
var spatialQueryPar = function spatialQueryPar(objfc,callback){
  var Gmap = this
  var RAMaddress = ((new Date()).getTime()*100)+5
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var mandatory = ['mainlayers','masklayers','attributes','methods']
  var defobjfc = {
    groupby : new Object(),
    whereClause : "1=1",
    token : Gmap.EsriVar.esritoken
  }
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        Fcexit = true
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true;
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(typeof(objfc.masklayers)=='string'){
    objfc.masklayers = {map:GCtoEC(JSON.parse(objfc.masklayers))}
  }
  if(typeof(objfc.mainlayers)=='string'){
    objfc.mainlayers = {map:objfc.mainlayers}
  }
  if(typeof(objfc.groupby)=='string'){
    objfc.groupby = {map:[objfc.groupby]}
  }
  $.each(objfc.mainlayers,function(k,v){
    if(typeof(objfc.groupby[k])=='undefined'){
      objfc.groupby[k] = new Array();
    }
  })
  if(typeof(objfc.attributes)=='string'){
    objfc.attributes = {map:[objfc.attributes]}
  }
  if(typeof(objfc.methods)=='string'){
    objfc.methods = {map:[[objfc.methods]]}
  }
  var mainlayerskeys = (typeof(objfc.mainlayers)!='undefined'?Object.keys(objfc.mainlayers):new Array())
  var attributeskeys = (typeof(objfc.attributes)!='undefined'?Object.keys(objfc.attributes):new Array())
  var methodskeys = (typeof(objfc.methods)!='undefined'?Object.keys(objfc.methods):new Array())
  var groupbykeys = (typeof(objfc.groupby)!='undefined'?Object.keys(objfc.groupby):new Array())
  var esritoken = objfc.token
  if(!Fcexit){
    $.each(mainlayerskeys,function(k,v){
      if(!attributeskeys.includes(v)||!methodskeys.includes(v)){
        Fcexit = true
      }
    })
    $.each(attributeskeys,function(k,v){
      if(!mainlayerskeys.includes(v)||!methodskeys.includes(v)){
        Fcexit = true
      }
    })
    $.each(methodskeys,function(k,v){
      if(!mainlayerskeys.includes(v)||!attributeskeys.includes(v)){
        Fcexit = true
      }
    })
    $.each(objfc.attributes,function(k,v){
      if(v.length!=(typeof(objfc.methods[k])!='undefined'?objfc.methods[k].length:-1)){
        Fcexit = true
      }
    })
    $.each(objfc.methods,function(k,v){
      if(v.length!=(typeof(objfc.attributes[k])!='undefined'?objfc.attributes[k].length:-1)){
        Fcexit = true
      }
    })
  }
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false);
    }
    if(Gmap.EsriVar.debug){
      console.log("Insufficient Param(s)",objfc)
    }
    return;
  }
  var mainlayers = objfc.mainlayers
  var whereClause = objfc.whereClause
  var masklayers = objfc.masklayers
  var attributes = objfc.attributes
  var methods = objfc.methods
  var groupby = objfc.groupby
  var result = false;
  var queryflag = true;
  var queryitr = 0;
  var querytgt = 0;
  $.each(mainlayers,function(k,v){
    $.each(masklayers,function(ky,vl){
      $.each(attributes[k],function(key,val){
        querytgt++
      })
    })
  })
  if((typeof(mainlayers)=='array'||typeof(mainlayers)=='object')
      &&(typeof(masklayers)=='array'||typeof(masklayers)=='object')
      &&(typeof(attributes)=='array'||typeof(attributes)=='object')
      &&(typeof(methods)=='array'||typeof(methods)=='object')){
    result = new Object();
    $.each(mainlayers,function(k,v){
      if(typeof(result[k])=='undefined'){
        result[k] = new Object()
      }
      $.each(masklayers,function(ky,vl){
        if(typeof(result[k][ky])=='undefined'){
          result[k][ky] = new Object()
        }
        $.each(attributes[k],function(key,val){
          if(typeof(result[k][ky][val])=='undefined'){
            result[k][ky][val] = new Object()
          }
          var statQ = new Array();
          $.each(methods[k][key],function(keys,vals){
            if(typeof(result[k][ky][val][vals])=='undefined'){
              result[k][ky][val][vals] = new Array()
            }
            var tmp = {
              statisticType:vals,
              onStatisticField:val,
              outStatisticFieldName:vals
            }
            statQ.push(tmp)
          })
          var layerurl = "https:"+v
          var grp = "";
          $.each(groupby[k],function(kgr,vgr){
            if(kgr>0){
              grp +=","
            }
            grp += vgr
          })
          var statobj = {
            where:"1=1",
            geometry:JSON.stringify(vl),
            geometryType:'esriGeometryPolygon',
            spatialRel:'esriSpatialRelIntersects',
            inSR:"{wkid:4326,latestWkid:4326}",
            outStatistics:JSON.stringify(statQ),
            groupByFieldsForStatistics:grp,
            token:esritoken,
            f:'json'
          }
          if(typeof(whereClause)=='string'){
            statobj.where = whereClause;
          }else{
            if(typeof(whereClause)=='array'||typeof(whereClause)=='object'){
              statobj.where = whereClause[k];
            }
          }
          queryflag = queryflag&&false
          var page = 0;
          if(grp!=""){
          $.post(layerurl, {
            where:"1=1",
            f:'json',
            geometry:statobj.geometry,
            geometryType:"esriGeometryPolygon",
            spatialRel:"esriSpatialRelIntersects",
            inSR:"{wkid:4326,latestWkid:4326}",
            returnGeometry:"false",
            returnIdsOnly:"false",
            returnCountOnly:"true",
            returnDistinctValues:"true",
            outFields:grp,
            token:esritoken
          },function(rcount){
            if(typeof(rcount.count)!='undefined'){
              var fetchitr = Math.ceil(rcount.count/2000,0);
              if(fetchitr>0){
              for(i=0;i<fetchitr;i++){
                fetchquery(i*2000,(i==(fetchitr-1)?true:false))
              }
              }else{
                queryflag = true
                queryitr++
              }
            }
          },'json')
        }else{
          fetchquery(0,true);
        }
          function fetchquery(p=0,terminate){
            if(p>0){
              statobj.resultOffset = p
              statobj.resultRecordCount = 2000
            }
            $.post(layerurl,statobj,function(rst){
              if(typeof(rst.features)!='undefined'){
                $.each(rst.features,function(kf,vf){
                  if(typeof(vf.attributes)!='undefined'){
                    $.each(vf.attributes,function(kat,vat){
                      if(typeof(groupby[k])=='undefined'){
                        groupby[k] = new Array()
                      }
                      if(!groupby[k].includes(kat)){
                        var temp={
                          mainlayer:k,
                          masklayer:ky,
                          attribute:val,
                          method:kat,
                          val:vat,
                          grupby:new Array(),
                          grupval:new Array()
                        }
                        $.each(groupby[k],function(kg,vg){
                          temp.grupby.push(vg)
                          temp.grupval.push(vf.attributes[vg])
                        })
                        result[k][ky][val][kat].push(temp)
                      }
                    })
                  }
                })
              }
              if(terminate){
                queryflag = true
                queryitr++
              }
            },'json')
          }
        })
      })
    })
    var queryInterval = setInterval(function(){
      if(queryflag&&queryitr==querytgt){
        clearInterval(queryInterval);
        Gmap.EsriVar.esriRAM[RAMaddress] = false;
        delete Gmap.EsriVar.esriRAM[RAMaddress];
        if(typeof(callback)=='function'){
          callback(result)
          if(Gmap.EsriVar.debug){
            console.log('Spatial Query Finished',objfc)
          }
        }
      }
    },500)
  }
}
var createvector = function(objfc,callback){
  var Gmap = this
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var mandatory = ['layerurl','features']
  var defobjfc = {
    token : Gmap.EsriVar.esritoken
  }
  var RAMaddress = ((new Date()).getTime()*1000)+1
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        Fcexit = true
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true;
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(!$.isNumeric(objfc.layerurl.split("/").reverse()[0])){
    Fcexit = true
  }
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false);
    }
    if(Gmap.EsriVar.debug){
      console.log("Insufficient Param(s)",objfc)
    }
    return;
  }
  var layerurl = 'https:'+objfc.layerurl+'/addFeatures'
  var token = objfc.token
  if(typeof(objfc.features)=='object'&&!Array.isArray(objfc.features)){
    objfc.features = [objfc.features]
  }
  var features = objfc.features
  $.each(features,function(k,v){
    features[k].geometry.spatialReference = {wkid:4326,latestWkid:4326}
  })
  var createobj = {
    f:'json',
    features:JSON.stringify(features),
    returnEditMoment:true,
    rollbackOnFailure:true
  }
  if(token!=''){
    createobj.token = token
  }
  $.post(layerurl,
    createobj
    ,function(r){
      var retvar = false
      var retarr = new Array();
      if(typeof(r.addResults)=='object'||typeof(r.addResults)=='array'){
        retvar = true
        $.each(r.addResults,function(k,v){
          if(typeof(v.success)!='undefined'){
            retvar = retvar&&v.success
            retarr.push(v)
          }else{
            retvar = false
          }
        })
      }
      if(Gmap.EsriVar.debug){
        console.log({status:retvar,data:retarr});
      }
      Gmap.EsriVar.esriRAM[RAMaddress] = false;
      delete Gmap.EsriVar.esriRAM[RAMaddress];
      if(typeof(callback)=='function'){
        callback({status:retvar,data:retarr});
      }
  },'json');
}
var deletevector = function(objfc,callback){
  var Gmap = this
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var mandatory = ['layerurl','features']
  var defobjfc = {
    token : Gmap.EsriVar.esritoken
  }
  var RAMaddress = ((new Date()).getTime()*1000)+2
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        Fcexit = true
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true;
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(!$.isNumeric(objfc.layerurl.split("/").reverse()[0])){
    Fcexit = true
  }
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false);
    }
    if(Gmap.EsriVar.debug){
      console.log("Insufficient Param(s)",objfc)
    }
    return;
  }
  if((typeof(objfc.features)=='string'&&objfc.features.indexOf(",")==-1)||typeof(objfc.features)=='number'){
    objfc.features = [objfc.features]
  }
  if((typeof(objfc.features)=='string'&&objfc.features.indexOf(",")>-1)){
    objfc.features = objfc.features.split(",")
  }
  var layerurl = 'https:'+objfc.layerurl+'/deleteFeatures'
  var token = objfc.token
  var features = objfc.features.join(",");
  var deleteobj = {
    f:'json',
    objectIds:features,
    returnEditMoment:true,
    rollbackOnFailure:true,
    returnDeleteResults:true
  }
  if(token!=''){
    deleteobj.token = token
  }
  $.post(layerurl,
    deleteobj
    ,function(r){
      var retvar = false
      var retarr = new Array();
      if(typeof(r.deleteResults)=='object'||typeof(r.deleteResults)=='array'){
        retvar = true
        $.each(r.deleteResults,function(k,v){
          if(typeof(v.success)!='undefined'){
            retvar = retvar&&v.success
            retarr.push(v)
          }else{
            retvar = false
          }
        })
      }
      if(Gmap.EsriVar.debug){
        console.log({status:retvar,data:retarr});
      }
      Gmap.EsriVar.esriRAM[RAMaddress] = false;
      delete Gmap.EsriVar.esriRAM[RAMaddress];
      if(typeof(callback)=='function'){
        callback({status:retvar,data:retarr});
      }
  },'json');
}
var editvector = function(objfc,callback){
  var Gmap = this
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var mandatory = ['layerurl','features']
  var defobjfc = {
    token : Gmap.EsriVar.esritoken
  }
  var RAMaddress = ((new Date()).getTime()*1000)+3
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        Fcexit = true
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true;
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(!$.isNumeric(objfc.layerurl.split("/").reverse()[0])){
    Fcexit = true
  }
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false);
    }
    if(Gmap.EsriVar.debug){
      console.log("Insufficient Param(s)",objfc)
    }
    return;
  }
  var layerurlarr = objfc.layerurl.split("/")
  var layerid = layerurlarr.reverse()[0]
  layerurlarr.reverse().pop()
  var layerurl = 'https:'+layerurlarr.join("/")+'/applyEdits';
  var token = objfc.token
  if(typeof(objfc.features)=='object'&&!Array.isArray(objfc.features)){
    objfc.features = [objfc.features]
  }
  var features = new Array(new Object());
      features[0].id = objfc.layerurl.split("/").reverse()[0]
      features[0].updates = new Array();
  $.each(objfc.features,function(k,v){
    if(typeof(v.geometry)!='undefined'){
      objfc.features[k].geometry.spatialReference = {wkid:4326,latestWkid:4326}
    }
    features[0].updates.push(objfc.features[k])
  })
  var editobj = {
    f:'json',
    edits:JSON.stringify(features),
    returnEditMoment:true,
    rollbackOnFailure:true
  }
  if(token!=''){
    editobj.token = token
  }
  $.post(layerurl,
    editobj
    ,function(r){
      var retvar = false;
      var retarr = new Array();
      if(typeof(r)=='array'||typeof(r)=='object'){
        retvar = true
      }
      $.each(r,function(k,v){
        if(typeof(v.updateResults)!='undefined'){
          $.each(v.updateResults,function(ky,vl){
            if(typeof(vl.success)!='undefined'){
              retvar = retvar&&vl.success
              retarr.push(vl)
            }else{
              retvar = retvar&&false
            }
          })
        }else{
          retvar = retvar&&false
        }
      })
      Gmap.EsriVar.esriRAM[RAMaddress] = false;
      delete Gmap.EsriVar.esriRAM[RAMaddress];
      if(typeof(callback)=='function'){
        callback({status:retvar,data:retarr})
      }
      if(Gmap.EsriVar.debug){
        console.log({status:retvar,data:retarr})
      }
  },'json');
}
var EisExist = function(objfc,callback){
  var Gmap = this
  var Fcexit = false
  if(!Gmap.EsriVar.ready){
    Fcexit = true;
  }
  var mandatory = ['layerurl','idobject']
  var defobjfc = {
    token : Gmap.EsriVar.esritoken,
    idfield : 'fid'
  }
  var RAMaddress = ((new Date()).getTime()*1000)+4
  Gmap.EsriVar.esriRAM[RAMaddress] = true;
  $.each(objfc,function(k,v){
    if(mandatory.includes(k)){
      if(typeof(v)=='undefined'){
        Fcexit = true
        if(Gmap.EsriVar.debug){
          console.log('Insufficient Param(s)',objfc);
        }
      }
    }else{
      if(typeof(v)=='undefined'){
        objfc[k] = defobjfc[k]
      }
    }
  })
  $.each(mandatory,function(k,v){
    if(typeof(objfc[v])=='undefined'){
      Fcexit = true;
    }
  })
  $.each(defobjfc,function(k,v){
    if(typeof(objfc[k])=='undefined'){
      objfc[k] = v
    }
  })
  if(!$.isNumeric(objfc.layerurl.split("/").reverse()[0])){
    Fcexit = true
  }
  if(Fcexit){
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(false);
    }
    if(Gmap.EsriVar.debug){
      console.log("Insufficient Param(s)",objfc)
    }
    return;
  }
  var layerurl = 'https:'+objfc.layerurl+'/query'
  var idobject = objfc.idobject
  var token = objfc.token
  var idfield = objfc.idfield
  var where = objfc.idfield+'='+objfc.idobject
  var cekobj = {
    f:'json',
    where:where,
    returnIdsOnly:true
  }
  if(token!=''){
    cekobj.token = token
  }
  var returnResult = false;
  $.post(layerurl,
    cekobj,
    function(rcek){
    if(typeof(rcek.objectIds)!='undefined'){
      if(rcek.objectIds.length>0){
        returnResult = rcek.objectIds
      }
    }
    if(Gmap.EsriVar.debug){
      console.log(returnResult);
    }
    Gmap.EsriVar.esriRAM[RAMaddress] = false;
    delete Gmap.EsriVar.esriRAM[RAMaddress];
    if(typeof(callback)=='function'){
      callback(returnResult)
    }
  },'json')
}
