/**
 * @author David Manrique Romero
 */

$(document).ready(function () {

    //Metodo que muestra la informacion en un tooltip sobre el mapa de México
    $("path").hover(
        function () {
            $(".tooltipInfoMap").addClass("active");
            $(".tooltipInfoMap").html(`
        Estado: ${$(this).data("estado")}
        <br>
        Totales: ${
            $(this).data("tests") !== undefined ? $(this).data("tests") : 0
        }
    `);
        },
        function () {
            $(".tooltipInfoMap").removeClass("active");
        }
    );

    $(document).on("mousemove", function (e) {
        $(".tooltipInfoMap").css({
            left: e.pageX,
            top: e.pageY - 120,
        });
    });

    $('path, polygon').hover(function() {
        //$(this).attr("class", "enabled heyo");
        $(".tooltipInfoMapCMDX").addClass('active');
        $(".tooltipInfoMapCMDX").html(`Municipio: ${$(this).data("estado")}
                                <br>
                                Totales: ${
                                    $(this).data("tests") !== undefined ? $(this).data("tests") : 0
                                }
                            `) },
    function() {
        $(".tooltipInfoMapCMDX").removeClass('active');
    });

    $(document).on('mousemove', function(e){
        $(".tooltipInfoMapCMDX").css({
          left:  e.pageX,
          top:   e.pageY - 70
        });
    });
});

//Metodo que realiza el llenado del mapa de México con sus respectivos colores con base a la llamada del API de centros de salud y los tests realizados en cada uno de ellos
function setMapData(data) {
    var listStatesCode = getInfoMap();
    var { startDate = "", endDate = "" } = data;
    if(listStatesCode != null){
    $.ajax({
        url: API_URL + `/admins/states/hospitalsTests?startDate=${startDate}&endDate=${endDate}`,
        success: function (results) {
            listStatesCode.forEach((element) => {
                var tests = results.find((r) => r.stateID == element.idEstado);
                var $element = $("#state" + element.idEstado);

                if (typeof tests !== "undefined") {
                    $element.css("fill", colorCapacityMap(tests.tests));
                    $element.data("tests", tests.tests);
                } else {
                    $element.data("tests", 0);
                    $element.css("fill", "#808080");
                }

                $element.data("estado", element.estado);
            });
        },
    });
    }
}

//Metodo que realiza el llenado del mapa de la CDMX con sus respectivos colores con base a la llamada del API de centros de salud y los tests realizados en cada uno de ellos
function setMapDataCDMX(data) {
    var listAlcaldias = getInfoMapCDMX();
    var municipality = $("#estados").val();
    var { startDate = "", endDate = "" } = data;
    if(listAlcaldias != null){
    $.ajax({
      url: API_URL + `/admins/states/${municipality}/hospitalsTests?startDate=${startDate}&endDate=${endDate}`,
      success: function (result) {
            listAlcaldias.forEach((element) => {
                var tests = result.find((r) => r.municipalityID == element.id);
                var $element = $("#townhall" + element.id);
                if (typeof tests !== "undefined") {
                    $element.css("fill", colorCapacityMap(tests.tests));
                    $element.data("tests", tests.tests);
                } else {
                    $element.data("tests", 0);
                    $element.css("fill", "#808080");
                }
                $element.data("estado", element.municipality);
            });
        
      }})
    } 
}

// Metodo que realiza la comparacion de colores con base al total de test
function colorCapacityMap(total) {
    var result = parseInt(total);
    if (result < 20) {
        return "#e4d1aa";
    } else if (result >= 20 && result < 50) {
        return "#dbb66a";
    } else if (result >= 50 && result < 100) {
        return "#b09661";
    } else if (result >= 100 && result < 200) {
        return "#ff9417";
    } else if (result >= 200 && result < 500) {
        return "#ce5656";
    } else if (result >= 500 && result < 1000) {
        return "#911625";
    } else if (result >= 1000) {
        return "#370009";
    }
}

//Metodo que carga informacion de los estados que se utiliza para varios metodos
function getInfoMap() {
    var listStatesCode;
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/dashboardResources/json/states_info.json',
        async: false,
        success: function(result){
            listStatesCode = result;
        }
      });
    return listStatesCode;
}

//Metodo que carga informacion de las alcadias de la CDMX que se utiliza para varios metodos
function getInfoMapCDMX() {
    var listAlcaldias;
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/dashboardResources/json/alcaldias_info.json',
        async: false,
        success: function(result){
            listAlcaldias = result;
        }
      });
    return listAlcaldias;
}
