/**
 * @author David Manrique Romero
 */

$(document).ready(function(){
    var dt = new Date();
    $('#datetime').text(dt.toLocaleDateString("es", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }));

    getEstados();
    $("#estados").change(function() {
        getMunicipios();
    });
    $("#municipios").change(function() {
        getColonias();
    });

    $('#returnPage').click(function(){
        location.href="/dashboard/clinic/administration"
    })

    $('#saveRegistry').click(function(){
        sentData();
    })
 
    $('#btnDeleteRegistry').click(function(){
        deleteModal();
    })
    $('#cleanForm').click(function(){
        cleanForm();
    })
    $('#closeModal').css('display', 'none');
    addEventInputs();
    window.onloadeddata = initElement();
})
// Metodo de inicializacion del los elementos de la pantalla
function initElement(){
    var dataStorage = sessionStorage.getItem('data_modificate');
    if(dataStorage != null){
        $('.form-capture').css("display", "none");
        $('#btnDeleteRegistry').css("display", "block");
        $('#cleanForm').css("display", "none");
        getDataStore(JSON.parse(dataStorage));
    }else{
        dateCalendarForm();
        $('#cleanForm').css("display", "block");
        $('#btnDeleteRegistry').css("display", "none");
    }
}
//Metodo par inicializador de fechas en la pantalla
function dateCalendarForm(){
    var dtDefault = new Date();
    var dfDefaultFormat = dtDefault.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    var dateSplit = dfDefaultFormat.split("/");
    var dateDefaultValueCalendar = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];

    $('#dateOf').val(dateDefaultValueCalendar);
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
        url: API_URL + '/admins/states',
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
}

//Metodo de envio de informacion a guardar, para crear y editar
function sentData(){
    var dataForm;
    var url_API;
    var method;
    var idRegistry = $('#idRegistry').val();
    var hospitalID = $('#idHospital').val();
    var nameHostpital = $('#nameHospital').val();
    var stateID = $('#estados').val();
    var municipalityID = $('#municipios').val();
    var suburbID = $('#colonias').val();
    var dateOf = Date.parse($('#dateOf').val() + ' 23:59:59') / 1000.00;
    var testingService;
    var radio = document.getElementsByName("radioBtn");
    if (radio[0].checked == true) {
        testingService = true;
    } else if (radio[1].checked == true) {
        testingService = false;
    }
    var totalCapacity = $('#totalCapacity').val();
    var occupiedCapacity = $('#occupiedCapacity').val();
    var totalTest = $('#totalTest').val();
    var positiveTest = $('#positiveTest').val();
    var negativeTest = $('#negativeTest').val();
    var dataForm;
    var dataFormCreate = {
        "name": nameHostpital,
        "stateID": parseInt(stateID),
        "municipalityID": parseInt(municipalityID),
        "suburbID": parseInt(suburbID),
        "timestamp": dateOf,
        "totalCapacity": parseInt(totalCapacity),
        "occupiedCapacity": parseInt(occupiedCapacity),
        "totalTest": parseInt(totalTest),
        "positiveTest": parseInt(positiveTest),
        "negativeTest": parseInt(negativeTest),
        "search": 0,
        "testingService": testingService
      };
      var dataFormEdit = {
        "hospitalID": hospitalID,
        "name": nameHostpital,
        "stateID": parseInt(stateID),
        "municipalityID": parseInt(municipalityID),
        "suburbID": parseInt(suburbID),
        "timestamp": dateOf,
        "totalCapacity": parseInt(totalCapacity),
        "occupiedCapacity": parseInt(occupiedCapacity),
        "totalTest": parseInt(totalTest),
        "positiveTest": parseInt(positiveTest),
        "negativeTest": parseInt(negativeTest),
        "search": 0,
        "testingService": testingService
      };
      if(hospitalID == ""){
        dataForm = dataFormCreate;
        url_API = API_URL + '/admins/hospitals/tests';
        method = "post";
        
      }else{
        dataForm = dataFormEdit;
        url_API = API_URL + '/admins/hospitals/'+hospitalID+'/tests/'+idRegistry;
        method = "put";
      }

      var arrField =['nameHospital','estados','municipios', 'colonias','totalCapacity','occupiedCapacity','totalTest','positiveTest','negativeTest']

      if(validator(arrField)){
        $.ajax({
            url: url_API,
            type: method,
            contentType: "application/json",
            data: JSON.stringify(dataForm),
            success: function(result){
                $('.childModal').remove();
                $('#modalBody').append('<img class="childModal" src="/dashboardResources/img/success.png"></img>'+
                '<p class="childModal">Centro de salud</p><p class="childModal">guardado con éxito.</p>');
                $('#btnModal').unbind();
                $('#btnModal').click(function (){
                    location.href="/dashboard/clinic/administration";
                });
                $("#modalSuccess").modal('show');
            },error : function(jqXHR,textStatus,errorThrown){
                $('#modalBody').append('<img class="childModal" src="/dashboardResources/img/error.png"></img>'+
                '<p class="childModal">Error al guardar el registros</p><p class="childModal">Intentelo mas tarde</p>');
                $('#btnModal').unbind();
                $('#btnModal').click(function (){
                    $("#modalSuccess").modal('hide');
                });
            }
      
        })
      }else{
        window.location.href= '#init'
      }
}

//Metodo que obtiene la informacion obtenida de la tabla cuando da clic en Editar, se guarda temporalmente en la session store
function getDataStore(data){
    $('#idRegistry').val(data.id);
    $('#idHospital').val(data.hospitalID);
    $('#nameHospital').val(data.name);
    $('#dateOf').val();
    $('#totalCapacity').val(data.totalCapacity);
    $('#occupiedCapacity').val(data.occupiedCapacity);
    $('#totalTest').val(data.totalTest);
    $('#positiveTest').val(data.positiveTest);
    $('#negativeTest').val(data.negativeTest);
    var newDate = new Date(data.timestamp * 1000);
    var dfDefaultFormat = newDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    var dateSplit = dfDefaultFormat.split("/");
    var dateDefaultValueCalendar = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];

    $('#dateOf').val(dateDefaultValueCalendar);
    
    if(data.testingService){
        $('#radioBtnYes').attr('checked', true);
        $('#radioBtnNo').attr('checked', false);
    }else{
        $('#radioBtnYes').attr('checked', false);
        $('#radioBtnNo').attr('checked', true);
    }
    var arrField =['nameHospital','estados','municipios', 'colonias','totalCapacity','occupiedCapacity','totalTest','positiveTest','negativeTest']
    setTimeout(function(){ 
        $('#estados option[value='+data.stateID+']').attr('selected', true);
        getMunicipios();
        setTimeout(function(){
            $('#municipios option[value='+data.municipalityID+']').attr('selected', true);
             getColonias();
                setTimeout(function(){ 
                    $('#colonias option[value='+data.suburbID+']').attr('selected', true);
                    
                    if(validator(arrField)){
                        $('.form-capture').css("display", "block");
                        sessionStorage.removeItem('data_modificate');
                    }else {
                        $('#modalBody').append('<img class="childModal" src="/dashboardResources/img/error.png"></img>'+
                        '<p class="childModal">Error al cargar la información</p>');
                        $('#btnModal').unbind();
                        $('#btnModal').click(function (){
                            location.href="/dashboard/clinic/administration";
                        });
                        $("#modalSuccess").modal('show');
                    }
                },300)
            },300)
    }, 300);
    
}

//Metodo que limpia el formulario
function cleanForm() {

    var arrField =['nameHospital','totalCapacity','occupiedCapacity','totalTest','positiveTest','negativeTest']
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
    arrField.forEach(element => {
        $('#'+element).val("")
    })
    var dateSplit = maxDAte.split("/");
    var dateDefaultValueCalendar = dateSplit[2] + "-" + dateSplit[0] + "-" + dateSplit[1];
    $('#dateOf').val(dateDefaultValueCalendar);
    $('#dateTo').val(dateDefaultValueCalendar);
    $('#radioBtnYes').attr('checked', true);
    $('#radioBtnNo').attr('checked', false);
    initElement();
}

//Valida que los campos esten llenos antes de enviar
function validator(arrFields){
    var correctForm = true;
    arrFields.forEach(element => {
        var field = $('#'+element);
        if(field.val().length > 0){
            field.css("border-color", "black");
            field.css("border", "0");
        }else{
            field.css("border", "2px solid");
            field.css("border-color", "red");
            correctForm = false;  
        }  
    });
    return correctForm;
}
//Agrega el metodo de validatorNumber a los campos numericos
function addEventInputs(){
    var arrField =['totalCapacity','occupiedCapacity','totalTest','positiveTest','negativeTest']
    arrField.forEach(element => {
        $('#'+element).keyup(function(){
            validatorNumber(this);
        });
    })
    arrField.forEach(element => {
        $('#'+element).blur(function(){
            validatorNumber(this);
        });
    })
}
//Valida que no ingresen letras o simbolos en los campos numericos
function validatorNumber(field){
    var valueField = $('#'+field.name).val();
    valueField = valueField.replace(/[^0-9]/g, "");
    $('#'+field.name).val(valueField);
}

//Metodo que realiza el borrado de un registro
function deleteRegistry(){
    var idRegistry = $('#idRegistry').val();
    var idHospital = $('#idHospital').val();
    $.ajax({
        method: 'DELETE',
        contentType: 'application/json',
        url: API_URL + '/admins/hospitals/'+idHospital+'/tests/'+idRegistry,
        success: function(result) {
            $('.childModal').remove();
            $('#modalBody').append('<img class="childModal" src="/dashboardResources/img/success.png"></img>'+
            '<p class="childModal">Registro eliminado</p>');
            $('#closeModal').css('display', 'none');
            $('#btnModal').unbind();
            $('#btnModal').click(function (){
                location.href="/dashboard/clinic/administration";
            });
        }
    });
}

//Metodo que realiza la llamada del modal cuando se elimina un registro
function deleteModal(){
    $('.childModal').remove();
    $('#modalBody').append('<p class="childModal">Seguro quieres eliminar el registro</p>');
    $('#closeModal').css('display', 'block');
    $('#closeModal').click(function (){
        $("#modalSuccess").modal('hide');
        $('#closeModal').css('display', 'none');
    });
    $('#btnModal').unbind();
        $('#btnModal').click(function (){
            deleteRegistry();
        });
    $("#modalSuccess").modal('show');
}