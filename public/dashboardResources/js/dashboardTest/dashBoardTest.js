/*
* @author Manuel Lopez Jaguey
*/

$(function() {
  var tokenSession = localStorage.getItem('AUTH-TOKEN');
  if(tokenSession!=undefined && tokenSession!=null && tokenSession!=""){
    calendar.initialize();
    getStates();
  }
});

/*
  listen change period buttons and update all charts
 */
$( ".boton-period-date" ).click(function() {
  $(".boton-period-selected").removeClass("boton-period-selected");
  $(this).addClass("boton-period-selected");
  
  let period = $(this).attr("data-val");
  let date = dateUtil.stringToDate($("#fechaFin").val());

  if(period=="week"){
    date.setDate(date.getDate()-7);
    $("#fechaIni").val(dateUtil.dateToString(date));

  } else if(period=="month"){
    date.setMonth(date.getMonth()-1);
    $("#fechaIni").val(dateUtil.dateToString(date));

  } else if(period=="threeMonth"){
    date.setMonth(date.getMonth()-3);
    $("#fechaIni").val(dateUtil.dateToString(date));

  } else {
    $("#fechaIni").val("2020-01-01");
    $("#fechaFin").val(dateUtil.dateToString(new Date()));
  }
  updateDashboard();
});

/*
  listen change date init and update all charts
 */
$('#fechaIni').change(function() {
  updateDashboard();

  $( ".boton-period-selected" ).each(function( index ) {
    $(this).removeClass("boton-period-selected");
  });
});

/*
  listen change date end and update all charts
 */
$('#fechaFin').change(function() {
  updateDashboard();

  $( ".boton-period-selected" ).each(function( index ) {
    $(this).removeClass("boton-period-selected");
  });
});

/*
  listen change select states and update municipalities
*/
$( "#estados" ).change(function() {
  getMunicipalities($("#estados").val());
});

/*
  listen change select municipalities and update suburbs
*/
$( "#municipio" ).change(function() {
  getSuburbs($("#estados").val(), $("#municipio").val());
});

/*
  listen change select suburbs and update dashboard
*/
$( "#alcaldia" ).change(function() {
  updateDashboard();
});

/*
  update all dashboard (Risk level chart, Age chart and Gender chart)
*/
function updateDashboard(){
  calendar.updateRules();
  riskLevelChart.updateChart();
  ageChart.updateChart();
}

/*
  get states and initialize state CDMX
*/
function getStates(){
  clearStates();

  $.ajax({
    url: API_URL+"/admins/states", 
    success: function(result){
      result.forEach(element => 
        $('#estados').append($("<option></option>").attr("value",element.id).text(element.name)) 
      );
    },
    complete: function(){
      $("#estados").change();
    }
  });
}

/*
  get municipalities and update dashboard
*/
function getMunicipalities(idState){
  clearMunicipalities();
  
  if(idState!=undefined && idState!=""){
    $.ajax({
      url: API_URL+"/admins/states/"+idState+"/municipalities", 
      success: function(result){
        result.forEach(element => 
          $('#municipio').append($("<option></option>").attr("value",element.id).text(element.name))
        );
        updateDashboard();
      }
    });
  } else {
    updateDashboard();
  }
}

/*
  get suburbs and update dashboard
*/
function getSuburbs(idEstado, idMunicipio){
  clearSuburbs();

  if(idEstado!=undefined && idEstado!="" && idMunicipio!=undefined && idMunicipio!=""){
    $.ajax({
      url: API_URL+"/admins/states/"+idEstado+"/municipalities/"+idMunicipio+"/suburbs", 
      success: function(result){
        result.forEach(element => 
          $('#alcaldia').append($("<option></option>").attr("value",element.id).text(element.name)) 
        );
        updateDashboard();
      }
    });
  } else {
    updateDashboard();
  }
}

/*
  Clear select suburbs
*/
function clearSuburbs(){
  $('#alcaldia option').each(function() {
    $(this).remove();
  });
  $('#alcaldia').append($("<option></option>").attr("value","").text("Todas las colonias o asentamientos"));
}

/*
  Clear select municipalities
*/
function clearMunicipalities(){
  $('#municipio option').each(function() {
    $(this).remove();
  });
  $('#municipio').append($("<option></option>").attr("value","").text("Todos los Municipios / Alcaldías"));
  clearSuburbs();
}

/*
  Clear select states
*/
function clearStates(){
  $('#estados option').each(function() {
    $(this).remove();
  });
  $('#estados').append($("<option></option>").attr("value","").text("Todos los estados"));
  clearMunicipalities();
}


var calendar = {
  /*
    initialize calendar
  */
 initialize: function (){
    let today = new Date();

    $(".lastUpgrade").html("Última actualización: " + today.toLocaleDateString("es", {year: "numeric", month: "long",day: "numeric",}));
    $('#fechaFin').val(dateUtil.dateToString(today));
    
    let initDate = new Date();
    initDate.setDate(initDate.getDate()-7);
    $('#fechaIni').val(dateUtil.dateToString(initDate));

    calendar.updateRules();
  },

  /*
    update calendar rules
  */
 updateRules: function (){
    let dateInit = $("#fechaIni").val();
    let dateEnd = $("#fechaFin").val();

    $('#fechaIni').attr("max", dateEnd);
    
    $('#fechaFin').attr("min", dateInit);
    $('#fechaFin').attr("max", dateEnd);
  }
}


/*********************************
    RISK LEVEL CHART BEGINS
*********************************/
var riskLevelChart = {
  riskLevelLabels: [
    "Sin síntomas",
    "Síntomas previos",
    'Sintomas previos grupo vulnerable',
    'Sintomas leves',
    'Sintomas leves grupo vulnerable',
    'Sintomas graves',
  ],
  riskLevelColors: [
    'rgb(60, 179, 113, 0.5)',
    'rgb(255,255,0, 0.5)',
    'rgb(255,215,0, 0.5)',
    'rgb(255,165,0, 0.5)',
    'rgb(240,128,128, 0.5)',
    'rgb(139,0,0, 0.5)',
  ],
  totalLabel: "Total de pruebas",
  totalColor: 'rgb(136, 206, 250, 0.5)',

  /*
    update risk level chart
  */
  updateChart: function (){
    let canvasElement = document.createElement("canvas");
    $(canvasElement).attr("id","graficaRiesgo");
    let graficaRiesgo = $(canvasElement)[0].getContext('2d');
    
    let query = "?startDate="+ dateUtil.getEpochDate($("#fechaIni").val()) +"&endDate=" + dateUtil.setEndDay($("#fechaFin").val());
    let stateSelected = $("#estados").val();
    query += (stateSelected!="") ? "&stateID="+stateSelected :"";
    let municipalitySelected = $("#municipio").val();
    query += (municipalitySelected!="") ? "&municipalityID="+municipalitySelected :"";
    let suburbsSelected = $("#alcaldia").val();
    query += (suburbsSelected!="") ? "&suburbID="+suburbsSelected :"";
    
    let _url=API_URL+"/admins/stats/timeline"+query;
    
    $.ajax({
      url: _url, 
      success: function(result){
        let dataChart = riskLevelChart.getData(result);
        let optionsChart = riskLevelChart.getOptions();
  
        Chart.defaults.global.defaultFontSize = 20;
        var chart = new Chart(graficaRiesgo,{
          type: "line",
          data: dataChart,
          options: optionsChart
        })
  
        $(canvasElement).width("100%");
        $(canvasElement).height(300);
        $('#graficaRiesgo').remove(); 
        $(".canvas-comtainer").append(canvasElement);
  
        riskLevelChart.addTittle(result);
      }
    });
  },

  /* get data for build level risk Chart */
  getData: function (responseTimeLine){ 
    let tabSelected = $(".tabSelected").attr('id');
    let dataTimeLine = responseTimeLine.items;
    let dataset = [];

    let levels = [[],[],[],[],[],[],[],[],[]];
    let totals = [];
    let dataLabels = [];


    dataTimeLine.forEach( function(dataDate, index) {
      if(dataDate.date ){
        dataLabels.push(dateUtil.getShortDate(dataDate.date));
        totals.push( dataDate.level.total ? dataDate.level.total : 0);
        for(let i=0; i<riskLevelChart.riskLevelLabels.length; i++){
          levels[i].push( dataDate.level["level-"+i] ? dataDate.level["level-"+i] : 0);
        }
      }
    });
    
    
    //add totals if tab all is active
    if(tabSelected== undefined || tabSelected=="tab-all"){
      dataset.push({
        label: riskLevelChart.totalLabel,
        backgroundColor: riskLevelChart.totalColor,
        data: totals
      });
    }
    

    //add levels
    levels.forEach( function(levelData, index) {

      if(tabSelected== undefined || tabSelected=="tab-all" || tabSelected=="tab-"+index){
        let riskLevelLabel = riskLevelChart.riskLevelLabels[index];
        let riskLevelColor = riskLevelChart.riskLevelColors[index];

        dataset.push({
          label: riskLevelLabel,
          backgroundColor: riskLevelColor,
          data: levelData
        });
      }
    });

    return {labels: dataLabels, datasets: dataset};
  },

  /* get options for build level risk Chart */
  getOptions: function(){
    return {
      legend: {
          display: false,
      },
      scales: {
        xAxes: [{
            ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
                fontFamily: 'Typold Medium',
                fontSize: 18 
            }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            fontFamily: 'Typold Medium',
            fontSize: 18 
          }
        }]
      },
      onResize: function(){
        $("#graficaRiesgo").height(300);
      }
    }
  },

  /*
    Add tittle chart
   */
  addTittle: function(responseTimeLine){
    let tabSelected = $(".tabSelected").attr('id');
    $(".graph-risk-content").html("");
    $(".tab-content").html("");

    for(let i=0 ; i<riskLevelChart.riskLevelLabels.length; i++){
      //riskLevelChart.addLabelTittle(riskLevelChart.riskLevelLabels[i], responseTimeLine["level-"+i], riskLevelChart.riskLevelColors[i]);
      riskLevelChart.addTab('tab-'+i ,"level-"+i, riskLevelChart.riskLevelLabels[i], (tabSelected=="tab-"+i)? 'tabSelected': "" , numberUtil.formatNumber(responseTimeLine["level-"+i]), riskLevelChart.riskLevelColors[i]);
    }
    //riskLevelChart.addLabelTittle(riskLevelChart.totalLabel, responseTimeLine.total, riskLevelChart.totalColor);
    riskLevelChart.addTab('tab-all', 'all', riskLevelChart.totalLabel, (tabSelected== undefined || tabSelected=="tab-all")? 'tabSelected': "", numberUtil.formatNumber(responseTimeLine.total), riskLevelChart.totalColor);
  },

  /*
    Add Label tittle of chart
  */
  addLabelTittle: function(text, cases, color){
    let divContainer = document.createElement("div");  
    let divLabel = (document.createElement("div"));
    $(divLabel).addClass("graph-risk-leyend-item");
    var divDataColor = document.createElement("div");
    $(divDataColor).addClass("graph-bar-tit").css("background-color", color);
    var divDatText = document.createElement("div");
    $(divDatText).addClass("graph-bar-text").text(text);
    $(divLabel).append(divDataColor).append(divDatText);
    let divValue = (document.createElement("div"));
    $(divValue).addClass("graph-risk-leyend-val").html(numberUtil.formatNumber(cases))
    $(divContainer).append(divLabel).append(divValue);
    $(".graph-risk-content").append(divContainer);
  },

  addTab: function(id, level, label, isSelected, cases, color){
    let checked = (isSelected && isSelected!=""? "checked": "");
    let tab  = `<div class="col-md-3 item-tab ${isSelected}" id=${id} onclick="riskLevelChart.filterChartbyTab('${id}')">
                  <div class="item-tab-label">
                  <label class="radio-container">
                    <input type="radio" name="levelRisk" class="risk-radio" ${checked} id="radio-${id}">
                    <span class="checkmark"></span>
                  </label>
                    <div  data-level="${level}" class="tablinks" >${label}</div>
                  </div>
                  <div class="tab-cases">
                    <div>${cases}</div>
                    <div class="tab-color" style="background-color: ${color};"></div>
                  </div>
                </div>`;
    $(".tab-content").append(tab);
  },

  filterChartbyTab: function(id){
    $(".tabSelected").removeClass("tabSelected");
    $("#"+id).addClass("tabSelected");
    $("#radio-"+id).attr('checked', 'checked');
    $('#tabSelected').val( $("#"+id).attr("data-level"));
    riskLevelChart.updateChart();
  }
}

/*
  listen change tabLinks and update risk level chart
 */
$( ".tablinks" ).click(function() {
 
});

/*********************************
    AGE CHART BEGINS
*********************************/
var ageChart = {

  /*
    update age chart
  */
  updateChart: function (){
    let query = "?startDate="+ dateUtil.getEpochDate($("#fechaIni").val()) +"&endDate=" + dateUtil.setEndDay($("#fechaFin").val());
    let stateSelected = $("#estados").val();
    query += (stateSelected!="") ? "&stateID="+stateSelected :"";
    let municipalitySelected = $("#municipio").val();
    query += (municipalitySelected!="") ? "&municipalityID="+municipalitySelected :"";
    let suburbsSelected = $("#alcaldia").val();
    query += (suburbsSelected!="") ? "&suburbID="+suburbsSelected :"";
  
    let _url=API_URL+"/admins/stats/age"+query;
  
    $.ajax({
      url: _url, 
      success: function(result){
        ageChart.buildChart(result);
      }
    });
  },

  /*
    filter chart by range age
  */
  filterChart: function (){
    let radioSelected = $("input[name='age']:checked").val();
    let minAge = "";
    let maxAge = "";
    
    if(radioSelected!="Total"){
      let minAgeSelected = $("input[name='age']:checked").attr("data-min");
      let maxAgeSelected = $("input[name='age']:checked").attr("data-max");
      minAge = (minAgeSelected=="*") ? "" : minAgeSelected;
      maxAge = (maxAgeSelected=="*") ? "" : maxAgeSelected;
    }

    $("#minAge").val(minAge);
    $("#maxAge").val(maxAge);
    ageChart.updateRangeSlider(minAge, maxAge);
    genderChart.updateChart();
  },

  /*
    update range slider
   */
  updateRangeSlider: function(minAge, maxAge){
    let valMin = (minAge == "") ? 0 : parseInt(minAge);
    $(".rangeMin").val(valMin);
    $(".range_min").html( valMin + ' años');
    
    let valMax = (maxAge == "") ? 100 : parseInt(maxAge);
    $(".rangeMax").val(valMax);
    $(".range_max").html( ((valMax==100)? '+99 años': valMax + ' años'));
  },


  /*
    update values of range slider
   */
  updateValuesRange: function(e){
    minBtn = $(this).parent().children('.min'),
    maxBtn = $(this).parent().children('.max'),
    range_min = $(this).parent().children('.range_min'),
    range_max = $(this).parent().children('.range_max'),
    minVal = parseInt($(minBtn).val()),
    maxVal = parseInt($(maxBtn).val()),
    origin = $(this).attr('class');
  
    if(origin === 'min rangeMin' && minVal > maxVal-5){
        $(minBtn).val(maxVal-5);
    }
    var minVal = parseInt($(minBtn).val());
    $(range_min).html(minVal + ' años');
  
  
    if(origin === 'max rangeMax' && maxVal-5 < minVal){
        $(maxBtn).val(5+ minVal);
    }
    var maxVal = parseInt($(maxBtn).val());
    $(range_max).html( ((maxVal==100)? '+99 años': maxVal + ' años'));
  },

  /*
    build chart
  */
  buildChart: function(responseAge){
    let dataTable = "";
    let dataGraph = "";
    
    responseAge.forEach( function(age, index) {
      let rangeText = (age.range=="total")? age.range :(age.range).replace(".0","").replace(".0","") + " años";
      dataTable += ageChart.getRowTable(index, age.range, rangeText, age.cases, age.percentage);
      if(age.range!="total"){
        dataGraph += ageChart.getPieceChart(index, age.percentage);
      }
    });

    $("#ageRange").html(dataTable);
    $(".graph-bar").html(dataGraph);
    $(".aviso-bar").html(ageChart.getNote());

    $("#minAge").val("");
    $("#maxAge").val("");
    genderChart.updateChart(); 
  },

  /*
    get row of table
  */
 getRowTable: function (index, range, rangeText, cases, percentage){
    let row ="";
    let rangeAge = range.split("-");
    
    //debugger;
    if(rangeAge.length=2){
      let minAge = isNaN(rangeAge[0]) ? "" : numberUtil.getNumber(rangeAge[0]);
      let minAgeText = isNaN(rangeAge[0]) ? rangeAge[0] : minAge;

      let maxAge = isNaN(rangeAge[1]) ? "" : numberUtil.getNumber(rangeAge[1]);
      maxAge = (maxAge!="" && maxAge!=10 ) ?  maxAge-1 : maxAge;
      let maxAgeText = isNaN(rangeAge[1]) ? rangeAge[1] : maxAge;

      let rangeTextFormat = (rangeText=='total') ? 'Total':   minAgeText+"-"+maxAgeText+ " años";
      let color = ageChart.getRangeColor()[index];
      let casesFormat = numberUtil.formatNumber(cases);
      let isChecked = (rangeText=='total')? "checked" : "";

      row = `<div class="bar-row "+rangeText+"">`;
      row += `<div class="bar-row-check">
                <label class="radio-container">
                  <input class="age-radio" onclick="ageChart.filterChart()" type="radio" ${isChecked} name="age" data-min="${minAgeText}" data-max="${maxAgeText}" data-scale="${index}" id="range-${index}" value="${rangeTextFormat}">
                  <span class="checkmark"></span>
                </label>
              </div>`;
      row += `<div class="bar-row-color"><div style="background-color: ${color}"></div></div>`;
      row += `<div class="bar-row-range">${rangeTextFormat}</div>`;
      row += `<div class="bar-row-count">${casesFormat} casos</div>`;
      row += `<div class="bar-row-percent">${percentage}%</div>`;
      row += "</div>";
    }
    return row;
  },

  /*
    get piece of chart bar
  */
  getPieceChart: function (id, percentage){
    return "<div style=\"height: 20px; width: "+percentage+"%; background-color: "+ageChart.getRangeColor()[id]+";\"></div>";
  },

  /*
    get note chart
  */
  getNote: function(){
    let today = new Date(); 
    return "Está gráfica muestra los datos 	del último test realizado el día " + today.toLocaleDateString("es", {year: "numeric", month: "long",day: "numeric",});
  },

  /*
    get range color
  */
  getRangeColor: function (){
    return["#e4d1aa","#b09661","#dbb66a","#9a2042","#690f1d","#a68d64","#7f693a","#12322b","#454545","#448c78","#e4d1aa"];
  }
}


/*********************************
    GENDER CHART BEGINS
*********************************/
var genderChart = {

  male: {},
  female: {},

  /*
    update gender chart
  */
  updateChart: function(){
    genderChart.male = {}; 
    genderChart.female = {};

    let query = "?startDate="+ dateUtil.getEpochDate($("#fechaIni").val()) +"&endDate=" + dateUtil.setEndDay($("#fechaFin").val());
    let stateSelected = $("#estados").val();
    query += (stateSelected!="") ? "&stateID="+stateSelected :"";
    let municipalitySelected = $("#municipio").val();
    query += (municipalitySelected!="") ? "&municipalityID="+municipalitySelected :"";
    let suburbsSelected = $("#alcaldia").val();
    query += (suburbsSelected!="") ? "&suburbID="+suburbsSelected :"";
    let minAge = $("#minAge").val();
    let maxAge = $("#maxAge").val();
    query += (minAge!="") ? "&minAge="+ minAge :"";
    query += (maxAge!="") ? "&maxAge="+ maxAge :"";

    let _url=API_URL+"/admins/stats/gender"+query;

    $.ajax({
      url: _url, 
      success: function(result){
        genderChart.buildChart(result);
      }
    });
  },

  /*
    update build gender chart
  */
  buildChart: function(responseGender){
    $(".graph-bubble-area").html("");
    $(".graph-bubble-content").html("");

    responseGender.forEach( function(gender, index) {
      if(gender.gender=="male"){
        genderChart.male.bubble = genderChart.getElementGender(gender);
        genderChart.male.data = gender;
      } else if (gender.gender=="female"){
        genderChart.female.bubble = genderChart.getElementGender(gender);
        genderChart.female.data = gender;
      }
    });

    if(genderChart.female.bubble && genderChart.male.bubble){
      $(genderChart.male.bubble).css("margin-top", $(genderChart.female.bubble).height()-40);
    }

    //addFemale
    if(genderChart.female.data){
      this.addTittle(genderChart.female.data);
      $(".graph-bubble-area").append(genderChart.female.bubble);
    }

    //addMale
    if(genderChart.male.data){
      this.addTittle(genderChart.male.data);
      $(".graph-bubble-area").append(genderChart.male.bubble);
    }
    
    $(".aviso-bubble").html(genderChart.getNote()); 
  },


  /*
    create element of gender chart
  */
  getElementGender: function(gender){
      let divCircle = document.createElement("div");
      let thickness = numberUtil.getNumber(gender.percentage)*3;

      $(divCircle).width(thickness).height(thickness).addClass("graph-circle").css("background-color", genderChart.getColorBubble(gender.gender));

      if(thickness>75){
        let divCircleGender = document.createElement("div");
        $(divCircleGender).text(gender.percentage+ " %").addClass("graph-circle-title");
        let divCirclePercent = document.createElement("div");
        $(divCirclePercent).text(numberUtil.formatNumber(gender.cases)).addClass("graph-circle-text");;
        $(divCircle).append(divCircleGender).append(divCirclePercent);
      } else {
        let divInfo = document.createElement("div");
        $(divInfo).addClass("tooltip-bubble tooltipinfo");
        let spanInfo = document.createElement("span");
        $(spanInfo).addClass("tooltiptext tooltip-top");

        let divPerc = document.createElement("div");
        $(divPerc).text(gender.percentage+ " %");
        $(spanInfo).append(divPerc);
        let divNumber = document.createElement("div");
        $(divNumber).text(numberUtil.formatNumber(gender.cases));
        $(spanInfo).append(divNumber);

        $(divInfo).append(spanInfo)
        let spanIcon = document.createElement("span");
        $(spanIcon).addClass("glyphicon glyphicon-back  glyphicon-info-sign");
        $(divInfo).append(spanIcon)
        $(divCircle).append(divInfo);
      }
      return divCircle;
  },

  /*
    add tittle gender chart
  */
  addTittle(gender){
    let divDatColor = document.createElement("div");
    $(divDatColor).addClass("graph-bar-tit").css("background-color", genderChart.getColorBubble(gender.gender));
    $(".graph-bubble-content").append(divDatColor);

    var divDatText = document.createElement("div");
    $(divDatText).addClass("graph-bar-text").text(genderChart.getGenderText(gender.gender));
    $(".graph-bubble-content").append(divDatText);
  },

  /*
    get color gender
  */
  getColorBubble: function (gender){
    if(gender=="male"){
      return "#2f5a4f";
    } else if (gender=="female"){
      return "#902e3a";
    }
  },

  /*
    get gender
  */
  getGenderText: function(gender){
    if(gender!=undefined && gender.toUpperCase()==="MALE"){
      return "Hombre";
    } else if(gender!=undefined && gender.toUpperCase()==="FEMALE"){
      return "Mujer";
    }else {
      return gender;
    }
  },

  /*
    note of chart
  */
  getNote: function(){
    let today = new Date(); 
    return "Está gráfica muestra los datos 	del último test realizado el día " + today.toLocaleDateString("es", {year: "numeric", month: "long",day: "numeric",});
  }
}


/*
  listen change range slider for update labels 
*/
$('input[type="range"]').on( 'input', ageChart.updateValuesRange);

/*
  listen change range slider and update chart gender
*/
$('input[type="range"]').mouseup(function(){
  $( ".age-radio" ).each(function( index ) {
    $(this).prop('checked', false);
  });
  
  let minVal = parseInt($(".rangeMin").val());
  let maxVal = parseInt($(".rangeMax").val());
  $("#minAge").val( (minVal==0) ? "" :  minVal);
  $("#maxAge").val( (maxVal==100) ? "" : maxVal);

  genderChart.updateChart();
});