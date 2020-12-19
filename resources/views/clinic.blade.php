<!-- 
    @author David Manrique Romero
-->

<!DOCTYPE html>
<html lang="es">  
  <head>  
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/css/clinic/clinic.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/css/clinic/map.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/DataTables/DataTables-1.10.20/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/bootstrap4-glyphicons/css/bootstrap-glyphicons.min.css" rel="stylesheet" type="text/css"/>

    <script>const BACK_URL = '{{ Config::get('app.url') }}';</script>
    <script src="/dashboardResources/js/map_mexico.js"></script>
    <script src="/dashboardResources/js/map_cdmx.js"></script>
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
        <div class="title-centros">
          <label class="textoSub">Centros de salud | Capacidad de pruebas</label>
          <div class="dateUpdate">
            <p>Última actualización:</p>
            <p id="datetime"></p>
          </div>
        </div>
        <div class="content-panel-collapse">
          <div class="panel-group">
            <div class="panel panel-default">
              <div class="panel-heading">
                <label class="panel-title">
                  <!-- <a data-toggle="collapse" href="#collapse1"><i class="more-less glyphicon glyphicon-chevron-up"></i></a> -->
                </label>
              </div>
              <div id="collapse1" class="panel-collapse collapse show">
                <div class="title-centros">
                  <label>Región</label>
                  <div id="btnClean" class="btn-clean">
                    <img src="/dashboardResources/img/Refresh_icon.svg">
                </div>
                </div>
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
                  <div class="col-md-4">
                  <label>Colonia o Asentamiento:</label><div>
                    <select id="colonias">
                    <option value="">Todas las colonias o asentamientos</option>
                  </select></div></div>
                </div>
                <label>Rango de fechas</label>
                <div class="row container-calendar">
                  <div class="col-md-4">
                    <label>Desde:</label><div>
                    <input type="date" name="inicio" id="dateOf" required="required">
                    <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i></div>
                  </div>
                  <div class="col-md-4">
                  <label>Hasta:</label><div>
                    <input type="date" name="final" id="dateTo" required="required">
                    <i id="dateToGlyphicon" class="glyphicon glyphicon-calendar"></i></div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
        <div class="container-map"> 
          <div class="img-map">
            <img id="mapMexico" alt="" src="/dashboardResources/img/map/Map_Of_Mexico.svg">
          </div>
        <div class="map-html" id="map-html">
        <div class="tooltipInfoMap"></div>
        </div>
        <div class="map-cdmx-html" id="map-cdmx-html">
        <div class="tooltipInfoMapCMDX"></div>
        </div>
          <div class="info-pruebas">
            <p><span class="dott" style="background-color: #e4d1aa;"></span>0-20 pruebas</p>
            <p><span class="dott" style="background-color: #dbb66a;"></span>20-50 pruebas</p>
            <p><span class="dott" style="background-color: #b09661;"></span>50-100 pruebas</p>
            <p><span class="dott" style="background-color: #ff9417;"></span>100-200 pruebas</p>
            <p><span class="dott" style="background-color: #ce5656;"></span>200-500 pruebas</p>
            <p><span class="dott" style="background-color: #911625;"></span>500-1,000 pruebas</p>
            <p><span class="dott" style="background-color: #370009;"></span>+1,000 pruebas</p>
          </div>
        </div>
        <div class="container-data-numeric">
          <label class="textoSub">Reporte de pruebas y resultados</label>
          <div class="data-numeric">
            <div class="cardDataNumeric" id="totalNumeric">
              <span class="txtInfo">Totales</span>
              <span class="txtData">10,000</span>
            </div>
            <div class="cardDataNumeric" id="bajoNumeric">
              <span class="txtInfo">Bajo</span>
              <span class="txtData">10,000</span>
            </div>
            <div class="cardDataNumeric" id="medioNumeric">
              <span class="txtInfo">Medio</span>
              <span class="txtData">10,000</span>
            </div>
            <div class="cardDataNumeric" id="altoNumeric">
              <span class="txtInfo">Alto</span>
              <span class="txtData">10,000</span>
            </div>
            <div class="cardDataNumeric" id="capacityNumeric">
              <span lass="txtInfo">Capacidad de test</span>
              <span class="txtData">10,000</span>
            </div>
          </div>
        </div>
        <div class="container-list">
            <label class="textoSub">Listado de centros de salud</label>
            <div class="info-capacity">
              <div><span class="doti" style="background-color: #12322b;"></span>Normal</div>
              <div><span class="doti" style="background-color: #bd9869;"></span>Límite</div>
              <div><span class="doti" style="background-color: #690f1d;"></span>Saturada</div>
            </div>
        </div>
          <div class="table-centros" id="table-centros">
          </div>
          <div id="footerTable"></div>
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

  
  <script src="/dashboardResources/js/clinic/clinic.js?v={{ config('app.VERSION_JS') }}"></script>
  <script src="/dashboardResources/lib/DataTables/DataTables-1.10.20/js/jquery.dataTables.min.js"></script>
  <script src="/dashboardResources/lib/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
  <script src="/dashboardResources/js/clinic/map.js?v={{ config('app.VERSION_JS') }}"></script>
</html>