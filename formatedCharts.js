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
                        if(evalVal(data[b.dataItem.index][seriesValue],0.10)){
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
                      if(evalVal(data[b.dataItem.index][seriesValue],0.10)){
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
                        if(evalVal(data[b.dataItem.index][seriesValue],0.10)){
                          result = am4core.color("#aaa");
                        }
                      }
                      return result;
                    })
                    categoryLabel.label.adapter.add("horizontalCenter", function(a, b) {
                      var result = "left";
                      if(typeof(b.dataItem)!='undefined'){
                        if(evalVal(data[b.dataItem.index][seriesValue],0.10)){
                          result = "right";
                        }
                      }
                      return result;
                    })
                    categoryLabel.label.adapter.add("dy", function(a, b) {
                      var result = 10;
                      if(typeof(b.dataItem)!='undefined'){
                        if(evalVal(data[b.dataItem.index][seriesValue],0.10)){
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
  var defobj = {
    mobileVer : false,
    setLegend : true,
    gridLegend : 2,
    buttonClass : 'blue',
    colorSets:null,
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
    var btnCon = `
    <div class="row center-xs nomb" id="btncon_`+elemID+`" style="position:relative;bottom:0;left:0;z-index:2;width:50px;opacity:0.5;`+(mobileVer?'width:6rem;':'')+`">
      <div id="printMenu_`+elemID+`" class="btn `+buttonClass+` fullw col-xs-12 nombi row center-xs middle-xs" `+(mobileVer?'style="margin-top:8px"':'')+`>
      </div>
    </div>
    `
    $('#'+elemID).after(btnCon)
    $('#btncon_'+elemID).css('left','calc(50% - '+($('#btncon_'+elemID).width()*1.2)+'px)');
    am4core.useTheme(am4themes_animated);
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
      legend.itemContainers.template.togglable = false;
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
        chartAxis.title.text = textAxis;
      }
      chartAxis.renderer.minGridDistance = minGrid;
      chartAxis.renderer.maxGridDistance = maxGrid;
      if(oppositeAxis){
        chartAxis.renderer.grid.template.disabled = true;
        chartAxis.renderer.opposite = true;
      }
      return chartAxis;
    }
    function drawSeries(options){
      var defobjSeries = {
        sameAxis : "X|Y",
        type : 'line',
        disableXAxis : false,
        disableYAxis : false,
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
      var seriesName = options.name
      if(mainXAxis==null){
        mainXAxis = makeAxis({modeAxis:'X',typeAxis:xType})
        chartAxes[seriesGroup] = mainXAxis
      }
      if(mainYAxis==null){
        mainYAxis = makeAxis({modeAxis:'Y',typeAxis:yType})
        chartAxes[seriesValue] = mainYAxis
      }
      if(sameAxis.includes("X")){
        seriesXAxis = mainXAxis
      }else{
        $.each(sameAxis,function(k,v){
          if(v.includes('X:')){
            var tgtaxisarr = (v.split(':'))
            if(tgtaxisarr.length>1){
              var tgtaxis = tgtaxisarr[1];
              seriesXAxis = chartAxes[tgtaxis];
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
              var tgtaxis = tgtaxisarr[1];
              seriesYAxis = chartAxes[tgtaxis];
            }
          }
        })
      }
      if(seriesXAxis==null){
        seriesXAxis = makeAxis({modeAxis:'X',typeAxis:xType})
      }
      if(seriesYAxis==null){
        seriesYAxis = makeAxis({modeAxis:'Y',typeAxis:yType})
      }
      chartAxes[seriesGroup] = seriesXAxis
      chartAxes[seriesValue] = seriesYAxis
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
      series.tooltipText = "{"+seriesValue+".formatNumber(#)}";
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fill = am4core.color('#333')
      seriesYAxis.renderer.labels.template.disabled = disableYAxis;
      seriesXAxis.renderer.labels.template.disabled = disableXAxis;
      series.name = seriesName;
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
          break;
      }
      if(setLegend){
      series.events.on("ready", function(ev) {
        legenddata.push({
          name: series.name,
          fill: series.fill
        });
        seriesCount++
      });
      }
    }
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
      if(typeof(callback)=='function'){

        callback(colorarr)
      }
    },500)
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
