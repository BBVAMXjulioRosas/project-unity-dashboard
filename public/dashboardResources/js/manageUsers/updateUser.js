/*
* @author Manuel Lopez Jaguey
*/
let dateToday = new Date();
var operation="";

$(function() {
  $(".lastUpgrade").html("Última actualización: " + dateToday.getDate() +" de "+ getMeses()[dateToday.getMonth()] +" de "+ dateToday.getFullYear());
  initForm();
  setMinHeight();
});

function initForm(){

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  operation = urlParams.get('option');

  if(operation=='update'){
    let _user = JSON.parse(window.atob(localStorage.getItem('upUsr')));
    $("#name").attr("data-id",_user.id);
    $("#name").val(_user.name);
    $("#email").val(_user.email);
    $("#rol").val(_user.role);
    $("#rol").change();
  } else {
    $("#deleteRegistry").hide();
  }

}

function getMeses(){
  return ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
}

$('#cancelOp').click(function(){
  location.href="/dashboard/manageUsers";
})  

$('#returnPage').click(function(){
  location.href="/dashboard/manageUsers";
})

$('#saveRegistry').click(function(){
  let arrFields = ['name', 'rol', 'email'];
  if(validator(arrFields)){
    $("#modalSuccess").modal('show');

  if(operation=='update'){
    $("#modalBody").html("Al dar clic en aceptar se actualizará el usuario " + $("#name").val());
    $('#btnAccept').addClass('update-user');  
  } else {
    $("#modalBody").html("Al dar clic en aceptar se creará el usuario " + $("#name").val());
    $('#btnAccept').addClass('save-user');
  }
  }
})

$('#deleteRegistry').click(function(){
  $("#modalSuccess").modal('show');
  $("#modalBody").html("¿Estás seguro de querer eliminar al usuario " + $("#name").val() + "?");
  $('#btnAccept').addClass('delete-user');
})

$('#btnAccept').click(function(){
  if($('#btnAccept').hasClass('delete-user')){
    deleteUser();
  } else if($('#btnAccept').hasClass('save-user')){
    saveUser();
  } else if($('#btnAccept').hasClass('update-user')){
    updateUser();
  } else {
    location.href="/dashboard/manageUsers";
  }
})

function saveUser(){
  const _user = {
    "email": $("#email").val(),
    "name": $("#name").val(),
    "role": $("#rol").val()
  };

  $.ajax({
    url: API_URL+"/admins/invite",
    type: "POST",
    data: _user,
    success: function(result){
      $("#btnCloseModal").hide();
      $("#modalBody").html("El usuario " + $("#name").val() + " ha sido creado con éxito");
      $('#btnAccept').removeClass('save-user');
      $(".img-result").addClass("img-success");
    }, error: function(result){
      setError(result);
    }
  });
}

function updateUser(){
  const idUser =  $("#name").attr("data-id");

  const _user = {
    "email": $("#email").val(),
    "name": $("#name").val(),
    "role": $("#rol").val()
  };

  $.ajax({
    url: API_URL+"/admins/"+idUser,
    type: "PUT",
    data: _user,
    success: function(result){
      $("#btnCloseModal").hide();
      $("#modalBody").html("El usuario " + $("#name").val() + " ha sido actualizado con éxito");
      $('#btnAccept').removeClass('update-user');
      $(".img-result").addClass("img-success");
    }, error: function(result){
      setError(result);
    }
  });
}

function deleteUser(){
  const idUser =  $("#name").attr("data-id");

    $.ajax({
      url: API_URL+"/admins/"+idUser,
      type: "DELETE",
      success: function(result){
        $("#btnCloseModal").hide();
        $("#modalBody").html("El usuario " + $("#name").val() + " ha sido borrado con éxito");
        $('#btnAccept').removeClass('delete-user');
        $(".img-result").addClass("img-success");
      }, error: function(result){
        setError(result);
      }
    });
}

$('#btnCloseModal').click(function(){
  $("#modalSuccess").modal('hide');
})

function validator(arrFields){
  var correctForm = true;
  arrFields.forEach(element => {
      var field = $('#'+element);
      if( (field.val().length > 0 && element!='email') || (element=='email' && validateEmail(field.val()))){
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


function setError(result){
  debugger;
  $(".img-result").addClass("img-error");
  if(result.responseJSON && result.responseJSON.message){
    $("#modalBody").html("Acción no realizada: " + result.responseJSON.message);
  } else {
    $("#modalBody").html("Servicio temporalmente no disponible");
  }

  $("#btnCloseModal").hide();
  $('#btnAccept').removeClass('delete-user');
  $('#btnAccept').removeClass('save-user');
  $('#btnAccept').removeClass('update-user');
}

function validateEmail(value){
  var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(value);
}