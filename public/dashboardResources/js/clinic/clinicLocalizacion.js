/**
 * @author David Manrique Romero
 */

$(document).ready(function() {
    var dt = new Date();
    $('#datetime').text(dt.toLocaleDateString("es", {year: "numeric", month:"long", day: "numeric" })); 
    getEstados();
      
    $("#estados").change(function() {
      getMunicipios();
      getMarketCoordenadasEstado();
    });
    $("#municipios").change(function() {
      getColonias();
      getMarketCoordenadasMunicipio();
    });
  });

  // Metodo que carga el catalogo de estados realizando una llamada API REST

function getEstados() {
    $("#estados option").each(function() {
      $(this).remove();
    });
    $("#estados").append(
      $("<option></option>")
        .attr("value", "")
        .text("Todos los estados")
    );
  
    $.ajax({
      url: API_URL + "/admins/states",
      success: function(result) {
        result.forEach(element =>
          
          $("#estados").append(
            $("<option></option>")
              .attr("value", element.id)
              .text(element.name)
          )
        );
      }
    });
  }

  // Metodo que carga el catalogo de municipios o alcaldias realizando una llamada API REST
  
  function getMunicipios() {
    $("#municipios option").each(function() {
      $(this).remove();
    });
    $("#municipios").append(
      $("<option></option>")
        .attr("value", "")
        .text("Todos los Municipios / Alcaldías")
    );
    var estado = $('#estados').val();
    $.ajax({
      url: API_URL + '/admins/states/'+estado+'/municipalities',    
      success: function(result) {
        result.forEach(element =>
          $("#municipios").append(
            $("<option></option>")
              .attr("value", element.id)
              .text(element.name)
          )
        );
      }
    });
  }

  // Metodo que carga el catalogo de colonias 0 asentamientos realizando una llamada API REST

  function getColonias() {
    $("#colonias option").each(function() {
      $(this).remove();
    });
    $("#colonias").append(
      $("<option></option>")
        .attr("value", "")
        .text("Todas las colonias o asentamientos")
    );
    var estado = $('#estados').val();
    var municipio = $('#municipios').val();
    $.ajax({
      url: API_URL + '/admins/states/'+estado+'/municipalities/'+municipio+'/suburbs',
      success: function(result) {result.forEach(element =>
        $("#colonias").append(
          $("<option></option>")
            .attr("value", element.id)
            .text(element.name)
        )
      );
      }
    });
  }

  // Metodo que inicializa el mapa y lo muestra completo a nivel nacional

  function initMap(event) {
    var map = new google.maps.Map(document.getElementById("map-localizacion"), {
      center: { lat: 23.6345005, lng: -102.5527878 },
      zoom: 5
    });
  }

  // Metodo que realiza un zoom por estado y visualiza el marcador en cada uno de ellos

  function getMarketCoordenadasEstado(){
    var estado = $('#estados').val();
    var map;
    var coordenadasEstados = getCoordenadasEstado();
    coordenadasEstados.forEach(element => {
      if(estado == element.id){
         map = new google.maps.Map(document.getElementById("map-localizacion"), {
          center: { lat: element.latitud, lng: element.longitud },
          zoom: element.zoom
      });
      }else if(estado == ""){
         map = new google.maps.Map(document.getElementById("map-localizacion"), {
          center: { lat: 23.6345005, lng: -102.5527878 },
          zoom: 5
        });
      }
    })
   
  }


  function getMarketCoordenadasMunicipio(){
    var map;
    var coordenadasMunicipio = getHospitalMarkets();
    console.log(coordenadasMunicipio);
    let latitud = parseFloat(coordenadasMunicipio[""+0+""].location.lat);
    let longitud = parseFloat(coordenadasMunicipio[""+0+""].location.lon);
         map = new google.maps.Map(document.getElementById("map-localizacion"), {
          center: { lat: latitud, lng: longitud },
          zoom: 11
      });
      createMarketsMunicipio(map, coordenadasMunicipio);
  }

  // Metodo que carga las coordenadas de el Laboratorio Estatal de cada estado de  hospitals_states_localization.json
  //Se podria crear una API de los hospitales y sus coordenadas.

  function getCoordenadasEstado(){
 
    var localizacion_centros;
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: '/dashboardResources/json/hospitals_states_localization.json',
      async: false,
      success: function(result){
        localizacion_centros = result;
      }
    });
      return localizacion_centros;
  }

  // Metodo que crea los marcadores de la CDMX

  function createMarketsMunicipio(map, coordenadas){
    var image = {
      url: '/dashboardResources/img/pin_centrossalud.png',
      size: new google.maps.Size(40, 60),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 0)
     };
     var infowindow = new google.maps.InfoWindow({
     content: '',
     maxWidth: 250
     });
    var coordenadas_centro;
    if(coordenadas != undefined){
    coordenadas.forEach(element => {
      let latitud = parseFloat(element.location.lat);
      let longitud = parseFloat(element.location.lon);
      var contenido = "<div><p class=\"infoWindowsMap\">"+element.hospital+"</p><p>"+element.address+"</p></div><p>"+latitud +", "+longitud+"</p></div>";
      coordenadas_centro = {lat: latitud, lng: longitud};
        var marker = new google.maps.Marker({position: coordenadas_centro, map: map, icon : image});
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.close();
          infowindow.setContent(contenido);
          infowindow.open(map,marker);
        });
    })}
  }

  function getHospitalMarkets(){
    var coordenadas;
    var estado = $('#estados').val();
    var municipio = $('#municipios').val();
    if(estado != "" && municipio != ""){
      $.ajax({
        type: 'GET',
        dataType: "json",
        async: false,
        url: API_URL + '/states/'+estado+'/municipalities/'+municipio+'/hospitals',
        success: function(result) {
          coordenadas = result;            
        }
    });
    }
    return coordenadas;
  }