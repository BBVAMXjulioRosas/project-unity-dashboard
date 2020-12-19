/*
* @author Manuel Lopez Jaguey
*/

$(function() {
  var tokenSession = localStorage.getItem('AUTH-TOKEN');
  if(tokenSession!=undefined && tokenSession!=null && tokenSession!=""){
    tableLightAlert.user = JSON.parse(localStorage.getItem('user'));
    calendar.initialize();
    worldMap.buildMap(function(){
      updateDashboard();
    });
  }
});

function updateDashboard(){
  worldMap.updateMap();
  let stateSelected = $("#estados").val();
  if("states"==$("#filterMap").val() && (stateSelected=="" || stateSelected=="Estado")){
    tableLightAlert.buildTableStates();
  } else {
    tableLightAlert.buildTableMunicipalities();
  }
}

/*
  listen change select states and update municipalities
*/
$( "#estados" ).change(function() {
  localities.clearMunicipalities();
  updateDashboard();
});

$( "#municipio" ).change(function() {
  updateDashboard();
});

$( "#semaforo" ).change(function() {
  updateDashboard();
});

$( "#filterMap" ).change(function() {
  updateDashboard();
});


$( "#file" ).click(function() {
  fileLightAlert.selectActionFile("load");
});

$( "#downloadFile" ).click(function() {
  fileLightAlert.selectActionFile("download");
});

var localities = {
  /*
    Add option select state
   */
  addOptionState: function(id, name){
    $('#estados').append($("<option></option>").attr("value",id).text(name));
  },
  /*
    Add option select municipality
   */
  addOptionMunicipality: function (id, name) {
    $('#municipio').append($("<option></option>").attr("value",id).text(name));
  },
  /*
    Clear select states
  */
  clearStates: function (){
    $('#estados option').each(function() {
      $(this).remove();
    });
    $('#estados').append($("<option></option>").attr("value","").text("Todos los estados"));
    localities.clearMunicipalities();
  },
  /*
    Clear select municipalities
  */
  clearMunicipalities: function (){
    $('#municipio option').each(function() {
      $(this).remove();
    });
    $('#municipio').append($("<option></option>").attr("value","").text("Todos los Municipios / Alcaldías"));
  }
}

/*********************************
    WORLD MAP 
*********************************/
var worldMap = {
  polygonsOfStates:undefined,
  coordinatesStates:undefined,
  polygonsOfMunicipalities: undefined,
  map:undefined,

  buildMap: function(callback){
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: '/dashboardResources/json/states_coordinates.json',
      success: function(result){
        worldMap.polygonsOfStates = result;
      },
      complete: function(){
        return callback();
      }
    });

    worldMap.getCoordinatesStates();
    worldMap.getPolygonsOfMunicipalities();
  },

  updateMap: function(){
    var state = $('#estados').val();

    if(worldMap.map!=undefined){
      worldMap.map.off();
      worldMap.map.remove();
    }
    
    if(state!="" && state!="Estado"){
      worldMap.coordinatesStates.forEach(element => {
        if(state == element.id){
          worldMap.map = L.map('map', {
            center: [element.latitud,  element.longitud],
            zoom: element.zoom,
            preferCanvas: true
          });
        }
      });

    } else {
      worldMap.map = L.map('map', {
        center: [23.6345005,  -102.5527878],
        zoom: 5,
        preferCanvas: true
      });
    }

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 1,
      maxZoom: 17,
      label: 'open street map'
    }).addTo(worldMap.map);
  },

  printState: function (id, light, zoom){
    const type="state";
    let stateCoordinates = worldMap.getCoordinatesState(id);

    if(stateCoordinates.geometry.coordinates.length==1){
      worldMap.addPolygon(stateCoordinates.geometry.coordinates, id, stateCoordinates.properties.entidad_nombre, light, type, zoom);
    } else {
      for(let i=0; i<stateCoordinates.geometry.coordinates.length; i++){
        worldMap.addPolygon(stateCoordinates.geometry.coordinates[i], id, stateCoordinates.properties.entidad_nombre, light, type, zoom);
      }
    }
  },

  printMunicipality: function(idMunicipality, light, zoom){
    const type="municipality";
    let municipalityCoordinates = worldMap.getCoordinatesMunicipality(idMunicipality);
    
    if(municipalityCoordinates.geometry){
      if(municipalityCoordinates.geometry.type=="Polygon"){
        try {
          worldMap.addPolygon(municipalityCoordinates.geometry.coordinates, idMunicipality, municipalityCoordinates.properties.municipio_nombre, light, type, zoom);  
        } catch (error) {
          console.log("ERROR 1 \t" + municipalityCoordinates.properties.municipio_nombre);
        }
      } else {
        try {
          for(let i=0; i<municipalityCoordinates.geometry.coordinates.length; i++){
            worldMap.addPolygon(municipalityCoordinates.geometry.coordinates[i], idMunicipality, municipalityCoordinates.properties.municipio_nombre, light, type, zoom);
          }
        } catch (error) {
          console.log("ERROR 2 \t" + municipalityCoordinates.properties.municipio_nombre);
        }
      }
    } else {
      console.log("ERROR SIN COORDENADAS \t" + idMunicipality +"\t"+  JSON.stringify(municipalityCoordinates));
    }
  },


  addInfoControl: function(){
    var legend = L.control({position: 'topright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info-map legend-map'),
            lights = ["low", "medium", "high", "very-high"]

        for (var i = 0; i < lights.length; i++) {
            div.innerHTML +=
                '<div class="content-info-map"><i style="background:' + worldMap.getFillColor(lights[i]) + '"></i> ' + 
                tableLightAlert.getLightDescription(lights[i]) + "</br></div>";
        }
        return div;
    };
    legend.addTo(worldMap.map);
  },

  addPolygon: function(coordinates, id, name, light, type, zoom){
    var geojson = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": coordinates
          }
        }
      ]
    };

    L.geoJSON(geojson, {
      style: {weight:1, fillColor: worldMap.getFillColor(light), fillOpacity: 0.9},
      onEachFeature: function (feature,layer) {
        if(layer.feature.geometry.type == 'Polygon'){
          layer.setStyle({color : "#808080"})
            .addTo(worldMap.map)
            .bindTooltip('<div><b>'+name+'</b><div><div>Sem&aacute;foro '+tableLightAlert.getLightDescription(light)+'<div>');
          layer.on({
              mouseover: worldMap.highlightPolygon,
              mouseout: worldMap.resetHighlight,
              click: worldMap.zoomPolygon
          });
        }
        if(zoom){
          worldMap.map.fitBounds(layer._bounds);
        }
        layer.customProperties={type, id, name}
      }
    });
  },

  zoomPolygon: function(e){
    if(e.target.customProperties.type=="state"){
      $("#estados").val(e.target.customProperties.id);
      $("#estados").change();
    } else {
      worldMap.map.fitBounds(e.target.getBounds());
    }
  },

  highlightPolygon: function(e){
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#666',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  },

  resetHighlight: function(e){
    var layer = e.target;
    layer.setStyle({
        weight: 1,
        color: '#808080',
        fillOpacity: 1
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  },

  getCoordinatesState: function(idState){
    let stateSel={};
    worldMap.polygonsOfStates.features.forEach( function(state, index) {
      if(state.properties.entidad_cvegeo==idState){
        stateSel=state;
      }
    });
    return stateSel;
  },

  getCoordinatesMunicipality: function(idMunicipality){
    let municipalitySel={};
    worldMap.polygonsOfMunicipalities.features.forEach( function(municipality, index){
      if(municipality.properties && municipality.properties.municipio_cvegeo==idMunicipality){
        municipalitySel=municipality;
      }
    });
    return municipalitySel;
  },

  getCoordinatesStates: function (){
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: '/dashboardResources/json/states.json',
      success: function(result){
        worldMap.coordinatesStates= result;
      }
    });
  },

  getPolygonsOfMunicipalities: function(){
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: '/dashboardResources/json/municipalities_coordinates.json',
      success: function(result){
        worldMap.polygonsOfMunicipalities=result;
      }
    });
  },

  getFillColor(colorDescription){
    if(colorDescription=='very-high') {
      return '#ff0000';
    } else if(colorDescription=='high') {
      return '#fa7700';
    } else if(colorDescription=='medium') {
      return '#edf100';
    } else if(colorDescription=='low') {
      return '#5db524';
    } else {
      return '#F8F9F9';
    }
  }
}


/*********************************
    TABLE LIGHT ALERT
*********************************/
var tableLightAlert = {
  user:{},
  dataTableStates:{},
  dataTableMunicipalities:{},

  buildTableStates: function (){
    let stateSelected = $("#estados").val();
    let lightSelected = $("#semaforo").val();

    $.ajax({
      url: API_URL+"/admins/states/info?status="+lightSelected,
      success: function(result){
        result.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });

        localities.clearStates();
        tableLightAlert.dataTableStates = result;
        tableLightAlert.setDataTableStates();
      }
    });
  },

  setDataTableStates: function(){
    
    $('#table-light-alert').html("");

      tableLightAlert.setHeaderTableStates();

      let zoom = false;
      tableLightAlert.dataTableStates.forEach( function(state, index) {

        //add option - select states
        localities.addOptionState(state.id, state.name);
        
        //Se pinta el estado en el Mapa
        worldMap.printState(state.id, state.status, zoom);

        //Agregamos el estado en la tabla
        tableLightAlert.addRowStates(
          state.id, 
          state.name, 
          state.municipalities['very-high'], 
          state.municipalities.high,
          state.municipalities.medium,
          state.municipalities.low,
          state.status
          );
      });
      tableLightAlert.setPropertiesTableStates();
      worldMap.addInfoControl();
  },

  buildTableMunicipalities: function(){
    let idState = $("#estados").val();
    let idMunicipality=$("#municipio").val();
    let lightSelected = $("#semaforo").val();
    
    if(idMunicipality!=""){
      tableLightAlert.setDataTableMunicipalities();
    } else {
      $.ajax({
        url: API_URL+"/admins/municipalities/info?stateID="+idState+"&status="+lightSelected,
        success: function(result){
          result.sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });
          localities.clearMunicipalities();    
          tableLightAlert.dataTableMunicipalities=result;
          tableLightAlert.setDataTableMunicipalities();
        }
      });
    }
  },

  setDataTableMunicipalities(){
    $('#table-light-alert').html("");
    tableLightAlert.setHeaderTableMunicipalities();
    let idMunicipality=$("#municipio").val();

    tableLightAlert.dataTableMunicipalities.forEach( function(municipality, index) {
      //filter municipality front
      if(idMunicipality=="" || idMunicipality==municipality.id){

        //Add option select municipalities
        if(idMunicipality==""){
          localities.addOptionMunicipality(municipality.id, municipality.name);
        }

        //Se pinta el estado en el Mapa
        let zoom = idMunicipality==municipality.id;
        worldMap.printMunicipality(municipality.id, municipality.status, zoom);

        //Agregamos el municipio en la tabla
        tableLightAlert.addRowMunicipalities(
          municipality.id,
          municipality.state,
          municipality.name,
          municipality.status,
          municipality.status,
          );
        }
    });

    tableLightAlert.setPropertiesTableMunicipalities();
    worldMap.addInfoControl();
  },

  getLightDescription(light){
    if("very-high"==light){
      return "Máximo";
    } else if("high"==light){
      return "Alto";
    } else if("medium"==light){
      return "Intermedio";
    } else if("low"==light){
      return "Bajo";
    } else {
      return "No informado";
    }
  },

  updateMunicipality:{
    lastIdMunicipality:undefined,
    backButton:undefined,
    backLightContainer:undefined,

    edit: function(idMunicipality){
      
      if($(".btn-"+idMunicipality).hasClass("btn-save")){
        tableLightAlert.updateMunicipality.updateLight(idMunicipality);
        
      
      } else {
        tableLightAlert.updateMunicipality.resetButton(tableLightAlert.updateMunicipality.lastIdMunicipality);
        tableLightAlert.updateMunicipality.resetLight(tableLightAlert.updateMunicipality.lastIdMunicipality);

        tableLightAlert.updateMunicipality.lastIdMunicipality=idMunicipality;
        tableLightAlert.updateMunicipality.backLightContainer = $("."+idMunicipality).html();
        tableLightAlert.updateMunicipality.backButton =  $(".btn-"+idMunicipality).html();
    
        let lightPublished = $("."+idMunicipality).attr('data-light');
    
        $(".btn-"+idMunicipality).html("Guardar");
        $(".btn-"+idMunicipality).addClass("btn-save");
    
        let lights = ["low", "medium", "high", "very-high"];
        let input = '<div class="select-component"><div class="col-md-12"><select id="select-light">';
    
        for(let i=0; i<lights.length; i++){
          let optionSelected = (lights[i]==lightPublished) ? "selected" : "";
          input+='<option '+optionSelected+' value="'+lights[i]+'">'+ tableLightAlert.getLightDescription(lights[i]) +'</option>';
        }
        input += '</select></div></div>';
    
        $("."+idMunicipality).html(input);
      }
    },
  
    updateLight: function(idMunicipality){
      let light = $("#select-light").val();
      let id = (idMunicipality!=undefined) ? idMunicipality.replace("mun-","") : idMunicipality;
      let data = {status:light};

      $.ajax({
        url: API_URL+"/admins/municipalities/"+id+"/info",
        data : data,
        type: "PUT",
        success: function(result){
          tableLightAlert.updateMunicipality.resetButton(idMunicipality);
          $("."+idMunicipality).html('<div class="light-'+ light+'"></div><div>' + tableLightAlert.getLightDescription(light) + '</div>');
          tableLightAlert.updateMunicipality.lastIdMunicipality=undefined;
          let zoom = false;
          worldMap.printMunicipality(id, light, zoom);
          modalNotice.show("success", "Tu cambio se ha hecho de manera exitosa.");
        },
        error: function(result){
          modalNotice.show("error", "No fue posible realizar el cambio, vuelve a intentarlo.");
        }
      });
    },

    resetButton: function(idMunicipality){
      if(idMunicipality!=undefined){
        $(".btn-"+idMunicipality).html(tableLightAlert.updateMunicipality.backButton);
        $(".btn-"+idMunicipality).removeClass("btn-save");
      }
    },

    resetLight: function(idMunicipality){
      if(idMunicipality!=undefined){
        $("."+idMunicipality).html(tableLightAlert.updateMunicipality.backLightContainer);
      }
    }
  },

  addRowMunicipalities: function (id, state, municipality, lightPublished, lightRecommended){
    var htmlRow = '<tr>' +
          '<td>' + state + '</td>' +
          '<td>' + municipality + '</td>' +
          '<td><div class="light-color mun-'+id+'" data-light="'+lightPublished+'"><div class="light-'+ lightPublished+'"></div><div>' + tableLightAlert.getLightDescription(lightPublished) + '</div></div></td>' +
          '<td><div class="light-color"><div class="light-'+ lightRecommended +'"></div><div>' + tableLightAlert.getLightDescription(lightRecommended) + '</div></div></td>' +
          ((tableLightAlert.user.role==1) ? 
          '<td><button type="button" onclick="tableLightAlert.updateMunicipality.edit(\'mun-'+id+'\')" class="btn btn-info edit btn-mun-'+id+'"><span class="glyphicon glyphicon-back glyphicon-pencil"></span>Editar</button></td>':"")+
        '</tr>';
        $('#table-all-states tbody').append(htmlRow); 
  },

  setHeaderTableMunicipalities: function (){
    var htmlTable = 
      '<table id="table-all-states" class="display">'+
        '<thead>'+
          '<tr>' +
            '<th>Estado</th>'+
            '<th>Municipio</th>'+
            '<th>Sem&aacute;foro publicado</th>'+
            '<th>Sem&aacute;foro recomendado</th>'+
            ((tableLightAlert.user.role==1) ? '<th>Acciones</th>' : "") +
          '</tr>'+
        '</thead>'+
        '<tbody id="tableBodyUsers"></tbody>'+
      '</table>' +
      '<div id="totalUsers"></div>';
      $('#table-light-alert').append(htmlTable);
  },

  addRowStates: function (id, state, totalLightRed, totalLightOrange, totalLightYellow, totalLightGreen, stateLight){
    var htmlRow = '<tr>' +
          '<td>' + state + '</td>' +
          '<td><div class="light-color"><div class="light-red"></div>' + totalLightRed      + '</div></td>' +
          '<td><div class="light-color"><div class="light-orange"></div>' + totalLightOrange   + '</div></td>' +
          '<td><div class="light-color"><div class="light-yellow"></div>' + totalLightYellow   + '</div></td>' +
          '<td><div class="light-color"><div class="light-green"></div>' + totalLightGreen    + '</div></td>' +
          '<td><div class="light-color state-'+id+'" data-light="'+stateLight+'"><div class="light-'+ stateLight +'"></div><div>' + tableLightAlert.getLightDescription(stateLight) + '</div></div></td>' +
          ((tableLightAlert.user.role==1) ? 
          '<td><button type="button" onclick="tableLightAlert.updateState.edit(\'state-'+id+'\')" class="btn btn-info edit btn-state-'+id+'"><span class="glyphicon glyphicon-back glyphicon-pencil"></span>Editar</button></td>':""
          ) +
        '</tr>';
        $('#table-all-states tbody').append(htmlRow); 
  },

  setHeaderTableStates: function (){
    var htmlTable = 
      '<table id="table-all-states" class="display">'+
        '<thead>'+
          '<tr>' +
            '<th>Estado</th>'+
            '<th>Municipios sem&aacute;foro M&aacute;ximo</th>'+
            '<th>Municipios sem&aacute;foro Alto</th>'+
            '<th>Municipios sem&aacute;foro Intermedio</th>'+
            '<th>Municipios sem&aacute;foro Bajo</th>'+
            '<th>Municipios sem&aacute;foro a nivel estado</th>'+
            ((tableLightAlert.user.role==1) ? '<th>Acciones</th>' : "") +
          '</tr>'+
        '</thead>'+
        '<tbody id="tableBodyUsers"></tbody>'+
      '</table>' +
      '<div id="totalUsers"></div>';
      $('#table-light-alert').append(htmlTable);
  },

  updateState:{
    lastIdState:undefined,
    backButton:undefined,
    backLightContainer:undefined,

    edit: function(idState){
      
      if($(".btn-"+idState).hasClass("btn-save")){
        tableLightAlert.updateState.updateLight(idState);
        
      
      } else {
        tableLightAlert.updateState.resetButton(tableLightAlert.updateState.lastIdState);
        tableLightAlert.updateState.resetLight(tableLightAlert.updateState.lastIdState);

        tableLightAlert.updateState.lastIdState=idState;
        tableLightAlert.updateState.backLightContainer = $("."+idState).html();
        tableLightAlert.updateState.backButton =  $(".btn-"+idState).html();
    
        let lightPublished = $("."+idState).attr('data-light');
    
        $(".btn-"+idState).html("Guardar");
        $(".btn-"+idState).addClass("btn-save");
    
        let lights = ["low", "medium", "high", "very-high"];
        let input = '<div class="select-component"><div class="col-md-12"><select id="select-light">';
    
        for(let i=0; i<lights.length; i++){
          input+='<option value="'+lights[i]+'">'+ tableLightAlert.getLightDescription(lights[i]) +'</option>';
        }
        input += '</select></div></div>';
    
        $("."+idState).html(input);
      }
    },
  
    updateLight: function(idState){
      let light = $("#select-light").val();
      let id = (idState!=undefined) ? idState.replace("state-","") : idState;
      let data = {status:light};

      $.ajax({
        url: API_URL+"/admins/states/"+id+"/info",
        data : data,
        type: "PUT",
        success: function(result){
          tableLightAlert.updateState.resetButton(idState);
          $("."+idState).html('<div class="light-'+ light+'"></div><div>' + tableLightAlert.getLightDescription(light) + '</div>');
          tableLightAlert.updateState.lastIdState=undefined;
          let zoom = false;
          worldMap.printState(id, light, zoom);
          modalNotice.show("success", "Tu cambio se ha hecho de manera exitosa.");
        },
        error: function (){
          modalNotice.show("error", "No fue posible realizar el cambio, vuelve a intentarlo.");
        }
      });
    },

    resetButton: function(idState){
      if(idState!=undefined){
        $(".btn-"+idState).html(tableLightAlert.updateState.backButton);
        $(".btn-"+idState).removeClass("btn-save");
      }
    },

    resetLight: function(idState){
      if(idState!=undefined){
        $("."+idState).html(tableLightAlert.updateState.backLightContainer);
      }
    }
  },

  setPropertiesTableStates: function () {
    $("#table-all-states").DataTable(
      {
        filter: false,
        ordering: true,
        lengthChange: false,
        paging: false,
        retrieve: true,
        searching: false,
        info: false,
        language: {
          emptyTable: "No se encontraron datos"
        }
      }
    );
  },

  setPropertiesTableMunicipalities: function () {
    $("#table-all-states").DataTable(
      {
        filter: false,
        ordering: true,
        lengthChange: false,
        retrieve: false,
        paging: true,
        "pageLength": 50,
        searching: false,
        info: false,
        language: {
          paginate: {
            next: "Siguiente",
            previous: "Atr&aacute;s"
          },
          emptyTable: "No se encontraron datos"
        },
        "columnDefs":[
          { "width": "15%", "targets":  0},
          { "width": "20%", "targets":  1},
          { "width": "20%", "targets":  2},
          { "width": "20%", "targets":  3},
          { "width": "15%", "targets":  4},
        ]
      }
    );
  }
}

let fileLightAlert = {
  file: undefined,

  selectActionFile: function(action){
    if(action=="load"){
      $(".title-action").html("Selecciona el semáforo a subir:");
    } else if(action=="download"){
      $(".title-action").html("Selecciona el semáforo a descargar:");
    }
    $('#modalActionFile').modal('show');

    $('#option-states').unbind();
    $('#option-states').click(function (){
      $("#modalActionFile").modal('hide');
      if(action=="load"){
        fileLightAlert.loadFile("states");
      } else if(action=="download"){
        fileLightAlert.downloadFile("states");
      }
    });
  
    $('#option-municipalities').unbind();
    $('#option-municipalities').click(function (){
      $("#modalActionFile").modal('hide');
      if(action=="load"){
        fileLightAlert.loadFile("municipalities");
      } else if(action=="download"){
        fileLightAlert.downloadFile("municipalities");
      }
    });

    $('#btnCancelAction').unbind();
    $('#btnCancelAction').click(function (){
      $("#modalActionFile").modal('hide');
    });
  },

  downloadFile: function(type){
    let url = API_URL + "/admins/"+type+"/info/file";

    $.ajax({
      url,
      success: function(result){
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", result]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = type+"Info.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      error: function(){
        modalNotice.show("error", "No fue posible descargar el archivo, vuelve a intentarlo.");
      }
    });
  },
  
  loadFile: function(type){
    $('<input type="file" multiple>').on('change', function () {

      fileLightAlert.file = this.files[0];
      var filePath = this.files[0].name;
      var fileSize = this.files[0].size;
      var onlyExtensions = /(.csv)$/i;

      if(!onlyExtensions.exec(filePath)){
        modalNotice.show("error","Tipo de archivo no aceptado.");
      } else {
        modalActionFile.show(filePath, fileSize, type);
      }
    }).click();
  },

  sendDocument: function(type){
    let url = API_URL + "/admins/"+type+"/info/file ";
    var uploadFile = new FormData();
    uploadFile.append("file", fileLightAlert.file);  

    $.ajax({
      url,
      type: 'POST',
      data: uploadFile,
      contentType: false,
      processData: false,
      cache: false,
      dataType: 'text',
      success: function(result){
        fileLightAlert.file=undefined;
        let idMunicipality=$("#municipio").val();

        if(idMunicipality!=""){
          $("#municipio").val("");
          $("#municipio").change();
        } else {
          updateDashboard();
        }
        modalNotice.show("success","El archivo se ha subido con exito.");
      
      }, error: function(result){
        modalNotice.show("error","No fue posible subir el archivo.");
      }
    });
  },
  
  converterBytes: function (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }
}

let modalActionFile = {
  init: function (){
    $('#btnCancel').click(function (){
      $("#modalFile").modal('hide');
    });
  },

  show: function (filePath, fileSize, type){
    $('#modalBody').html('<p class="childModal">Archivo seleccionado</p>'+
        '<div class="childModal"><div class="childModal"><img class="childModal imgUpload" src="/dashboardResources/img/upload.png"></img></div>' +
        '<p class="childModal">'+filePath+'</p><p class="childModal">'+ fileLightAlert.converterBytes(fileSize)+'</p></div>');

    $('#btnUpload').unbind();
    $('#btnUpload').click(function (){
      fileLightAlert.sendDocument(type);
    });
    $('#modalFile').modal('show');
  }
}

let modalNotice = {  
  init: function(){
    $('#closeNotice').click(function (){
      $("#modalNotice").modal('hide');
    });
  },

  show: function(type, message){
    //close all modal
    $(".modal").modal('hide');

    $(".modal-content").removeClass("success");
    $(".modal-content").removeClass("error");
    $(".modal-content").addClass(type);

    $(".message-modal").html(message);
    $("#modalNotice").modal('show');
  }
}

modalNotice.init();
modalActionFile.init();




/*********************************
    CALENDAR
*********************************/
var calendar = {
  /*
    initialize calendar
  */
 initialize: function (){
    let today = new Date();
    $(".lastUpgrade").html("Última actualización: " + today.toLocaleDateString("es", {year: "numeric", month: "long",day: "numeric",}));
 }
}