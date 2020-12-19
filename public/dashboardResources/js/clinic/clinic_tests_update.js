/**
 * @author David Manrique Romero
 */

$(document).ready(function() {
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
    });
    $("#municipios").change(function() {
        getColonias();
    });
    $("#colonias").change(function() { initElement()});
    $("#servicioPruebas").change(function() {
        initElement();
    });
    $("#btnClean").click(function() {
        cleanForm();
    });
    initElement();

    $('#newRegistry').click(function(){
        sessionStorage.removeItem('data_modificate');
        location.href="/dashboard/clinic/edit";
    })
    $('#downloadFile').click(function(){
        // getDocument();
        $('#modalConstruction').modal('show');
    })
    
    $('#file').click(function(){
        $('#modalConstruction').modal('show');
    })

    // $('.inputfile').change( function(e){
    //     validateFileUpload(this);
	// });
    // $('#content-principal').css("display", "none");
});

// Metodo de inicializacion del los elementos de la pantalla
function initElement(page) {
    var pageInit;
    if(page == "" || page == null || page == undefined){
        pageInit = 0;
    }else{
        pageInit = page;
    }
    var estado = $('#estados').val();
    var municipio = $('#municipios').val();
    var colonia = $('#colonias').val();
    var fecha;
    var fechaDesde = Date.parse($('#dateOf').val()) / 1000.00;
    var fechaHasta = Date.parse($('#dateTo').val() + ' 23:59:59') / 1000.00;
    var testService = $('#servicioPruebas').val();    
    _createTableCentros(estado, municipio, colonia, fechaDesde, fechaHasta, testService, pageInit);
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
    $("#colonias option").each(function() {
        $(this).remove();
    });
    $("#colonias").append(
        $("<option></option>")
        .attr("value", "")
        .text("Todas las colonias o asentamientos")
    );
    initElement();
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
}

// Metodo que realiza el llamado API REST para la tabla de centros de salud
// Realiza la creacion de la tabla
function _createTableCentros(estado, municipio, colonia, fechaDesde, fechaHasta, testingService, page) {
    $("#tableCentrosSalud").remove();
    $("#tableCentrosSalud_wrapper").remove();
    $("#totalRegistros").remove();
    var htmlTable =
        '<table id="tableCentrosSalud" class="display"><thead><tr>' +
        '<th hidden="true"></th><th hidden="true"></th><th hidden="true"></th><th hidden="true"></th>'+
        '<th hidden="true"></th><th hidden="true"></th><th hidden="true"></th>'+
        '<th>Nombre</th><th>Capacidad</th><th>Realizadas</th><th>Positivas</th><th>Negativas</th>' +
        '<th>Fecha</th><th>Servicio de pruebas</th><th>Acciones</th>' +
        '</tr></thead><tbody id="tableBodyCentros"></tbody></table>' +
        '<div id="totalRegistros"></div>';
    $('#table-centros').append(htmlTable);
    var arrLength;
    $.ajax({
        url: API_URL + '/admins/hospitals/tests?stateID=' + estado + '&municipalityID=' +
         municipio + '&suburbID=' + colonia + '&startDate=' + fechaDesde + '&endDate=' + fechaHasta +
         '&testingService=' + testingService + '&page=' + page,
        success: function(result) {
            arrLength = result.items.length;
            result.items.forEach(element => {
                var htmlTags = '<tr>' +
                    '<td hidden="true">'+ element.id + '</td>'+
                    '<td hidden="true">'+ element.hospitalID+ '</td>'+
                    '<td hidden="true">'+ element.occupiedCapacity+ '</td>'+
                    '<td hidden="true">'+ element.search+ '</td>'+
                    '<td hidden="true">'+ element.stateID+ '</td>'+
                    '<td hidden="true">'+ element.municipalityID+ '</td>'+
                    '<td hidden="true">'+ element.suburbID+ '</td>'+
                    '<td>' + element.name + '</td>' +
                    '<td><span class="dot" style="background-color:' + colorCapacity(element.totalCapacity, element.occupiedCapacity) + ';"></span><span>' + new Intl.NumberFormat('en-GB').format(parseInt(element.totalCapacity)) + '</span></td>' +
                    '<td>' + new Intl.NumberFormat('en-GB').format(parseInt(element.totalTest)) + '</td>' +
                    '<td>' + new Intl.NumberFormat('en-GB').format(parseInt(element.positiveTest)) + '</td>' +
                    '<td>' + new Intl.NumberFormat('en-GB').format(parseInt(element.negativeTest)) + '</td>' +
                    '<td>' + dateFormatTable(element.timestamp)+ '</td>'+
                    '<td>'+ convertTestingService(element.testingService)+ '</td>'+
                    '<td><button type="button" onclick="sentInfoTab(this)" class="btn btn-info edit"><span class="glyphicon glyphicon-pencil"></span>Editar</button></td>'+
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

//Metodo que realiza la redireccion del paginado
function redirectPage(ev){
 var page = parseInt(ev.text) - 1;
 initElement(page);
}

//Metodo que realiza la conversion de Boolean a String en el campo de testing service
function convertTestingService(ev){
    var stringTesting;
    if(ev){
        stringTesting = "Si";
    }else if(!ev){
        stringTesting = "No";
    }
    return stringTesting;
}

//Metodo que realiza la conversion de Date en segundos a String en el campo de fecha
function dateFormatTable(dataTime){
    var newDate = new Date(dataTime * 1000);
    var dfDefaultFormat = newDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    var dateSplit = dfDefaultFormat.split("/");
    var dateDefaultValueCalendar = dateSplit[1] + "-" + dateSplit[0] + "-" + dateSplit[2];
    return dateDefaultValueCalendar
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
        },
        "columnDefs": [ {
            "targets": 14,
            "orderable": false
        },
        { "width": "20%", "targets":  7},
        { "width": "12%", "targets":  8}
    ]
    });
}

// Metodo para las fechas que se utilizan de inicio en los calendarios, asi como valores de minDate y maxDatea
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
    $('#servicioPruebas').prop('selectedIndex', 0);
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
    initElement();
}

//Metodo que realiza el guardado de la informacion de la linea del registro a editar en la session store
//Realiza la redireccion a la pantalla de captura
function sentInfoTab(ev){
    var dataEve = ev.parentNode.parentNode.cells;
    var dateFormat = dataEve[""+12+""].textContent;
    var dateFormatSplit = dateFormat.split('-');
    var dateNewFormat = dateFormatSplit[2] + '/' + dateFormatSplit[1] + '/' + dateFormatSplit[0];
    var dateSend = Date.parse(dateNewFormat) / 1000;
    var testingService;
    if(dataEve[""+13+""].textContent === "Si"){
        testingService = true;
    }else if(dataEve[""+13+""].textContent === "No"){
        testingService = false;
    }
    
var dataSendStore = {
    "id" : dataEve[""+0+""].textContent,
    "hospitalID" : dataEve[""+1+""].textContent,
    "name" : dataEve[""+7+""].textContent,
    "totalCapacity" : parseInt(dataEve[""+8+""].textContent.replace(/,/g, "")),
    "occupiedCapacity" : parseInt(dataEve[""+2+""].textContent.replace(/,/g, "")),
    "totalTest" : parseInt(dataEve[""+9+""].textContent.replace(/,/g, "")),
    "positiveTest" : parseInt(dataEve[""+10+""].textContent.replace(/,/g, "")),
    "negativeTest" : parseInt(dataEve[""+11+""].textContent.replace(/,/g, "")),
    "search" : parseInt(dataEve[""+3+""].textContent.replace(/,/g, "")),
    "testingService" : testingService,
    "stateID" : parseInt(dataEve[""+4+""].textContent),
    "municipalityID" : parseInt(dataEve[""+5+""].textContent),
    "suburbID" : parseInt(dataEve[""+6+""].textContent),
    "timestamp" : dateSend
  };
    sessionStorage.setItem('data_modificate', JSON.stringify(dataSendStore));
    location.href="/dashboard/clinic/edit";
}

//Metodo que descarga el documento CSV
function getDocument(){
    $.ajax({
        url: 'https://virtserver.swaggerhub.com/GlobalIncubator/COVID19MX/1.0.5/admins/hospitals/tests/file',
        contentType: 'text/csv',
        dataType: 'binary',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(result) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(result);
            a.href = url;
            a.download = 'hospitals.csv';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },error: function(result){
        }
      })
}

//Metodo que realiza la validacion del archivo adjuntado
function validateFileUpload(e){
    $('#fileAdd').css('color', 'black')
    $('#fileAdd').text('No se ha agregado ningun archivo');
    var filePath = e.files[0].name;
    var fileSize = e.files[0].size;
    var onlyExtensions = /(.csv)$/i;
    if(!onlyExtensions.exec(filePath)){
        $('#file').val('');
        $('#fileAdd').css('color', 'red')
        $('#fileAdd').text('Tipo de archivo no aceptado');
    }else{
        $('#modalBody').append('<p class="childModal">Archivo seleccionado</p>'+
        '<div class="childModal"><div class="childModal"><img class="childModal imgUpload" src="/dashboardResources/img/upload.png"></img></div>' +
        '<p class="childModal">'+filePath+'</p><p class="childModal">'+converterBytes(fileSize)+'</p></div>');
        $('#btnCancel').click(function (){
            $('#file').val('');
            $("#modalFile").modal('hide');
        });
        $('#btnUpload').unbind();
        $('#btnUpload').click(function (){
            sentDocument(filePath);
        });
        $('#btnUpload').text("Subir");
        $('#btnCancel').css("display", "block");
        $('#modalFile').modal('show');
    }
}

//Metodo generico para mostrar el peso del documento
function converterBytes(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }


 //Metodo que realiza el llamado API REST para guardar el CSV cargado
function sentDocument(filePath){
    
    var fileUpload = $('#file').prop('files');    
    if (fileUpload.length > 0) {
        var uploadFile = new FormData();
        uploadFile.append("hospitals", fileUpload[0]);        
        $.ajax({
            url: "https://virtserver.swaggerhub.com/GlobalIncubator/COVID19MX/1.0.5/admins/hospitals/tests/file",
            type: 'POST',
            data: uploadFile,
            contentType: false,
            processData: false,
            cache: false,
            dataType: 'text',
            success: function () {                
                createBarLoad(filePath);
            },
            error: function(){
            }
            });   
    }
}

//Metodo que realiza el llamad de la barra de loader en el modal del archivo
 function createBarLoad(filePath){
     $('.imgUpload').remove();
    $('#modalBody').append('<div class="row childModal"><div class="col-md-offset-3 col-md-5 col-md-offset-3"><div class=".childModal" id="progressLoad">' + 
    '<div id="barLoader">1%</div></div></div></div><p class="childModal">Cargando</p>');
    setTimeout(function(){
        moveBarLoad(filePath);
    $('#btnUpload').css("display", "none");
    $('#btnCancel').css("display", "none");
    },300);
 }

 //Funcion que realiza el llamado del modal para el success cuando se guarda el documento
 function successUpload(filePath){
    $('.childModal').remove();
    $('#btnUpload').css("display", "block")
    $('#modalBody').append('<div class="childModal"></div><div class="childModal"><img class="childModal" src="/dashboardResources/img/success.png"></img></div>'+
    '<p class="childModal">Guardado</p>');
    $('#btnUpload').unbind();
    $('#btnUpload').click(function (){
        $('#modalFile').modal('hide');
        $('.childModal').remove();
        $('#file').val('');
    });
    $('#btnUpload').text('Aceptar');
    $('#fileAdd').css('color', 'black')
    $('#fileAdd').text('Archivo agregado: '+filePath);
 }

//Metdo que realiza la secuencia de la carga del loader
 var iBar = 0;
function moveBarLoad(filePath) {
  if (iBar == 0) {
    iBar = 1;
    var elem = document.getElementById("barLoader");
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        iBar = 0;
        successUpload(filePath);
      } else {
        width++;
        elem.style.width = width + "%";
        elem.innerHTML = width + "%";
      }
    }
  }
}
