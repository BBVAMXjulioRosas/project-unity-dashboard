/**
 * @author David Manrique Romero
 */

$(document).ready(function() {
// Inicializadores de valores en  la pagina

    $("#map-cdmx-html").append(html_map_mexico);
    $("#map-html").append(html_map_cdmx);

    var dt = new Date();
    $('#datetime').text(dt.toLocaleDateString("es", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }));
    getEstados();
    dataDateElements();

    $("#estados").change(function() {
        getMunicipios();
        getImgState();
    });
    $("#municipios").change(function() {
        getColonias();
        getImgMuncipality();
    });
    $("#colonias").change(function() { initElement()});
    $(".img-map").css("display", "none");
    $(".map-html").css("display", "block");
    $('.map-cdmx-html').css("display", "none");
    $('.info-pruebas').css("right", "20%");

    $("#btnClean").click(function() {
        cleanForm();
    });

    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
    // $('#content-principal').css("display", "none");
    
    initElement();
});

// Metodo que realiza la carga de los metodos principales
// para el llenado de la tabla, campos de informacion y parametros de la tabla

function initElement(page) {
    var pageInit;
    var estado = $('#estados').val();
    var municipio = $('#municipios').val();
    var colonia = $('#colonias').val();
    var fecha;
    var fechaDesde = Date.parse($('#dateOf').val()) / 1000.00;
    var fechaHasta = Date.parse($('#dateTo').val() + ' 23:59:59') / 1000.00;
    if(page == "" || page == null || page == undefined){
        pageInit = 0;
        _createTableCentros(estado, municipio, colonia, fechaDesde, fechaHasta, pageInit);
        getInfoNumeric(estado, municipio, colonia, fechaDesde, fechaHasta);
        if(estado == ""){
        setMapData({
         startDate: fechaDesde,
        endDate: fechaHasta
        });}
        if(estado == "1"){
         setMapDataCDMX({
            startDate: fechaDesde,
            endDate: fechaHasta
          });
        }
        $('.info-pruebas').css("right", "");
    }else{
        pageInit = page;
        _createTableCentros(estado, municipio, colonia, fechaDesde, fechaHasta, pageInit);
    }
}

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
                ),
            );
        }
    });
    $("#municipios option").each(function() {
        $(this).remove();
    });
    $("#colonias option").each(function() {
        $(this).remove();
    });
    $("#municipios").append(
        $("<option></option>")
        .attr("value", "")
        .text("Todos los Municipios / Alcaldías")
    );
    $("#colonias").append(
        $("<option></option>")
        .attr("value", "")
        .text("Todas las colonias o asentamientos")
    );
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
    if (estado != "") {
        $.ajax({
            url: API_URL + '/admins/states/' + estado + '/municipalities',
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

    initElement();
    
    if (estado == "1") {        
        $(".img-map").css("display", "none");
        $(".map-html").css("display", "none");
        $('.map-cdmx-html').css("display", "block");
        var fechaDesde = Date.parse($('#dateOf').val()) / 1000.00;
        var fechaHasta = Date.parse($('#dateTo').val() + ' 23:59:59') / 1000.00;
    } else if(estado == "") {
        $(".img-map").css("display", "none");
        $(".map-html").css("display", "block");
        $('.map-cdmx-html').css("display", "none");
        $('.info-pruebas').css("right", "20%");
    }else {
        $(".img-map").css("display", "block");
        $(".map-html").css("display", "none");
        $('.map-cdmx-html').css("display", "none");
        $('.info-pruebas').css("right", "");
    }
    $("#colonias option").each(function() {
        $(this).remove();
    });
    $("#colonias").append(
        $("<option></option>")
        .attr("value", "")
        .text("Todas las colonias o asentamientos")
    );
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
    if (municipio != "" && estado != "") {
        $.ajax({
            url: API_URL + '/admins/states/' + estado + '/municipalities/' + municipio + '/suburbs',
            success: function(result) {
                result.forEach(element =>
                    $("#colonias").append(
                        $("<option></option>")
                        .attr("value", element.id)
                        .text(element.name)
                    )
                );
            }
        });
    }
    initElement();
    if(municipio == "") {
        $(".img-map").css("display", "none");
        $(".map-html").css("display", "none");
        $('.map-cdmx-html').css("display", "block");
    }else if(municipio != "" && estado == 1){
    $(".img-map").css("display", "block");
    $(".map-html").css("display", "none");
    $('.map-cdmx-html').css("display", "none");
    }
    
}

// Metodo que realiza el llamado API REST para la tabla de centros de salud
// Realiza la creacion de la tabla

function _createTableCentros(estado, municipio, colonia, fechaDesde, fechaHasta, page) {

    $("#tableCentrosSalud").remove();
    $("#tableCentrosSalud_wrapper").remove();
    $("#totalRegistros").remove();
    var htmlTable =
        '<table id="tableCentrosSalud" class="display"><thead><tr>' +
        '<th>Nombre</th><th>Capacidad</th><th>Realizadas</th><th>Positivas</th><th>Negativas</th>' +
        '</tr></thead><tbody id="tableBodyCentros"></tbody></table>' +
        '<div id="totalRegistros"></div>';
    $('#table-centros').append(htmlTable);
    var arrLength;
    $.ajax({
        url: API_URL + '/admins/hospitals/tests?stateID=' + estado + '&municipalityID=' + municipio + '&suburbID=' + colonia + '&startDate=' + fechaDesde + '&endDate=' + fechaHasta + '&page=' + page,
        success: function(result) {
            arrLength = result.items.length;
            result.items.forEach(element => {
                var htmlTags = '<tr>' +
                    '<td>' + element.name + '</td>' +
                    '<td><span class="dot" style="background-color:' + colorCapacity(element.totalCapacity, element.occupiedCapacity) + ';"></span><span>' + new Intl.NumberFormat('en-GB').format(parseInt(element.totalCapacity)) + '</span></td>' +
                    // '<td>' + element.busqueda + '</td>'+
                    '<td>' + new Intl.NumberFormat('en-GB').format(parseInt(element.totalTest)) + '</td>' +
                    '<td>' + new Intl.NumberFormat('en-GB').format(parseInt(element.positiveTest)) + '</td>' +
                    '<td>' + new Intl.NumberFormat('en-GB').format(parseInt(element.negativeTest)) + '</td>' +
                    '</tr>';
                $('#tableCentrosSalud tbody').append(htmlTags);
            });
            tableData();
            if(result.total > 0){
                $('.totalRegistros').remove();
                $('#footerTable').append('<div class="totalRegistros">Total: ' + result.total + '</div>');
                createPagination(result.total, page);
                }else{
                    $('.totalRegistros').remove();
                }
        },
        error: function(result) {
            tableData();
            $('.totalRegistros').remove();
        }
    });

}

// Metodo que crea el paginado de la tabla de centros de salud

function createPagination(totalRegistros, page){
    var paginas = Math.ceil(totalRegistros / 10)
    var html = '<div class="totalRegistros paginate">';
    if((page -2) >= 0 && (paginas > 3)){
        html += '<a onclick="initElement(0);"><span class="arrow_page">&laquo;</span></a>';
    }
    for (let i = 0; i < paginas; i++) {
        let numberPage = i + 1;
        let current = "";
        if(page == i){
            current = 'current show_pag'
            html += '<span class="'+current+'"><a>'+numberPage+'</a></span>';
        }else{
            if((page-1)>=0 && (i == (page-1)) || (i == (page+1))){
                current = "show_page"
            }else if(page == 0 && i == 2){
                current = "show_page"
            }else if(page == (paginas - 1) && i == (page - 2)){
                current = "show_page"
            }else{
                current = "hide_page"
            }
            html += '<span class="'+current+'"><a onclick="redirectPage(this)">'+numberPage+'</a></span>';
        }
    }
    if(((page + 2) <= (paginas - 1)) && (paginas > 3)){
        html += '<a onclick="initElement('+(paginas-1)+');"><span class="arrow_page">&raquo;</span></a>';
    }
    html += '</div>'
    $('#footerTable').append(html);
}

// Metodo que realiza la redireccion del paginado

function redirectPage(ev){
 var page = parseInt(ev.text) - 1;
 initElement(page);
}

// Metodo que realiza el cambio de color dependiendo del porcentaje de capacidad
// El porcentaje se obtiene de la division entre la capacidad total y la capacidad ocupada

function colorCapacity(capTotal, capOcup) {
    var result = parseInt(capOcup) / parseInt(capTotal);
    if (result < 0.3) {
        return "#12322b";
    } else if (result >= 0.3 && result <= 0.7) {
        return "#bd9869";
    } else if (result > 0.7) {
        return "#690f1d";
    }
}

// Metodo que realiza el formato de la tabla utilizando la libreria de DataTable

function tableData() {
    $("#tableCentrosSalud").DataTable({
        filter: false,
        lengthChange: false,
        retrieve: true,
        paging: false,
        searching: false,
        ordering: true,
        language: {
            paginate: {
                next: "",
                previous: ""
            },
            emptyTable: "No se encontraron datos"
        }
    });
}

// Metodo que realiza el cambio de imagen de estado en pantalla

function getImgState() {
    var stateImg;
    var nameImg;
    var state = $('#estados').val();
    var listStates;
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/dashboardResources/json/states_info.json',
        async: false,
        success: function(result){
          listStates = result;
        }
      });
      
    if (state === "") {
        stateImg = "Map_Of_Mexico";
    } else {
        listStates.forEach(element => {
            if(element.idEstado === parseInt(state)){
                stateImg = element.nombre;
                nameImg = element.name;
            }
        })
    }
    $("#mapMexico").attr("src", "/dashboardResources/img/map/" + stateImg + ".svg");
    $("#mapMexico").attr("alt", nameImg);
}

// Metodo que realiza el cambio de imagen del municipio en pantalla

function getImgMuncipality() {
    var stateImg;
    var municipality = $('#municipios').val();
    var listStates;
    var state = $('#estados').val();
    if(state == "1"){
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: '/dashboardResources/json/alcaldias_info.json',
        async: false,
        success: function(result){
          listStates = result;
        }
      });
        listStates.forEach(element => {
            if(element.id === parseInt(municipality)){
                stateImg = element.municipality
            }
        })
    $("#mapMexico").attr("src", "/dashboardResources/img/map_cdmx/" + stateImg + ".svg");
    }
}

// Metodo que realiza el llamado API REST para la los datos de pruebas por filtros
// Realiza es seteo de los datros en pantalla

function getInfoNumeric(estado, municipio, colonia, fechaDesde, fechaHasta) {
    $('#totalNumeric span').remove();
    $('#bajoNumeric span').remove();
    $('#medioNumeric span').remove();
    $('#altoNumeric span').remove();
    $('#capacityNumeric span').remove();
    $('#totalNumeric').append('<span class="txtInfo">Totales</span>');
    $('#bajoNumeric').append('<span class="txtInfo">Bajo</span>');
    $('#medioNumeric').append('<span class="txtInfo">Medio</span>');
    $('#altoNumeric').append('<span class="txtInfo">Alto</span>');
    $('#capacityNumeric').append('<span class="txtInfo">Capacidad de test</span>');
    $.ajax({
        url: API_URL + "/admins/hospitals/stats?stateID=" + estado + "&municipalityID=" + municipio + "&suburbID=" + colonia + "&startDate=" + fechaDesde + "&endDate=" + fechaHasta,
        success: function(result) {
            $('#totalNumeric').append('<span class="txtData">' + new Intl.NumberFormat('en-GB').format(parseInt(result.tests)) + '</span>');
            $('#bajoNumeric').append('<span class="txtData">' + new Intl.NumberFormat('en-GB').format(parseInt(result.capacity.low)) + '</span>');
            $('#medioNumeric').append('<span class="txtData">' + new Intl.NumberFormat('en-GB').format(parseInt(result.capacity.medium)) + '</span>');
            $('#altoNumeric').append('<span class="txtData">' + new Intl.NumberFormat('en-GB').format(parseInt(result.capacity.high)) + '</span>');
            $('#capacityNumeric').append('<span class="txtData">' + new Intl.NumberFormat('en-GB').format(parseInt(result.capacity.total)) + '</span>');
        }
    });
}

// Metodo para las fechas que se utilizan de inicio en los calendarios, asi como valores de minDate y maxDate

function dataDateElements() {
    var dt = new Date();
    var maxDAte = dt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    var dateSplit = maxDAte.split("/");
    var dateMaxCalendar = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];
    var dateDefaultValueCalendar = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];

    $('#dateTo').attr("max", dateMaxCalendar);
    $('#dateOf').attr("max", dateMaxCalendar);
    $('#dateTo').attr("min", '2019-01-01');
    $('#dateOf').attr("min", '2019-01-01');
    $('#dateOf').val(dateDefaultValueCalendar);
    $('#dateTo').val(dateDefaultValueCalendar);


    $('#dateTo').change(function() {
        validateCalendar(this);
        initElement();
    })
    $('#dateOf').change(function() {
        validateCalendar(this);
        initElement();
    })

    $('#dateTo').blur(function() {
        validateCalendar(this);
    })
    $('#dateOf').blur(function() {
        validateCalendar(this);
    })

}

// Metodo que valida rango de fechas validas en el calendario

function validateCalendar(ev) {
    var dateNew = new Date();
    var dateNewFormat = dateNew.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    var validateSplit = dateNewFormat.split("/");
    var dateInput = $('#' + ev.id).val();
    var dateInputSplit = dateInput.split("-");
    var dateStart = new Date(validateSplit[2], (validateSplit[0] - 1), validateSplit[1]);
    var dateEnd = new Date(dateInputSplit[0], (dateInputSplit[1] - 1), dateInputSplit[2]);
    var dateDefaultValueCalendar = validateSplit[2] + "-" + validateSplit[0] + "-" + validateSplit[1];
    if ((dateEnd > dateStart) || (parseInt(dateInputSplit[0]) < 2019)) {
        $('#' + ev.id).val(dateDefaultValueCalendar);
    }
    var of = $('#dateOf').val();
    var to = $('#dateTo').val();
    var ofSplit = of .split("-");
    var ofFormat = new Date(ofSplit[0], (ofSplit[1] - 1), ofSplit[2]);
    var toSplit = to.split("-");
    var toFormat = new Date(toSplit[0], (toSplit[1] - 1), toSplit[2]);
    if (toFormat < ofFormat) {
        $('#dateTo').val(dateDefaultValueCalendar);
    }
}

// Metodo que limpia los filtros

function cleanForm() {
    $('#estados').prop('selectedIndex', 0);
    $('#municipios').prop('selectedIndex', 0);
    $('#colonias').prop('selectedIndex', 0);
    $("#municipios option").each(function() {
        $(this).remove();
    });
    $("#colonias option").each(function() {
        $(this).remove();
    });
    $("#municipios").append(
        $("<option></option>")
        .attr("value", "")
        .text("Todos los Municipios / Alcaldías")
    );
    $("#colonias").append(
        $("<option></option>")
        .attr("value", "")
        .text("Todas las colonias o asentamientos")
    );
    var dt = new Date();
    var maxDAte = dt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    var dateSplit = maxDAte.split("/");
    var dateDefaultValueCalendar = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];
    $('#dateOf').val(dateDefaultValueCalendar);
    $('#dateTo').val(dateDefaultValueCalendar);
    $(".img-map").css("display", "none");
    $(".map-html").css("display", "block");
    $('.map-cdmx-html').css("display", "none");
    $('.info-pruebas').css("right", "20%");
    initElement();
}

// Metodo que cambia el glyphicon del panel collapse

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
