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
        <div>
          <div class="head-title">
            <div class="title">
               Administraci&oacute;n de usuarios
            </div>
            <div class="lastUpgrade"></div>
          </div>

          <div>
            <div class="search-content">
              <input id="searchUser" type="text" placeholder="Buscar usuario">
              <button class="add-user" id="add-user">
                <span class="glyphicon glyphicon-back  glyphicon-user"></span>
                Agregar usuario
              </button>
            </div>

            <div class="title-content">
              <label>Lista de usuarios</label>
            </div>

            <div id="table-users"></div>

          </div>
        </div>
      </section>
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
  <script src="/dashboardResources/js/manageUsers/manageUsers.js?v={{ config('app.VERSION_JS') }}"></script>
</html>