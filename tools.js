function dummy(){}
function ajaxform(url,parsedata,callback,method){
  if(arenull([url,parsedata,callback,method])){
    console.log('HELP#ajaxform(URL:String,FormData to be passed:FormData,Callback Function to be executed after completion:Function,Method of Ajax:["POST","GET"]:String)')
    return false;
  }
  var ajax = new XMLHttpRequest();
  ajax.open(method,url);
  ajax.addEventListener("load",function(event){
    var r = JSON.parse(event.target.response);
    if(typeof(callback)=='function'){
      callback(r)
    }
  }, false);
  ajax.send(parsedata);
}
function parseForm(elem=null){
  if(arenull([elem])){
    console.log('HELP#parseForm(Form Element ID:String)')
    return false;
  }
  elem = $(elem)
  var formarray = elem.serializeArray()
  var result = new Object()
  $.each(formarray,function(k,v){
    result[v.name] = v.value
  })
  $('#'+elem[0].id+' input[type=file]').each(function(k,v){
    if($(v).prop('files').length>0){
      var exclarrS = $(v).attr('excl').split(",")
      var exclarr = exclarrS.map(x=>parseInt(x))
      $.each($(v).prop('files'),function(ky,vl){
        if($.inArray(parseInt($('.galleryimg:first-of-type').attr('dt-img'))+(ky+1),exclarr)==-1){
          result[$(v).attr('name')+'_'+ky]=$(v).prop('files')[ky]
        }
      })
    }
  })
  return result;
}
function setSelectionRange(input=null, selectionStart=null, selectionEnd=null) {
  if(arenull([input,selectionStart,selectionEnd])){
    console.log('HELP#setSelectionRange(Element ID:String,Start cursor position:Integer,End cursor position:Integer)')
    return false
  }
  input = $(input)[0]
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}
function switchElem(a=null,b=null,x=null){
  if(arenull([a,b])){
    console.log('HELP#switchElem(Main Element ID:String,Sub Element ID:String,Override:Boolean)');
    return false;
  }
  a = $(a);
  b = $(b);
  if(x===null){
    if(a.is(':visible')){
      a.fadeOut(function(){
        b.fadeIn()
      })
    }else{
      b.fadeOut(function(){
        a.fadeIn()
      })
    }
  }else{
    if(typeof(x)=='boolean'){
      if(x){
        a.fadeOut(function(){
          b.fadeIn()
        })
      }else{
        b.fadeOut(function(){
          a.fadeIn()
        })
      }
    }
  }
}
function unfoldElem(a=null,b=null,c=null,x=null){
  if(arenull([a,b,c])){
    console.log('HELP#unfoldElem(Base Element:String,Cover Element:String,Key Attribute:String)')
    return false;
  }
  $(a).off('mouseover')
  $(b).off('mouseleave')
  if(x!==null){
    $(x).off('mouseover')
    $(x).on('mouseover',function(){
      var exechide = true;
      $(a).each(function(k,v){
        if($(v).is(':hover')){
          exechide = false;
          return;
        }
      })
      if(exechide){
        $(b).hide()
      }
    })
  }
  $(a).on('mouseover',function(){
    var tho = $(this)
    $(b).each(function(k,v){
      if($(v).attr(c)!=tho.attr(c)){
        $(v).hide();
      }
    })
    if(tho.siblings(b).not(':visible')){
      tho.siblings(b).css('top',tho.position().top)
      tho.siblings(b).show();
    }
  })
  $(b).on('mouseleave',function(){
    var tho = $(this)
    tho.hide();
  })
}
function humanizeNum(val=null,dig=null,def=null){
  if(arenull([val,dig])){
    console.log('HELP:#humanizeNum(Value to evaluate:Numeric)')
    return false;
  }
  var res = 0
  if($.isNumeric(val)){
    var tempval = 0;
    if(dig>0){
      tempval = parseFloat(val)
    }else{
      tempval = parseInt(val)
    }
    res = tempval.toLocaleString(
      "id-ID", {
        minimumFractionDigits: dig,
        maximumFractionDigits: dig
      })
    if(res==0&&def!==null){
      res = def
    }
  }else{
    if(def!==null){
      res = def
    }
  }
  return res;
}
function humanizeStr(val=null,defres=null,excparr=null){
  if(arenull([val])){
    console.log('HELP:#humanizeStr(Value to Evaluate:String)')
    return false;
  }
  var defexcp = ['undefined','null',null,'','-']
  if(excparr!==null){
    switch(typeof(excparr)){
      case 'string':
        defexcp = [excparr]
        break;
      case 'array':
        defexcp = excparr
        break;
      case 'object':
        defexcp = excparr
        break;
    }
  }
  defresR = '-';
  if(defres!==null){
    defresR = defres;
  }
  var res = val;
  proc = false;
  $.each(defexcp,function(k,v){
    if(val===v){
      proc = true;
    }
  })
  if(proc){
    res = defresR;
  }
  return res;
}
function formatDate(date=null,incr=null,locale=null) {
    if(date==null){
      date = new Date()
    }else{
      if(typeof(incr)=='string'){
        var ceklocale = incr.split("-");
        if(ceklocale.length==2){
          locale = incr;
          incr = 0;
        }
      }
      if(typeof(date)=='number'){
        incr = date;
        date = new Date();
      }else{
        if(typeof(date)=='string'){
          var ceklocale = date.split("-");
          if(ceklocale.length==2){
            locale = date;
            date = new Date();
          }
        }
      }
    }
    if(incr==null){
      incr = 0
    }else{
      if(typeof(incr)=='string'){
        var ceklocale = incr.split("-");
        if(ceklocale.length==2){
          locale = incr;
          incr = 0;
        }
      }
    }
    var d = new Date((new Date(date)).setDate((new Date(date)).getDate()+incr)),
		    month = '' + (d.getMonth() + 1),
		    day = '' + d.getDate(),
		    year = d.getFullYear();
				hours = d.getHours();
				minutes = d.getMinutes();
				seconds = d.getSeconds();
		if (month < 10){month = '0' + month;}
		if (day < 10){day = '0' + day;}
		if (hours < 10){hours = '0' + hours;}
		if (minutes < 10){minutes = '0' + minutes;}
		if (seconds < 10){seconds = '0' + seconds;}
    var date = [year, month, day].join('-')
    var time = [hours,minutes,seconds].join(':')
    var result = [date,time].join(' ')
    if(locale!=null){
      result = d.toLocaleString(locale,{"dateStyle":"full"})
      if(!result.includes(",")){
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        result = new Intl.DateTimeFormat(locale,options).format(d)
      }
    }
		return result;
	}
function setPagination(a=null,c=null,b=null){
  if(arenull([a,b,c])){
    console.log('HELP:#setPagination(Container Element ID:String)')
    return false;
  }
  var pagihtm = `
  <ul class="pagination" id="pagination">
    <li class="disabled"><a href="#!"><i class="fas fa-chevron-left"></i></a></li>
    <li class="pagi-active"><a class="pagi-active-text" href="#!">1</a></li>
    <li class="disabled"><a href="#!"><i class="fas fa-chevron-right"></i></a></li>
  </ul>`;
  $('#'+a).html(pagihtm);
  $(document).on("click", ".page-navi", function() {
    if(!$(this).parent().hasClass('disabled')){
      console.log($(this).parent().hasClass('disabled'))
      var tp = $(this).attr("dt-tp");
      $(this).html(`<i class="fas fa-spin fa-spinner smaller-text"></i>`);
      if (tp == "step") {
        var step = $(this).attr("dt-direction");
        c = c + parseInt(step);
      } else {
        c = parseInt($(this).attr("dt-pg"));
      }
      if(typeof(b)=='function'){
        b(c)
      }
    }
  })
}
function drawPagination(max=null, cur=null) {
  if(arenull([max,cur])){
    console.log('HELP:#drawPagination(Max Page:Integer,Current Page:Integer)')
    return false;
  }
  var start, end, selisih;
  var dis = [false, false];

  cur = parseInt(cur);

  start = cur - 3;
  end = cur + 3;
  if (max < 0) { max = 1; }

  if (start < 1) {
    start = 1;
    selisih = 1 - start;
    end = end + selisih;
  }

  if (end > max) {
    end = max;
    dis[1] = true;
  }

  if (cur == 1) { dis[0] = true; }

  let cl = `<li class="` + (dis[0] ? "disabled" : "") + `"><a href="#!" class="page-navi" dt-tp="step" dt-direction="-1"><i class="fas fa-chevron-left"></i></a></li>`;
  let cr = `<li class="` + (dis[1] ? "disabled" : "") + `"><a href="#!" class="page-navi" dt-tp="step" dt-direction="1"><i class="fas fa-chevron-right"></i></a></li>`;
  let pg_aktif = `<li class="pagi-active"><a class="pagi-active-text" href="#!">` + cur + `</a></li>`;
  var pg_temp = `<li class="waves-effect"><a href="#!" class="page-navi" dt-tp="page" dt-pg="%PG%">%PG%</a></li>`;

  var htm = cl;

  for (var i = start; i <= end; i++) {
    if (i == cur) {
      htm += pg_aktif;
    } else {
      var pg_1 = pg_temp;
      pg_1 = pg_1.replace(/\%PG\%/g, i);
      htm += pg_1;
    }
  }
  htm += cr;
  $("#pagination").html(htm);
}
function arenull(arr=null){
  if(arr===null||arr==='help'){
    console.log('HELP#arenull(Array of Value to be evaluate as NULL:Array)')
  }
  var result = false;
  $.each(arr,function(k,v){
    if(k==0){
      if(v=='help'){
        result = true
      }
    }else{
      if(v===null){
        if(result){
          result = true;
        }
      }else{
        result = false;
      }
    }
  })
  return result
}
function dragElement(elmnt=null) {
  if(arenull([elemnt])){
    console.log('HELP:#dragElement(Element to be draggable:DOM)')
    return false;
  }
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }
  var dragI = null
  function dragMouseDown(e) {
    var drag = false;
    var dragC = 0;
    document.onmouseup = closeDragElement;
    if(dragI==null){
      dragI = setInterval(function(){
        console.log(dragC)
        if(dragC>=2){
          clearInterval(dragI);
          $(elmnt).css('border','solid 3px black');
          drag = true;
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmousemove = elementDrag;
        }else{
          dragC++
        }
      },150)
    }
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    $(elmnt).css('border','none');
    if(dragI!=null){
      clearInterval(dragI);
      dragI = null;
    }
  }
}
function swapElem(options=null){
  if(options=='help'){
    console.log('HELP:#swapElem(Essential Options{width,expandTo}:Object)')
    return false;
  }
  var defoptions = {
    triggerSize : "2rem",
    expandTo : '50%',
    triggerButton : '<i class="fas fa-info-circle" style="color:white"></i>',
    clickFunction : null
  }
  if(options===null){
    options = defoptions;
  }else{
    if(typeof(options)=='object'){
      $.each(defoptions,function(k,v){
        if(typeof(options[k])=='undefined'){
          options[k] = v;
        }
      })
    }else{
      return false;
    }
  }
  var orientation = window.screen.orientation.type.split("-");
  if(orientation.includes("landscape")){
    var swapitr = $('.swap').children().length;
    var swaplength = 0;
    $('.swap').addClass('full')
    $('.swap').children().each(function(k,v){
      $(v).addClass('fullh')
      $(v).css('position','absolute')
      $(v).css('left',swaplength)
      $(v).before('<div class="fullh" style="width:'+swaplength+'px;background-color:'+$(v).css('background-color')+'"></div>')
      $(v).css('zIndex',swapitr-k)
      $(v).attr('dtpos',swaplength)
      if(k==swapitr-1){
        $(v).css('width','calc(100% - '+swaplength+'px)')
      }else{
        if($(v).hasClass('swap-pin')&&!$(v).hasClass('swap-able')){
          swaplength += $(v).width();
        }
        if($(v).hasClass('swap-able')&&!$(v).hasClass('swap-pin')){
          var ablehtm = $(v).html();
          $(v).empty();
          var ablecntn = `
          <div class="swap-content" style="width:calc(100% - `+options.triggerSize+`);height:100%;display:none">
            `+ablehtm+`
          </div>
          `;
          var abletrig = `
          <div class="swap-trigger clickable row nomp center-xs" style="width:`+options.triggerSize+`;height:100%;padding-top:20px" dtswap="0" dtable="`+k+`">
            `+options.triggerButton+`
          </div>
          `;
          $(v).append(ablecntn+abletrig)
          swaplength += $(v).children('.swap-trigger').width()
        }
      }
    })
    $('.swap').css('opacity',1)
    $('.swap-trigger').unbind();
    $('.swap-trigger').click(function(){
      $(this).parent().addClass('onproc')
        if($(this).attr('dtswap')=="0"){
          swapTrigger($(this),true,true)
          // $(this).parent().hover(function(){
          //   $(this).css('opacity',1)
          // },function(){
          //   $(this).css('opacity',0.6)
          // })
        }else{
          swapTrigger($(this),false,true)
          // $(this).parent().css('opacity',1)
        }
        $(this).parent().removeClass('onproc')
        if(typeof(options.clickFunction)=='function'){
          var thisfc = options.clickFunction;
          thisfc();
        }
    })
  }else{
    if(orientation.includes('portrait')){
      $('.swap').addClass('col-xs-12 row nomp')
      $('.swap-able').hide();
      $('.swap').children().each(function(k,v){
        $(v).addClass('col-xs-12 row nomp')
        $(v).removeClass('fullh')
        if($(v).hasClass('swap-pin')&&!$(v).hasClass('swap-able')){
        }else{
          if($(v).hasClass('swap-able')&&!$(v).hasClass('swap-pin')){
            var triggerhtm = '<div class="col-xs-12 row nomp swap-trigger end-xs middle-xs clickable" style="font-size:'+options.triggerSize+';height:'+options.triggerSize+';background-color:'+$(v).css('background-color')+';padding-right:20px" dtswap="0">'+options.triggerButton+'</div>'
            $(v).after(triggerhtm)
            if($(v).prev().hasClass('swap-pin')){
              $(v).css('background-color',$(v).prev().css('background-color'));
            }
          }
        }
      })
      $('.swap-trigger').height($('.swap-trigger').height()*3)
      $('.swap').css('opacity',1)
      $('.swap-trigger').unbind();
      $('.swap-trigger').click(function(){
        var tho = $(this)
        if(tho.attr('dtswap')=="0"){
          swapTrigger(tho,true,false)
        }else{
          swapTrigger(tho,false,false)
        }
        if(typeof(options.clickFunction)=='function'){
          var thisfc = options.clickFunction;
          thisfc();
        }
      })
    }
  }
  function swapTrigger(elem,toggle,landscape){
    if(landscape){
      elem.parent().addClass('onproc')
      if(toggle){
        $('.swap-able:not(.onproc)').animate({'width':options.triggerSize})
        $('.swap-able:not(.onproc) .swap-content').hide();
        $('.swap-able:not(.onproc) .swap-trigger').attr('dtswap',"0")
        $('.swap-able:not(.onproc)').unbind();
        $('.swap-able:not(.onproc)').css('opacity',1);
        elem.siblings('.swap-content').show()
        elem.parent().animate({'width':options.expandTo})
        elem.attr('dtswap',"1")
        // elem.parent().unbind()
        // elem.parent().hover(function(){
        //   elem.css('opacity',1)
        // },function(){
        //   elem.css('opacity',0.6)
        // })
      }else{
        elem.siblings('.swap-content').hide()
        elem.parent().animate({'width':options.triggerSize})
        elem.attr('dtswap',"0")
        // elem.parent().unbind()
        // elem.parent().css('opacity',1)
      }
      elem.parent().removeClass('onproc')
    }else{
      if(toggle){
        elem.prev().addClass('onproc')
        $('.swap-able:not(.onproc)').next().attr('dtswap',"0")
        if($('.swap-able:not(.onproc)').length>0){
        $('.swap-able:not(.onproc)').slideUp({
          complete:function(){
            elem.prev().slideDown(function(){
              elem.attr('dtswap',"1")
            })
          }
        });
        }else{
          elem.prev().slideDown(function(){
            elem.attr('dtswap',"1")
          })
        }
        elem.prev().removeClass('onproc')
      }else{
        $('.swap-able').slideUp(function(){
          elem.attr('dtswap',"0")
        })
      }
    }
  }
  (function( $ ){
    $.fn.close = function() {
      var elem = this
      if(elem.hasClass('swap-trigger')){
        swapTrigger(elem,false,window.screen.orientation.type.split("-").includes("landscape"));
      }
    };
    $.fn.open = function() {
      var elem = this
      if(elem.hasClass('swap-trigger')){
        swapTrigger(elem,true,window.screen.orientation.type.split("-").includes("landscape"));
      }
    };
  })( jQuery );
}
function makeCharts(elemID,data,options,callback=null){
  var defobj = {
    chartType : 'bar',
    chartOrient : 'h',
    mobileVer : false,
    color : null,
    sMod : null,
    xMod : null,
    yMod : null
  }
  $.each(defobj,function(k,v){
    if(typeof(options[k])=='undefined'){
      options[k] = v;
    }
  })
  var chartType = options.chartType;
  var chartOrient = options.chartOrient;
  var mobileVer = options.mobileVer;
  var color = options.color;
  var xMod = options.xMod;
  var yMod = options.yMod;
  var sMod = options.sMod;
  am4core.ready(function(){
    var btnCon = `
    <div class="row end-xs" id="btncon_`+elemID+`" style="position:relative;bottom:0;left:0;z-index:2;width:50px">
      <div class="col-xs-12 nomp">
      <button class="btn blue fullw pie"><i class="fa fas fa-chart-pie"></i></button>
      </div>
      <div class="col-xs-12 nomp">
      <button class="btn blue fullw barv"><i class="fas fa-sliders-h fa-rotate-90"></i></button>
      </div>
      <div class="col-xs-12 nomp">
      <button class="btn blue fullw barh"><i class="fas fa-sliders-h"></i></button>
      </div>
      <div id="printMenu_`+elemID+`" class="btn blue fullw col-xs-12 nombi row center-xs middle-xs">
      </div>
    </div>
    `
    $('#'+elemID).after(btnCon)
    $('#btncon_'+elemID).css('left','calc(50% - '+$('#btncon_'+elemID).width()+'px)');
    var valX = 'val';
    var valY = 'grp';
    switch(chartType){
      case 'bar':
          am4core.useTheme(am4themes_animated);
          var chart = am4core.create(elemID, am4charts.XYChart);
          chart.data = data;
          switch(chartOrient){
            case 'h':
              chart.scrollbarX = new am4core.Scrollbar();
              var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
              categoryAxis.dataFields.valueX = valY;
              categoryAxis.renderer.minGridDistance = 10;
              categoryAxis.renderer.grid.template.location = 0;
              categoryAxis.cursorTooltipEnabled = false;
              var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
              valueAxis.extraMax = 0.2;
              valueAxis.renderer.minGridDistance = 100;
              valueAxis.renderer.labels.template.dx = -20;
              var series = chart.series.push(new am4charts.ColumnSeries());
              series.columns.template.column.cornerRadiusTopRight = 10;
              series.columns.template.column.cornerRadiusBottomRight = 10;
              series.dataFields.valueX = valX;
              series.dataFields.categoryY = valY;
              series.dataFields.valueX = valX;
              series.dataFields.categoryY = valY;
              if(mobileVer){
                series.tooltipText = "{categoryY}:{valueX}";
              }else{
                series.tooltipText = "{valueX}";
              }
              series.columns.template.tooltipText = "{valueX}";
              if(yMod!==null){
                categoryAxis.config = yMod;
              }
              if(xMod!==null){
                valueAxis.config = xMod;
              }
              break;
            case 'v':
              chart.scrollbarY = new am4core.Scrollbar();
              var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
              categoryAxis.renderer.labels.template.rotation = 270;
              categoryAxis.renderer.labels.template.autoRotateCount = 15;
              categoryAxis.dataFields.valueX = valY;
              categoryAxis.renderer.grid.template.location = 0;
              categoryAxis.renderer.minGridDistance = 5;
              categoryAxis.extraMax = 0.2;
              categoryAxis.renderer.minGridDistance = 30;
              categoryAxis.cursorTooltipEnabled = false;
              var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
              var series = chart.series.push(new am4charts.ColumnSeries());
              series.columns.template.column.cornerRadiusTopLeft = 10;
              series.columns.template.column.cornerRadiusTopRight = 10;
              series.dataFields.valueY = valX;
              series.dataFields.categoryX = valY;
              series.dataFields.valueX = valX;
              series.dataFields.categoryY = valY;
              if(mobileVer){
                series.tooltipText = "{categoryX}:{valueY}";
              }else{
                series.tooltipText = "{valueY}";
              }
              series.columns.template.tooltipText = "{valueY}";
              if(xMod!==null){
                categoryAxis.config = xMod;
              }
              if(yMod!==null){
                valueAxis.config = yMod;
              }
              break;
            }
          if(color!==null){
            var colorSet = new am4core.ColorSet();
            colorSet.list = color.map(function(color) {
              return new am4core.color(color);
            });
            series.colors = colorSet;
          }
          series.tooltip.dy = -5;
          series.tooltip.label.textAlign = "float:left";
          series.tooltip.pointerOrientation = "down";
          series.columns.template.tooltipY = 0;
          series.columns.template.alwaysShowTooltip = true;
          series.columns.template.width = am4core.percent(80);
          series.tooltip.autoTextColor = false;
          categoryAxis.dataFields.category = valY;
          categoryAxis.tooltip.enabled = true;
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 1;
          categoryAxis.renderer.labels.template.horizontalCenter = "right";
          categoryAxis.renderer.labels.template.verticalCenter = "middle";
          if(mobileVer){
            categoryAxis.renderer.labels.template.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
          }
          series.sequencedInterpolation = true;
          series.columns.template.strokeWidth = 0;
          series.columns.template.column.fillOpacity = 0.8;
          var hoverState = series.columns.template.column.states.create("hover");
          hoverState.properties.fillOpacity = 1;
          series.columns.template.adapter.add("fill", function(fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
          });
          chart.cursor = new am4charts.XYCursor();
          if(mobileVer){
            categoryAxis.cursorTooltipEnabled = false;
            valueAxis.cursorTooltipEnabled = false;
          }
          if(sMod!==null){
            series.config = sMod
          }
          break;
        case 'pie':
          am4core.useTheme(am4themes_animated);
          var chart = am4core.create(elemID, am4charts.PieChart);
          chart.data = data;
          var pieSeries = chart.series.push(new am4charts.PieSeries());
          pieSeries.dataFields.value = valX;
          pieSeries.dataFields.category = valY;
          chart.innerRadius = am4core.percent(30);
          pieSeries.slices.template.stroke = am4core.color("#fff");
          pieSeries.slices.template.strokeWidth = 2;
          pieSeries.slices.template.strokeOpacity = 1;
          pieSeries.slices.alwaysShowTooltip = true;
          pieSeries.ticks.template.disabled = true;
          pieSeries.labels.template.text = "{value}";
          pieSeries.labels.template.fill = am4core.color("white");
          pieSeries.alignLabels = false;
          pieSeries.labels.template.radius = am4core.percent(-30);
          pieSeries.labels.template.adapter.add("radius", function(radius, target) {
            if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
              return 0;
            }
            return radius;
          });
          pieSeries.labels.template.adapter.add("fill", function(color, target) {
            if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
              return am4core.color("#000");
            }
            return color;
          });
          pieSeries.sequencedInterpolation = true;
          pieSeries.slices.alwaysShowTooltip = true;
          if(color!==null){
            var colorSet = new am4core.ColorSet();
            colorSet.list = color.map(function(color) {
              return new am4core.color(color);
            });
            pieSeries.colors = colorSet;
          }
          if(sMod!==null){
            pieSeries.config = sMod
          }
          var grouper = pieSeries.plugins.push(new am4plugins_sliceGrouper.SliceGrouper());
          grouper.threshold = 5;
          grouper.groupName = "Other";
          grouper.clickBehavior = "zoom";
          var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
          shadow.opacity = 0;
          var hoverState = pieSeries.slices.template.states.getKey("hover");
          var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
          hoverShadow.opacity = 0.7;
          hoverShadow.blur = 5;
          break;
        }
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.getFormatOptions("pdf").addURL = false;
        chart.exporting.menu.container = document.getElementById("printMenu_"+elemID);
      setTimeout(function(){
        $('#printMenu_'+elemID+'>ul').css({
          'top':'unset',
          'left':'unset',
          'position':'absolute'
        })
        $('#printMenu_'+elemID+'>ul>li').css({
          'background':'rgba(0,0,0,0)'
        })
        $('#printMenu_'+elemID+'>ul>li>a').css({
          'color':'rgba(0,0,0,0)'
        })
        $('#printMenu_'+elemID).append('<i class="fas fa-print"></i>')
        $('#btncon_'+elemID).css({
          'bottom':'calc('+($('#'+elemID).height()-$('#btncon_'+elemID).height())+'px + 12%)'
        })
        $('#btncon_'+elemID+' .barv').click(function(){
          chart.dispose();
          options.chartType = 'bar';
          options.chartOrient = 'v';
          $('#btncon_'+elemID).remove()
          makeCharts(elemID,data,options,callback)
        })
        $('#btncon_'+elemID+' .barh').click(function(){
          chart.dispose();
          options.chartType = 'bar';
          options.chartOrient = 'h';
          $('#btncon_'+elemID).remove()
          makeCharts(elemID,data,options,callback)
        })
        $('#btncon_'+elemID+' .pie').click(function(){
          chart.dispose();
          options.chartType = 'pie';
          options.chartOrient = 'h';
          $('#btncon_'+elemID).remove()
          makeCharts(elemID,data,options,callback)
        })
        if(typeof(callback)=='function'){
          callback(chart);
        }
      },500);
  });
}
function getOrientation(){
  var result = null;
  var orientationstr = window.screen.orientation.type.split("-");
  if(orientationstr.includes("portrait")){
    result = false;
  }
  if(orientationstr.includes("landscape")){
    result = true;
  }
  return result;
}
function romanize (num) {
	if (!+num)
		return false;
	var	digits = String(+num).split(""),
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
		       "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
		       "","I","II","III","IV","V","VI","VII","VIII","IX"],
		roman = "",
		i = 3;
	while (i--)
		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
	return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize (str) {
	var	str = str.toUpperCase(),
		validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/,
		token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g,
		key = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
		num = 0, m;
	if (!(str && validator.test(str)))
		return false;
	while (m = token.exec(str))
		num += key[m[0]];
	return num;
}
function setSignaturePad(id,submitfc){
  if(typeof(SignaturePad)=='function'){
    var padhtm = `
      <div class="col-xs-12 row nomp">
      <canvas style="background-color: #ffffff; border: 1px solid #ccc;"></canvas>
      <div class="col-xs-12 row nomp end-xs" style="height:30px">
      <div class="btn pad clear ma-bg-salm" style="height:30px;line-height:30px">Clear</div>
      <div class="btn pad submit ma-bg-blue" style="height:30px;line-height:30px">Submit</div>
      </div>
      </div>
    `
    $(id).html(padhtm)
    var canvas = $(id+' canvas')[0]
    canvas.width = $(id).width();
    canvas.height = $(id).height()-30;
    var signaturePad = new SignaturePad(canvas)
    $(id+' .btn.pad.clear,'+id+' .btn.pad.submit').unbind('click')
    $(id+' .btn.pad.clear').click(function(){
      signaturePad.clear();
    })
    $(id+' .btn.pad.submit').click(function(){
      $(id).attr('dt-pad',signaturePad.toDataURL('image/png'))
      if(typeof(submitfc)){
        submitfc()
      }
    })
  }else{
    console.log('Require Signature Pad JS')
  }
}
function cekodd(val){
  var returnVal = false;
  if(val%2==0){
    returnVal = true;
  }
  return returnVal;
}
function trnodata(obj){
  var defobj = {
	col:1,
	row:1,
	str:"No Data"
  }
  $.each(defobj,function(k,v){
	  if(typeof(obj[k])=='undefined'){
		  obj[k] = defobj[k]
	  }
  })
  var col = obj.col
  var row = obj.row
  var str = obj.str
  return '<tr><td class="ma-ta-c" colspan="'+col+'" rowspan="'+row+'">'+str+'</td></tr>'
}
function trloaddata(obj){
	var defobj = {
	col:1,
	row:1,
	str:'<i class="fas fa-spin fa-spinner"></i>'
  }
  $.each(defobj,function(k,v){
	  if(typeof(obj[k])=='undefined'){
		  obj[k] = defobj[k]
	  }
  })
  var col = obj.col
  var row = obj.row
  var str = obj.str
  return '<tr><td class="ma-ta-c" colspan="'+col+'" rowspan="'+row+'">'+str+'</td></tr>'
}
