function makeCharts(elemID,data,options,callback=null){
  var sumData = 0;
  var avgData = 0;
  $.each(data,function(k,v){
    if(typeof(v.sliceGrouperOther)!='undefined'){
      data.splice(k,1)
    }
    sumData += parseFloat(v.val)
  })
  if(sumData>0){
    avgData = sumData/data.length
  }
  if(typeof(am4core)!='undefined'){
    var defobj = {
      chartType : 'bar',
      chartOrient : 'h',
      mobileVer : false,
      buttonClass: 'blue',
      setLegend:false,
      gridLegend:2,
      colorSets:null,
      autoLabel:true,
      disableGroupLabel:false,
      disableValueLabel:false,
      initTooltip:false,
      fullTooltip:true,
      disableGroup:true,
      disableValue:false,
      bigNumber:true,
    }
    var orientation = window.screen.orientation.type.split("-");
    if(orientation.includes("portrait")){
      defobj.mobileVer = true;
    }
    $.each(defobj,function(k,v){
      if(typeof(options[k])=='undefined'){
        options[k] = v;
      }
    })
    var chartType = options.chartType;
    var chartOrient = options.chartOrient;
    var mobileVer = options.mobileVer;
    var buttonClass = options.buttonClass;
    var colorarr = new Array();
    var setLegend = options.setLegend;
    var gridLegend = options.gridLegend*1.35;
    var colorSets = options.colorSets
    var initTooltip = options.initTooltip;
    var fullTooltip = options.fullTooltip;
    var autoLabel = options.autoLabel;
    var disableGroupLabel = options.disableGroupLabel;
    var disableValueLabel = options.disableValueLabel;
    var disableGroup = options.disableGroup;
    var disableValue = options.disableValue;
    var bigNumber = options.bigNumber;
    var bigNumberArr = [
      { "number": 1e+6, "suffix": " Jt" },
      { "number": 1e+9, "suffix": " M" },
      { "number": 1e+12, "suffix": " T" }
    ]
    am4core.ready(function(){
      var btnCon = `
      <div class="row center-xs nomb" id="btncon_`+elemID+`" style="position:relative;bottom:0;left:0;z-index:2;width:50px;opacity:0.5;`+(mobileVer?'width:6rem;':'')+`">
        <div class="col-xs-12 nomp">
        <button class="btn `+buttonClass+` fullw pie"><i class="fa fas fa-chart-pie"></i></button>
        </div>
        <div class="col-xs-12 nomp">
        <button class="btn `+buttonClass+` fullw barv"><i class="fas fa-sliders-h fa-rotate-90"></i></button>
        </div>
        <div class="col-xs-12 nomp">
        <button class="btn `+buttonClass+` fullw barh"><i class="fas fa-sliders-h"></i></button>
        </div>
        <div id="printMenu_`+elemID+`" class="btn `+buttonClass+` fullw col-xs-12 nombi row center-xs middle-xs" `+(mobileVer?'style="margin-top:8px"':'')+`>
        </div>
      </div>
      `
      $('#'+elemID).after(btnCon)
      $('#btncon_'+elemID).css('left','calc(50% - '+($('#btncon_'+elemID).width()*0.8)+'px)');
      var seriesValue = 'val';
      var seriesGroup = 'grp';
      switch(chartType){
        case 'bar':
            am4core.useTheme(am4themes_animated);
            var chart = am4core.create(elemID, am4charts.XYChart);
            chart.data = data;
            switch(chartOrient){
              case 'h':
                chart.scrollbarX = new am4core.Scrollbar();
                var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.valueX = seriesGroup;
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
                series.dataFields.valueX = seriesValue;
                series.dataFields.categoryY = seriesGroup;
                break;
              case 'v':
                chart.scrollbarY = new am4core.Scrollbar();
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.labels.template.rotation = 270;
                categoryAxis.renderer.labels.template.autoRotateCount = 15;
                categoryAxis.dataFields.valueX = seriesGroup;
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 5;
                categoryAxis.extraMax = 0.2;
                categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.cursorTooltipEnabled = false;
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.columns.template.column.cornerRadiusTopLeft = 10;
                series.columns.template.column.cornerRadiusTopRight = 10;
                series.dataFields.valueY = seriesValue;
                series.dataFields.categoryX = seriesGroup;
                break;
              }
            if(fullTooltip){
              series.tooltipText = (Object.keys(data[0]).includes('alias')?'{alias}':'{'+seriesGroup+'}')+" : {"+seriesValue+".formatNumber(#)}";
            }else{
              series.tooltipText = "{"+seriesValue+".formatNumber(#)}";
            }
            series.columns.template.tooltipText = "{"+seriesValue+".formatNumber(#)}";
            series.tooltip.dy = -5;
            series.tooltip.label.textAlign = "float:left";
            series.tooltip.pointerOrientation = "down";
            series.columns.template.tooltipY = 0;
            series.columns.template.alwaysShowTooltip = initTooltip;
            series.columns.template.width = am4core.percent(80);
            series.tooltip.autoTextColor = false;
            series.sequencedInterpolation = true;
            categoryAxis.dataFields.category = seriesGroup;
            categoryAxis.tooltip.enabled = true;
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 1;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            if(mobileVer){
              categoryAxis.renderer.labels.template.disabled = true;
              valueAxis.renderer.labels.template.disabled = true;
            }else{
              categoryAxis.renderer.labels.template.disabled = disableGroup;
              valueAxis.renderer.labels.template.disabled = disableValue;
            }
            series.sequencedInterpolation = true;
            series.columns.template.strokeWidth = 0;
            series.columns.template.column.fillOpacity = 0.8;
            var hoverState = series.columns.template.column.states.create("hover");
            hoverState.properties.fillOpacity = 1;
            chart.cursor = new am4charts.XYCursor();
            if(mobileVer){
              categoryAxis.cursorTooltipEnabled = false;
              valueAxis.cursorTooltipEnabled = false;
            }
            if(colorSets==null){
              series.columns.template.adapter.add("fill", function(fill, target) {
                if(!colorarr.includes(chart.colors.getIndex(target.dataItem.index).hex)){
                colorarr.push(chart.colors.getIndex(target.dataItem.index).hex);
                }
                return chart.colors.getIndex(target.dataItem.index);
              });
            }else{
              chart.colors.list = new Array();
              $.each(colorSets,function(k,v){
                chart.colors.list.push(am4core.color(v))
              })
              series.columns.template.events.once("inited", function(event){
                event.target.fill = chart.colors.getIndex(event.target.dataItem.index);
              });
            }
            if(setLegend){
              var legend = new am4charts.Legend();
              legend.parent = chart.chartContainer;
              legend.itemContainers.template.togglable = false;
              legend.marginTop = 10;

              series.events.on("ready", function(ev) {
                var legenddata = [];
                series.columns.each(function(column,index) {
                  legenddata.push({
                    name: data[index]['alias'],
                    fill: column.fill
                  });
                });
                legend.data = legenddata;
              });
              legend.labels.template.maxWidth = $('#'+elemID).width()/gridLegend;
              legend.labels.template.truncate = true;
            }
            series.tooltip.getFillFromObject = false;
            series.tooltip.background.fill = am4core.color('#333')
            if(autoLabel){
              if(!disableValueLabel){
                var valueLabel = series.bullets.push(new am4charts.LabelBullet());
                valueLabel.label.truncate = false
                valueLabel.label.fill = am4core.color("#333");
                valueLabel.label.adapter.add("text", function(a, b) {
                  var addr = seriesGroup;
                  var result = "[bold]{"+seriesValue+".formatNumber('#.##a')}[/]";
                  if(typeof(data[0]['alias'])!='undefined'){
                    addr = 'alias'
                  }
                  if(!disableGroupLabel){
                    if(typeof(b.dataItem)!='undefined'){
                      if(chartOrient=='h'){
                        if(evalVal(data[b.dataItem.index][seriesValue],0.20)){
                          result = "[bold]{"+seriesValue+".formatNumber('#.##a')}[/] [#aaa]"+data[b.dataItem.index][addr]+"[/]";
                        }
                      }
                    }
                  }
                  return result;
                })
                switch(chartOrient){
                  case 'h':
                    valueLabel.label.horizontalCenter = "left";
                    valueLabel.label.dx = 10;
                    break;
                  case 'v':
                    valueLabel.label.verticalCenter = "bottom";
                    break;
                }
              }
              if(!disableGroupLabel){
                var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
                categoryLabel.label.truncate = false
                categoryLabel.label.fill = am4core.color("#fff");
                categoryLabel.label.adapter.add("text", function(a, b) {
                  var addr = seriesGroup;
                  if(typeof(data[0]['alias'])!='undefined'){
                    addr = 'alias'
                  }
                  if(typeof(b.dataItem)!='undefined'){
                    var result = data[b.dataItem.index][addr];
                    if(chartOrient=='h'){
                      if(evalVal(data[b.dataItem.index][seriesValue],0.20)){
                        result = "";
                      }
                    }
                  }
                  return result;
                })
                switch(chartOrient){
                  case 'h':
                    categoryLabel.label.horizontalCenter = "right";
                    categoryLabel.label.dx = -10;
                    break;
                  case 'v':
                    categoryLabel.label.verticalCenter = "top";
                    categoryLabel.label.rotation = 90;
                    categoryLabel.label.dx = 10;
                    categoryLabel.label.adapter.add("fill", function(a, b) {
                      var result = am4core.color("#fff");
                      if(typeof(b.dataItem)!='undefined'){
                        if(evalVal(data[b.dataItem.index][seriesValue],0.20)){
                          result = am4core.color("#aaa");
                        }
                      }
                      return result;
                    })
                    categoryLabel.label.adapter.add("horizontalCenter", function(a, b) {
                      var result = "left";
                      if(typeof(b.dataItem)!='undefined'){
                        if(evalVal(data[b.dataItem.index][seriesValue],0.20)){
                          result = "right";
                        }
                      }
                      return result;
                    })
                    categoryLabel.label.adapter.add("dy", function(a, b) {
                      var result = 10;
                      if(typeof(b.dataItem)!='undefined'){
                        if(evalVal(data[b.dataItem.index][seriesValue],0.20)){
                          result = -25;
                        }
                      }
                      return result;
                    })
                    break;
                }
              }
            }
            break;
          case 'pie':
            am4core.useTheme(am4themes_animated);
            var chart = am4core.create(elemID, am4charts.PieChart);
            chart.data = data;
            var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = seriesValue;
            pieSeries.dataFields.category = seriesGroup;
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
              if (target.dataItem && (target.dataItem.values.value.percent < 2)) {
                return am4core.color("#000");
              }
              return color;
            });
            pieSeries.sequencedInterpolation = true;
            pieSeries.slices.alwaysShowTooltip = true;
            pieSeries.tooltip.getFillFromObject = false;
            pieSeries.tooltip.background.fill = am4core.color('#333')
            pieSeries.slices.template.adapter.add("fill", function(fill, target) {
              if(!colorarr.includes(chart.colors.getIndex(target.dataItem.index).hex)){
                colorarr.push(chart.colors.getIndex(target.dataItem.index).hex);
              }
              return chart.colors.getIndex(target.dataItem.index);
            });
            var grouper = pieSeries.plugins.push(new am4plugins_sliceGrouper.SliceGrouper());
            grouper.threshold = 5;
            grouper.groupName = "Lainnya (Klik untuk lihat)";
            grouper.clickBehavior = "zoom";
            var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
            shadow.opacity = 0;
            var hoverState = pieSeries.slices.template.states.getKey("hover");
            var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
            hoverShadow.opacity = 0.7;
            hoverShadow.blur = 5;
            break;
          }
          if(bigNumber){
            chart.numberFormatter.numberFormat = "#.##a";
            chart.numberFormatter.bigNumberPrefixes = bigNumberArr;
          }
          chart.exporting.menu = new am4core.ExportMenu();
          chart.exporting.getFormatOptions("pdf").addURL = false;
          chart.exporting.menu.container = document.getElementById("printMenu_"+elemID);
        setTimeout(function(){
          $('#printMenu_'+elemID+'>ul').css({
            'top':'unset',
            'left':'unset',
            'position':'absolute',
            'width':'100%'
          })
          $('#printMenu_'+elemID+'>ul>li').css({
            'background':'rgba(0,0,0,0)',
            'width':'100%'
          })
          $('#printMenu_'+elemID+'>ul>li>a').css({
            'color':'rgba(0,0,0,0)'
          })
          $('#printMenu_'+elemID).append('<i class="fas fa-print"></i>')
          $('#btncon_'+elemID).css({
            'bottom':'calc('+($('#'+elemID).height()-$('#btncon_'+elemID).height())+'px + '+(setLegend?(($('#btncon_'+elemID).height()/2)*1.2)+'px':'12%')+')',
          })
          $('#btncon_'+elemID).hover(function(){
            $(this).css('opacity',1)
          },function(){
            $(this).css('opacity',0.5)
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
            callback(colorarr);
          }
        },500);
    });
  }else{
    console.log('Missing Amcharts Plugin')
    return false;
  }
  function evalVal(val,tolerance){
    var result = false;
    if((parseFloat(val)/sumData)<tolerance&&parseFloat(val)<(avgData*(1-tolerance))){
      result = true;
    }
    return result;
  }
}
function makeChartsMulti(elemID,data,seriesSetup,options,callback){
  var returnObject = new Object();
  var defobj = {
    mobileVer : false,
    setLegend : false,
    gridLegend : 2,
    buttonClass : 'blue',
    colorSets:null,
    autoLegend:true,
    animate:true,
    exportButtonInside:false,
  }
  $.each(defobj,function(k,v){
    if(typeof(options[k])=='undefined'){
      options[k] = v;
    }
  })
  am4core.ready(function(){
    var buttonClass = options.buttonClass;
    var mobileVer = options.mobileVer;
    var setLegend = options.setLegend;
    var gridLegend = options.gridLegend;
    var colorSets = options.colorSets;
    var colorarr = new Array();
    var autoLegend = options.autoLegend;
    var animate = options.animate;
    var exportButtonInside = options.exportButtonInside;
    var btnCon = `
    <div class="row center-xs nomb" id="btncon_`+elemID+`" style="position:relative;bottom:0;left:0;z-index:2;width:50px;opacity:0.5;`+(mobileVer?'width:6rem;':'')+`">
      <div id="printMenu_`+elemID+`" class="btn `+buttonClass+` fullw col-xs-12 nombi row center-xs middle-xs" `+(mobileVer?'style="margin-top:8px"':'')+`>
      </div>
    </div>
    `
    $('#'+elemID).after(btnCon)
    $('#btncon_'+elemID).css('left','calc(50% - '+($('#btncon_'+elemID).width()*1.2)+'px)');
    if(animate){
      am4core.useTheme(am4themes_animated);
    }
    var chart = am4core.create(elemID, am4charts.XYChart);
    chart.data = data;
    chart.cursor = new am4charts.XYCursor();
    var bigNumberArr = [
      { "number": 1e+6, "suffix": " Jt" },
      { "number": 1e+9, "suffix": " M" },
      { "number": 1e+12, "suffix": " T" }
    ]
    if(colorSets!==null){
      var colorSetsarr = new Array();
      $.each(colorSets,function(k,v){
        colorSetsarr.push(am4core.color(v))
      })
      if(colorSetsarr){
        chart.colors.list = colorSetsarr
      }
    }
    chart.numberFormatter.numberFormat = "#.##a";
    chart.numberFormatter.bigNumberPrefixes = bigNumberArr;
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.getFormatOptions("pdf").addURL = false;
    chart.exporting.menu.container = document.getElementById("printMenu_"+elemID);
    if(setLegend){
      var legend = new am4charts.Legend();
      legend.parent = chart.chartContainer;
      legend.itemContainers.template.togglable = true;
      legend.marginTop = 10;
      legend.labels.template.maxWidth = $('#'+elemID).width()/gridLegend;
      legend.labels.template.truncate = true;
      var legenddata = [];
    }
    var mainXAxis = null
    var mainYAxis = null
    var chartAxes = new Object();
    var seriesCount = 0;
    $.each(seriesSetup,function(k,v){
      drawSeries(v)
    })
    if(setLegend){
      var setLegendItr = setInterval(function(){
        if(seriesCount==seriesSetup.length){
          clearInterval(setLegendItr);
          legend.data = legenddata;
        }
      },500)
    }
    function makeAxis(options){
      var defobjAxis = {
        maxAxis:null,
        textAxis:null,
        minGrid:30,
        maxGrid:60,
        oppositeAxis:false,
        groupDate:false,
        groupX:false,
        groupY:false,
      }
      $.each(defobjAxis,function(k,v){
        if(typeof(options[k])=='undefined'){
          options[k] = v;
        }
      })
      var maxAxis = options.maxAxis;
      var textAxis = options.textAxis;
      var minGrid = options.minGrid;
      var maxGrid = options.maxGrid;
      var oppositeAxis = options.oppositeAxis
      var modeAxis = options.modeAxis;
      var typeAxis = options.typeAxis;
      var groupX = options.groupX;
      var groupY = options.groupY;
      var groupDate = options.groupDate;
      if(typeof(groupDate)=='string'){
        groupDate = [groupDate]
      }
      var chartAxis = null;
      var tempAxis = null;
      switch(typeAxis){
        case 'VALUE':
          tempAxis = new am4charts.ValueAxis();
          break;
        case 'DATE':
          tempAxis = new am4charts.DateAxis();
          break;
        case 'CATEGORY':
          tempAxis = new am4charts.CategoryAxis();
          break;
      }
      switch(modeAxis){
        case 'Y':
          chartAxis = chart.yAxes.push(tempAxis);
          break;
        case 'X':
          chartAxis = chart.xAxes.push(tempAxis);
          break;
      }
      if(maxAxis){
        chartAxis.max = maxAxis;
        chartAxis.strictMinMax = true;
      }
      if(textAxis){
        var getSup = textAxis.match(/&sup.;/g);
        $.each(getSup,function(k,v){
          var mainsup = v.substr(4,1);
          var regex = new RegExp(v,'g')
          textAxis = textAxis.replace(regex,"[baseline-shift:super;]"+mainsup+"[/]");
        })
        var getSub = textAxis.match(/&sub.;/g)
        $.each(getSub,function(k,v){
          var mainsub = v.substr(4,1);
          var regex = new RegExp(v,'g');
          textAxis.replace(new RegExp(v)+"g","[baseline-shift:sub;]"+mainsub+"[/]");
        })
        getSup = textAxis.match(/<sup>[^]*<\/sup>/g);
        $.each(getSup,function(k,v){
          var mainsup = v.substr(5,v.length-11);
          var regex = new RegExp(v,'g')
          textAxis = textAxis.replace(regex,"[baseline-shift:super;]"+mainsup+"[/]");
        })
        getSub = textAxis.match(/<sub>[^]*<\/sub>/g);
        $.each(getSub,function(k,v){
          var mainsub = v.substr(5,v.length-11);
          var regex = new RegExp(v,'g')
          textAxis = textAxis.replace(regex,"[baseline-shift:sub;]"+mainsub+"[/]");
        })
        chartAxis.title.text = textAxis;
        if(modeAxis=="Y"){
          if(oppositeAxis){
            chartAxis.title.marginRight = 10;
          }else{
            chartAxis.title.marginLeft = 10;
          }
        }else{
          if(oppositeAxis){
            chartAxis.title.marginBottom = 10;
          }else{
            chartAxis.title.marginTop = 10;
          }
        }
      }
      chartAxis.renderer.minGridDistance = minGrid;
      chartAxis.renderer.maxGridDistance = maxGrid;
      chartAxis.renderer.line.strokeWidth = 2;
      chartAxis.renderer.line.strokeOpacity = 1;
      if(groupX!==false&&modeAxis=="X"){
        chartAxis.groupData = true
        chartAxis.groupCount = groupX
      }
      if(groupY!==false&&modeAxis=="Y"){
        chartAxis.groupData = true
        chartAxis.groupCount = groupY
      }
      if(oppositeAxis){
        chartAxis.renderer.opposite = true;
      }else{
        chartAxis.renderer.opposite = false;
      }
      if(typeof(returnObject.axis)!='undefined'){
        if(typeof(returnObject.axis[modeAxis])!='undefined'){
          if((Object.keys(returnObject.axis[modeAxis])).length>0){
            chartAxis.syncWithAxis = returnObject.axis[modeAxis][(Object.keys(returnObject.axis[modeAxis]))[0]]
          }
        }
      }
      if(groupDate!==false&&typeAxis=='DATE'){
        $.each(groupDate,function(kG,vG){
          var rangeStyleV = null;
          var rangeRes = null;
          var groupDateV = vG.setup
          if(typeof(vG.style)!='undefined'){
            rangeStyleV = vG.style
          }
          groupDateV = groupDateV.split("|")
          if(typeof(moment)=='function'){
            var topPad = 10;
            if(groupDateV[0]!='custom'){
              var itr = moment(groupDateV[2],"YYYY-MM-DD").diff(moment(groupDateV[1],"YYYY-MM-DD"),groupDateV[0])
              if(typeof(groupDateV[3])!='undefined'){
                if(groupDateV[3]!=""){
                  topPad = groupDateV[3];
                }
              }
              for(var fitr = 0; fitr<=itr; fitr++){
                var groupAliasFormat = "YYYY-MM-DD HH:MM:SS";
                var groupAliasPrefix = "";
                var groupAliasSuffix = "";
                switch(groupDateV[0]){
                  case 'year':
                    groupAliasFormat = "YYYY";
                    break;
                  case 'week':
                    groupAliasFormat = "W";
                    break;
                  case 'month':
                    groupAliasFormat = "MMM";
                    break;
                }
                var groupDateVLabelD = moment(groupDateV[1],"YYYY-MM-DD").add(fitr,groupDateV[0]).startOf(groupDateV[0]).format(groupAliasFormat)
                if(groupDateV[0]=='week'){
                  groupDateVLabelD = romanize(groupDateVLabelD)
                }
                var groupDateVLabel = groupAliasPrefix+groupDateVLabelD+groupAliasSuffix
                rangeRes = createRange(moment(groupDateV[1],"YYYY-MM-DD").add(fitr,groupDateV[0]).startOf(groupDateV[0])._d,moment(groupDateV[1],"YYYY-MM-DD").add(fitr,groupDateV[0]).endOf(groupDateV[0])._d,groupDateVLabel,topPad)
                if(rangeStyleV!=null){
                  recStyle(rangeRes,rangeStyleV)
                }
              }
            }else{
              if(typeof(groupDateV[1])!='undefined'){
                if(groupDateV[1]!=""){
                  topPad = groupDateV[1];
                }
              }
              var customRange = new Array();
              if(typeof(groupDateV[2])!='undefined'){
                if(groupDateV[2]!=""){
                  customRange = groupDateV[2].split(";");
                }
              }
              $.each(customRange,function(kC,vC){
                var tss = vC.split("/")[0];
                var tse = vC.split("/")[1];
                var groupDateVLabel = vC.split("/")[2];
                rangeRes = createRange(moment(tss,"YYYY-MM-DD")._d,moment(tse,"YYYY-MM-DD")._d,groupDateVLabel,topPad)
                if(rangeStyleV!=null){
                  if(rangeStyleV.length>0){
                    recStyle(rangeRes,rangeStyleV[kC])
                  }else{
                    recStyle(rangeRes,rangeStyleV)
                  }
                }
              })
            }
            chartAxis.renderer.labels.template.adapter.add('text',function(a,b){
              return null;
            })
            chartAxis.renderer.grid.template.adapter.add('disabled',function(a,b){
              return true;
            })
          }else{
            console.log("Require Moment JS")
          }
        })
        function createRange(from, to, label,topPadding) {
          var range = chartAxis.axisRanges.create();
          range.date = from;
          range.endDate = to;
          range.label.text = label;
          range.label.paddingTop = topPadding;
          range.label.location = 0.5;
          range.label.horizontalCenter = "middle";
          range.label.fontWeight = "bolder";
          range.grid.disabled = false;
          return range;
        }
      }
      // chartAxis.events.on('ready',function(ev){
      //   if(typeof(returnObject.axis)=='undefined'){
      //     returnObject.axis = new Object();
      //   }
      //   if(typeof(returnObject.axis[modeAxis])=='undefined'){
      //     returnObject.axis[modeAxis] = new Array();
      //   }
      //   returnObject.axis[modeAxis].push(chartAxis)
      // })
      return chartAxis;
    }
    function drawSeries(options){
      var defobjSeries = {
        sameAxis : "X|Y",
        type : 'line',
        disableXAxis : false,
        disableYAxis : false,
        disableXGrid : false,
        disableYGrid : false,
        disableBullet : true,
        textXAxis : null,
        textYAxis : null,
        groupDate : false,
        fillAxis : null,
        style:null,
        maxAxis:null,
        preHide:false,
        groupX:false,
        groupY:false,
        colWidth:false,
        customTooltip:false,
      }
      $.each(defobjSeries,function(k,v){
        if(typeof(options[k])=='undefined'){
          options[k] = v;
        }
      })
      var xType = options.x
      var yType = options.y
      var seriesValue = options.val
      var seriesGroup = options.grp
      var seriesType = options.type
      var sameAxis = options.sameAxis.split("|")
      var seriesXAxis = null
      var seriesYAxis = null
      var disableXAxis = options.disableXAxis
      var disableYAxis = options.disableYAxis
      var disableXGrid = options.disableXGrid
      var disableYGrid = options.disableYGrid
      var textXAxis = options.textXAxis
      var textYAxis = options.textYAxis
      var disableBullet = options.disableBullet
      var groupDate = options.groupDate
      var seriesName = options.name
      var seriesStyle = options.style
      var fillAxis = options.fillAxis
      var maxAxis = options.maxAxis
      var preHide = options.preHide
      var groupX = options.groupX
      var groupY = options.groupY
      var colWidth = options.colWidth
      var customTooltip = options.customTooltip
      var tgtaxisX = false
      var tgtaxisY = false
      if(mainXAxis==null){
        mainXAxis = makeAxis({modeAxis:'X',typeAxis:xType,groupDate:groupDate,textAxis:textXAxis,maxAxis:maxAxis,groupX:groupX,groupY:groupY})
        chartAxes[seriesGroup] = mainXAxis
      }
      if(mainYAxis==null){
        mainYAxis = makeAxis({modeAxis:'Y',typeAxis:yType,groupDate:groupDate,textAxis:textYAxis,maxAxis:maxAxis,groupX:groupX,groupY:groupY})
        chartAxes[seriesValue] = mainYAxis
      }
      if(sameAxis.includes("X")){
        seriesXAxis = mainXAxis
      }else{
        $.each(sameAxis,function(k,v){
          if(v.includes('X:')){
            var tgtaxisarr = (v.split(':'))
            if(tgtaxisarr.length>1){
              tgtaxisX = tgtaxisarr[1];
              seriesXAxis = chartAxes[tgtaxisX];
            }
          }
        })
      }
      if(sameAxis.includes("Y")){
        seriesYAxis = mainYAxis
      }else{
        $.each(sameAxis,function(k,v){
          if(v.includes('Y:')){
            var tgtaxisarr = (v.split(':'))
            if(tgtaxisarr.length>1){
              tgtaxisY = tgtaxisarr[1];
              seriesYAxis = chartAxes[tgtaxisY];
            }
          }
        })
      }
      if(seriesXAxis==null){
        seriesXAxis = makeAxis({modeAxis:'X',typeAxis:xType,groupDate:groupDate,textAxis:textXAxis,maxAxis:maxAxis,groupX:groupX,groupY:groupY})
      }
      if(seriesYAxis==null){
        seriesYAxis = makeAxis({modeAxis:'Y',typeAxis:yType,groupDate:groupDate,textAxis:textYAxis,maxAxis:maxAxis,groupX:groupX,groupY:groupY})
      }
      chartAxes[seriesGroup] = seriesXAxis
      chartAxes[seriesValue] = seriesYAxis
      if(typeof(returnObject.axis)=='undefined'){
        returnObject.axis = new Object();
      }
      if(typeof(returnObject.axis.X)=='undefined'){
        returnObject.axis.X = new Object();
      }
      var addrX = (tgtaxisX===false?seriesGroup:tgtaxisX)
      if(typeof(returnObject.axis.X[addrX])=='undefined'){
        returnObject.axis.X[addrX] = seriesXAxis
      }
      if(typeof(returnObject.axis.Y)=='undefined'){
        returnObject.axis.Y = new Object();
      }
      var addrY = (tgtaxisY===false?seriesValue:tgtaxisY)
      if(typeof(returnObject.axis.Y[addrY])=='undefined'){
        returnObject.axis.Y[addrY] = seriesYAxis
      }
      var tempSeries = null;
      var barsplit = seriesType.split('-')
      var barstacked = false
      var barpercent = false
      if(barsplit.includes('bar')){
        var seriesType = 'bar'
        if(barsplit.includes('stacked')){
          barstacked = true
        }
        if(barsplit.includes('percent')){
          barpercent = true
        }
      }
      switch(seriesType){
        case 'line':
          tempSeries = new am4charts.LineSeries()
          break;
        case 'bar':
          tempSeries = new am4charts.ColumnSeries()
          break;
      }
      var series = chart.series.push(tempSeries);
      switch(xType){
        case 'VALUE':
          series.dataFields.valueX = seriesGroup;
          break;
        case 'DATE':
          series.dataFields.dateX = seriesGroup;
          break;
        case 'CATEGORY':
          series.dataFields.categoryX = seriesGroup;
          seriesXAxis.dataFields.valueX = seriesGroup;
          seriesXAxis.dataFields.category = seriesGroup;
          break;
      }
      switch(yType){
        case 'VALUE':
          series.dataFields.valueY = seriesValue;
          break;
        case 'DATE':
          series.dataFields.dateY = seriesValue;
          break;
        case 'CATEGORY':
          series.dataFields.categoryY = seriesValue;
          seriesYAxis.dataFields.valueY = seriesValue;
          seriesYAxis.dataFields.category = seriesValue;
          break;
      }
      series.yAxis = seriesYAxis;
      series.xAxis = seriesXAxis;
      if(customTooltip!==false){
        customTooltip = customTooltip.replace(/VvalV/g,seriesValue)
        customTooltip = customTooltip.replace(/VnameV/g,seriesName)
        series.tooltipText = customTooltip;
      }else{
        series.tooltipText = "{"+seriesValue+".formatNumber(#)}";
      }
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#333')
      if(seriesType=='bar'&&colWidth!==false){
        series.columns.template.width = am4core.percent(colWidth)
      }
      if(seriesYAxis.renderer.labels.template.disabled!=true){
        seriesYAxis.renderer.labels.template.disabled = disableYAxis;
      }
      if(disableYAxis){
        seriesYAxis.renderer.line.strokeOpacity = 0
      }
      if(seriesXAxis.renderer.labels.template.disabled!==true){
        seriesXAxis.renderer.labels.template.disabled = disableXAxis;
      }
      if(disableXAxis){
        seriesXAxis.renderer.line.strokeOpacity = 0
      }
      if(seriesYAxis.renderer.grid.template.disabled!==true){
        seriesYAxis.renderer.grid.template.disabled = disableYGrid;
      }
      if(seriesXAxis.renderer.grid.template.disabled!==true){
        seriesXAxis.renderer.grid.template.disabled = disableXGrid;
      }
      series.showOnInit = animate;
      series.name = seriesName;
      series.hidden = preHide;
      switch(seriesType){
        case 'bar':
          if(barstacked||barpercent){
            series.stacked = true
          }
          if(barpercent){
            series.dataFields.valueYShow = "totalPercent"
            seriesYAxis.min = 0;
            seriesYAxis.max = 100;
            seriesYAxis.strictMinMax = true;
            seriesYAxis.calculateTotals = true;
          }
          break;
        case 'line':
          var bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = am4core.color("#fff");
          bullet.circle.strokeWidth = 2;
          series.strokeWidth = 2;
          if(disableBullet){
            bullet.circle.disabled = true;
          }
          if(fillAxis!==null){
            if(fillAxis=='X'){
              series.baseAxis = seriesXAxis
            }else if(fillAxis=='Y'){
              series.baseAxis = seriesYAxis
            }else{

            }
            series.fillOpacity = 1;
          }
          break;
      }
      chart.events.on('ready',function(ev){
        if(seriesStyle!==null){
          $.each(seriesStyle,function(k,v){
            switch(k){
              case 'series':
                recStyle(series,v)
                break;
              case 'seriesXAxis':
                recStyle(seriesXAxis,v)
                break;
            }
          })
        }
        if(setLegend){
          switch(seriesType){
            case 'bar':
              legenddata.push({
                name: series.name,
                fill: series.fill
              });
              break;
            case 'line':
              legenddata.push({
                name: series.name,
                fill: series.stroke
              });
              break;
          }
          seriesCount++
        }
      })
      // if(setLegend){
      // series.events.on("ready", function(ev) {
      //   legenddata.push({
      //     name: series.name,
      //     fill: series.fill
      //   });
      //   seriesCount++
      // });
      // }
      // if(seriesStyle!==null){
      //   chart.events.on('ready',function(ev){
      //     $.each(seriesStyle,function(k,v){
      //       switch(k){
      //         case 'series':
      //           recStyle(series,v)
      //           break;
      //         case 'seriesXAxis':
      //           recStyle(seriesXAxis,v)
      //           break;
      //       }
      //     })
      //   })
      // }
      series.events.on('ready',function(ev){
        if(typeof(returnObject.series)=='undefined'){
          returnObject.series = new Object();
        }
        returnObject.series[seriesName] = series
      })
    }
    function recStyle(obj,arr){
      $.each(arr,function(k,v){
        if(k.substr(0,1)=="_"){
          var key = k.substr(1,k.length)
          if(typeof(obj[key])!='undefined'){
            recStyle(obj[key],v)
          }
        }else{
          var valStyle = v
          if(typeof(v)=="string"){
            if(v.substr(0,1)=="#"){
              valStyle = am4core.color(v)
            }
          }
          obj[k] = valStyle
        }
      })
    }
    chart.events.on('ready',function(ev){
      if(autoLegend){
        chart.legend = new am4charts.Legend();
      }
      $('#printMenu_'+elemID+'>ul').css({
        'top':'unset',
        'left':'unset',
        'position':'absolute',
        'width':'100%'
      })
      $('#printMenu_'+elemID+'>ul>li').css({
        'background':'rgba(0,0,0,0)',
        'width':'100%'
      })
      $('#printMenu_'+elemID+'>ul>li>a').css({
        'color':'rgba(0,0,0,0)'
      })
      $('#printMenu_'+elemID).append('<i class="fas fa-print"></i>')
      $('#btncon_'+elemID).css({
        'bottom':'calc('+($('#'+elemID).height()-$('#btncon_'+elemID).height())+'px + '+(setLegend?(($('#btncon_'+elemID).height()/2)*0.5)+'px':'0%')+')',
      })
      $('#btncon_'+elemID).hover(function(){
        $(this).css('opacity',1)
      },function(){
        $(this).css('opacity',0.5)
      })
      $.each(chart.colors.list,function(k,v){
        colorarr.push(v.hex)
      })
      if(exportButtonInside){
        $('#btncon_'+elemID).css({
          left:"calc(100% - 110px)",
          bottom:"calc(100% - 18px)"
        })
        $("#"+elemID).append($('#btncon_'+elemID))
      }
      if(typeof(callback)=='function'){
        returnObject.colors = colorarr
        returnObject.chart = chart
        if(setLegend){
          returnObject.legend = legend
        }
        callback(returnObject)
      }
    })
  })
}
function removeCharts(elemID){
  if(typeof(am4core)!='undefined'){
    $('#btncon_'+elemID).remove();
    $.each(am4core.registry.baseSprites,function(k,v){
      if(typeof(v)!='undefined'){
        if(typeof(v.htmlContainer)!='undefined'){
          if(typeof(v.htmlContainer.id)!='undefined'){
            if(v.htmlContainer.id==elemID){
              v.dispose();
            }
          }
        }
      }
    })
  }else{
    console.log('Missing Amcharts Plugin')
    return false;
  }
}
function generateColor(options,callback){
  var defobj = {
    classCount : 5,
    colorOrder : 'DESC',
    data : null
  }
  $.each(defobj,function(k,v){
    if(typeof(options[k])=='undefined'){
      options[k] = v;
    }
  })
  var classCount = options.classCount;
  var data = options.data;
  var colorOrder = options.colorOrder;
  var url = "http://colormind.io/api/";
  var defaultdata = false;
  if(data==null){
    data = {
      model : "default"
    }
    defaultdata = true;
  }
  var goreturn = false;
  var http = new XMLHttpRequest();
  var palette = new Array();
  var input = new Array();
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      var resarr = JSON.parse(http.responseText).result;
      $.each(resarr,function(k,v){
        if(k<2){
          input.push(v)
        }else{
          input.push("N")
        }
        if(defaultdata){
          palette.push(v)
        }else{
          if(k>1){
            palette.push(v)
          }
        }
      })
      goreturn = true;
      classCount -= 5;
    }
  }

  http.open("POST", url, true);
  http.send(JSON.stringify(data));
  var fcItr = setInterval(function(){
    if(goreturn){
      clearInterval(fcItr);
      if(classCount<=0){
        if(typeof(callback)=='function'){
          callback(sortPalette(palette,colorOrder))
        }
      }else{
        data.input = input;
        generateColor({
          classCount:classCount,
          data:data,
          colorOrder:colorOrder
        },function(c){
          pushEuc(c)
          if(classCount<=0){
            if(typeof(callback)=='function'){
              callback(sortPalette(palette,colorOrder))
            }
          }else{
            IterategenerateColor()
            var getNewSet = setInterval(function(){
              if(classCount<=0){
                clearInterval(getNewSet);
                if(typeof(callback)=='function'){
                  callback(sortPalette(palette,colorOrder))
                }
              }
            },500)
          }
        })
      }
    }
  },500)
  function IterategenerateColor(){
    generateColor({
      classCount:classCount
    },function(c){
      pushEuc(c)
      if(classCount>0){
        IterategenerateColor()
      }
    })
  }
  function pushEuc(c){
    for(var i=0;i<classCount;i++){
      var sumEuc = 0;
      $.each(palette,function(k,v){
        var vEuc = eucDis(v,c[i])
        sumEuc += vEuc
      })
      if((sumEuc/palette.length)>=80){
        classCount --;
        palette.push(c[i])
      }
    }
  }
  function eucDis(v1, v2){
    var i
    var d = 0
    for (i = 0; i < v1.length; i++) {
      d += (v1[i] - v2[i])*(v1[i] - v2[i]);
    }
    return Math.sqrt(d);
  }
  function sortPalette(palette,order){
    var result = new Array();
    var euc = new Array();
    var reff
    switch(order){
      case 'DESC':
        reff = [255,255,255]
        break;
      case 'ASC':
        reff = [0,0,0]
        break;
    }
    $.each(palette,function(k,v){
      var eucV = eucDis(v,reff)
      v.euc = eucV
      result.push(v)
    })
    result.sort(function(a,b){return a.euc-b.euc})
    return result;
  }
}
function generateScheme(options,callback){
  if(typeof(options)=='function'){
    callback = options
    options = new Object();
  }
  var defobj = {
    input : "0000FF",
    mode : 'analogic-complement',
    count : 5
  }
  $.each(defobj,function(k,v){
    if(typeof(options[k])=='undefined'){
      options[k] = v;
    }
  })
  var inputScheme = options.input,
      modeScheme = options.mode,
      countScheme = options.count,
      result = new Array(),
      procGet = false
  $.get("https://www.thecolorapi.com/scheme",{
    hex:inputScheme,
    mode:modeScheme,
    count:countScheme,
    format:'json'
  },function(r){
    $.each(r.colors,function(k,v){
      var temp = [v.rgb.r,v.rgb.g,v.rgb.b];
      result.push(temp)
    })
    procGet = true;
  },'json')
  var iterateGet = setInterval(function(){
    if(procGet){
      clearInterval(iterateGet);
      if(typeof(callback)=='function'){
        callback(result)
      }
    }
  },500)
}
