<!-- 
    @author David Manrique Romero
-->

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css" />
    <link href="/dashboardResources/css/clinic/clinicLocalizacion.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css" />
    <link href="/dashboardResources/lib/DataTables/DataTables-1.10.20/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    
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
            <span class="arrow-bottom"></span>
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

      <section
        class="content"
        id="content-principal"
        name="content-principal"
      >
      <div class="title-centros">
        <label class="textoSub">Centros de salud | Localización</label>
        <div class="dateUpdate">
          <p>Última actualización:</p>
          <p id="datetime"></p>
        </div>
    </div>
    <div class="container-select">
    <div class="row select-component">
      <div class="col-md-4">
        <label>Estado:</label><div>
        <select id="estados">
      </select></div></div>
      <div class="col-md-4">
        <label>Municipio o Alcaldía:</label><div>
        <select id="municipios">
        <option value="">Todos los Municipios / Alcaldías</option>
      </select></div></div>
      <!-- <div class="col-md-4">
      <label>Colonia o Asentamiento:</label><div>
        <select id="colonias">
        <option value="">Todas las colonias o asentamientos</option>
      </select></div></div> -->
    </div>
    </div>
    <div class="container-iframe-map" id="map-localizacion">
      
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

  <script src="/dashboardResources/js/clinic/clinicLocalizacion.js?v={{ config('app.VERSION_JS') }}"></script>
  <script src="/dashboardResources/lib/DataTables/DataTables-1.10.20/js/jquery.dataTables.min.js"></script>
  <script src="/dashboardResources/lib/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAEZVjFiCPnC8pLFEXOs-1sUNHw1O3hyeA&callback=initMap" async defer></script>
</html>
