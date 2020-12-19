/*
* @author Manuel Lopez Jaguey
*/
let dateToday = new Date();
let users=[];

$(function() {
  getUsers();
  search();
  $(".lastUpgrade").html("Última actualización: " + dateToday.getDate() +" de "+ getMeses()[dateToday.getMonth()] +" de "+ dateToday.getFullYear());
  setMinHeight();
});


function getUsers(){
  setHeaderTable();

  $("#tableUsers").html("");
  $.ajax({
    url: API_URL+"/admins", 
    success: function(result){
      users = result.items;
      users.forEach(user => 
        addCellUser(user)
      );

      $("#totalUsers").html("Total: " + result.total);
    }, complete: function(){
      tableData();
    }
  });  
}

function setHeaderTable(){
  var htmlTable = 
    '<table id="table-all-users" class="display">'+
      '<thead>'+
        '<tr>' +
          '<th>Nombre(s)</th>'+
          '<th>Rol</th>'+
          '<th>Correo electrónico</th>'+
          '<th>Accciones</th>' +
        '</tr>'+
      '</thead>'+
      '<tbody id="tableBodyUsers"></tbody>'+
    '</table>' +
    '<div id="totalUsers"></div>';
    $('#table-users').append(htmlTable);
}

function addCellUser(user){
  let _rolDesc = user.role;
  if("1"==user.role){
    _rolDesc = "Administrador";
  } else if("2"==user.role){
    _rolDesc = "Consultor";
  }
  var htmlTags = '<tr>' +
      '<td>' + user.name    + '</td>' +
      '<td>' + _rolDesc     + '</td>' +
      '<td>' + user.email   + '</td>' +
      '<td><button type="button" data-id="'+user.id+'" onclick="editUser(this)" class="btn btn-info edit"><span class="glyphicon glyphicon-back glyphicon-pencil"></span>Editar</button></td>'+
    '</tr>';
  $('#table-all-users tbody').append(htmlTags); 
}

function search(){
  $("#searchUser").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table-all-users tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
}

function getMeses(){
  return ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
}

function tableData() {
  $("#table-all-users").DataTable(
    {
      filter: false,
      ordering: true,
      lengthChange: false,
      paging: false,
      retrieve: true,
      paging: false,
      searching: false,
      info: false,
      language: {
        emptyTable: "No se encontraron datos"
      },
      columnDefs: [
        {
          "targets": 3,
          "orderable": false
        },
        { "width": "20%", "targets":  0},
        { "width": "30%", "targets":  2},
      ]
    }
  );
}

$('#add-user').click(function(){
  location.href="/dashboard/manageUsers/updateUser?option=new";
})

function editUser(element){
  let idSelected = $(element).attr("data-id");
  users.forEach( function(user, indice) {
    if(user.id==idSelected){
      localStorage.setItem('upUsr', window.btoa(_userSelected=JSON.stringify(user)));
      location.href="/dashboard/manageUsers/updateUser?option=update";
    }
  });
}