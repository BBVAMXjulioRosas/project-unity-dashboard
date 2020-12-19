<!DOCTYPE html>
<html lang="es">  
  <head>
    <!-- 
      @author Manuel Lopez Jaguey
    -->
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/DataTables/DataTables-1.10.20/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/bootstrap4-glyphicons/css/bootstrap-glyphicons.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/css/manageUsers/manageUsers.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>

    <script>const BACK_URL = '{{ Config::get('app.url') }}';</script>
    <script src="/dashboardResources/js/jquery-3.5.0.min.js"></script>
    <script src="/dashboardResources/js/user.js?v={{ config('app.VERSION_JS') }}"></script>
  </head>
  <body>    
    <header>
      <div class="headerContent">
        <div id="logo"></div>
        <div id="search"></div>
        <div id="user">
          <div class="avatar"><em id="img_avatar"></em></div>
          <div class="user-info"></div>
          <div class="logout">  
            <span class=arrow-bottom></span>
          </div>
        </div>
      </div>
    </header>

    <div class="body">
      <section class="menu"> 
        <nav>
          <ul class="ul-menu"></ul>
        </nav>
      </section>

      <section class="content" id="content-principal" name="content-principal">
        <div class="head-title">
          <div class="title">
              Administraci&oacute;n de usuarios
          </div>
          <div class="lastUpgrade"></div>
        </div>
        <div class="btn-return">
          <button type="button" id="returnPage" class="btn btn-link return">
          <span class="glyphicon glyphicon-mark glyphicon-arrow-left"></span>Regresar
          </button>
        </div>

        <div class="form-capture select-component">

          <div class="col-md-6">
            <label for="name">Nombre</label>
            <div><input type="text" name="name" id="name" data-id=""></div>
          </div>
          
          <div class="col-md-6">
            <labe for="rol"l>Rol</label>
            <div>
              <select id="rol">
                <option value="">Seleccione</option>
                <option value="1">Administrador</option>
                <option value="2">Consultor</option>
              </select>
            </div>
          </div>

          <div class="col-md-6">
            <label for="email">Correo electr&oacute;nico</label>
            <div><input type="text" name="email" id="email"></div>
          </div>

          <div class="col-md-6 btn-contain">
            <button class="btn btn-primary" id="cancelOp">Cancelar</button>
            <button class="btn btn-primary" id="deleteRegistry">Eliminar</button>
            <button class="btn btn-primary" id="saveRegistry">Guardar</button>
          </div>
        </div>
            
      </section>
    </div>

    <div class="modal fade bd-example-modal-sm" id="modalSuccess" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false"data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-img">
            <div class="img-result"></div>
          </div>
          <div class="modal-body" id="modalBody"></div>
            <div class="modal-footer">
              <button type="button" id="btnCloseModal" class="btn btn-primary">Cancelar</button>
              <button type="button" id="btnAccept" class="btn btn-primary">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <footer>
      <div class="footer-container">
        <div class="logoFooter"></div>
      </div>
      <div class="pleca"></div>
    </footer>
  </body>  
  
  <script src="/dashboardResources/lib/DataTables/DataTables-1.10.20/js/jquery.dataTables.min.js"></script>
  <script src="/dashboardResources/lib/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
  <script src="/dashboardResources/js/manageUsers/updateUser.js?v={{ config('app.VERSION_JS') }}"></script>
</html>