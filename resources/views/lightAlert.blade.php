<!DOCTYPE html>
<html lang="es">  
  <head>
    <!-- 
      @author Manuel Lopez Jaguey
    -->
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/DataTables/DataTables-1.10.20/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/css/responsive.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="/dashboardResources/css/lightAlert/lightAlert.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/bootstrap4-glyphicons/css/bootstrap-glyphicons.min.css" rel="stylesheet" type="text/css"/>

    <script>const BACK_URL = '{{ Config::get('app.url') }}';</script>
    <script src="/dashboardResources/js/jquery-3.5.0.min.js"></script>
    <script src="/dashboardResources/js//user.js?v={{ config('app.VERSION_JS') }}"></script>
    <script src="/dashboardResources/js/util/dateUtil.js?v={{ config('app.VERSION_JS') }}"></script>
    <script src="/dashboardResources/js/util/numberUtil.js?v={{ config('app.VERSION_JS') }}"></script>
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
        <div class="risk-content">
          <div class="head-title">
            <div class="title-content">Semáforo recomendado</div>
            <div class="lastUpgrade"></div>
          </div>  

          <div class="container-upload">
            <div class="col-md-3 upload">
            <input type="button" name="file" id="file"  class="inputfile"/>
            <label for="file"><span style="padding-right:3px; padding-top: 3px;">
                <img class="img-glyphicon" src="/dashboardResources/img/iconfinder_upload.svg"></img>
                </span>Subir nuevo listado</label>
            <p class="legend"><span class="glyphicon glyphicon-exclamation-sign">
                </span>Se aceptan archivos .csv</p>
            </div>
            <div class="col-md-3 upload">
                <button type="button" class="btn btn-info download-file" id="downloadFile">
                    <span class="glyphicon glyphicon-download-alt"></span>Descargar listado actual
                </button>
                <p class="legend"><span class="glyphicon glyphicon-exclamation-sign">
                </span>Se descargara el listado actual del sem&aacute;foro</p>
            </div>
          </div>

          <div class="row select-component">
            <div class='col-md-4'>
                <label>Estado</label>
                <select class='estados' name="estados" id="estados">
                    <option>Estado</option>
                </select>
            </div>
            <div class='col-md-4'>
                <label>Municipio o Alcald&iacute;a</label>
                <select class='estados' name="municipio" id="municipio">
                    <option>Municipio</option>
                </select>
            </div>
            <div class='col-md-4'>
                <label>Sem&aacute;foro</label>
                <select class='semaforo' name="semaforo" id="semaforo">
                    <option value="">Todos</option>
                    <option value="very-high">M&aacute;ximo</option>
                    <option value="high">Alto</option>
                    <option value="medium">Intermedio</option>
                    <option value="low">Bajo</option>
                </select>
            </div>
          </div>

          <div class="row select-component">
            <div class="col-md-12 map-filter"> 
              <div class="subtitle-content col-md-4"><span>Reporte de b&uacute;squeda</span></div>
              <div class='col-md-2'>
                <select class='filterMap' name="filterMap" id="filterMap">
                    <option value="states">Estados</option>
                    <option value="municipalities">Municipios</option>
                </select>
              </div>
            </div>
            <div class='col-md-12 map-content'>
              <div class="container-iframe-map" id="map"></div>
            </div>   
          </div>

          <div>
            <div class="col-md-12" style="margin-top:50px"> 
              <div id="table-light-alert"></div>
            </div>  
          </div>

        </div>
      </section>
    </div>

    <div class="modal fade bd-example-modal-sm" id="modalFile" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false"data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer">
          <button type="button" id="btnCancel" class="btn btn-primary">Cancelar</button>
          <button type="button" id="btnUpload" class="btn btn-primary">Subir</button></div>
        </div>
      </div>
    </div>

    <div class="modal fade bd-example-modal-sm" id="modalActionFile" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false"data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <input type="hidden" id="file-action">
            <p class="title-action">Archivo seleccionado</p>
            <div class="childModal">
              <div class="type">
                <div class="option-sel" id="option-states">
                  <img class="childModal imgUpload" src="/dashboardResources/img/estados.png"></img>
                  <p class="childModal">Estados</p>
                </div>
                <div class="option-sel" id="option-municipalities">
                  <img class="childModal imgUpload" src="/dashboardResources/img/municipios.png"></img>
                  <p class="childModal">Municipios</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" id="btnCancelAction" class="btn btn-primary">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade bd-example-modal-sm" id="modalNotice" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false"data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <span class="glyphicon glyphicon-ok-circle"></span>
            <span class="glyphicon glyphicon-remove-circle"></span>
            <span class="message-modal">Tu cambio se ha hecho de manera exitosa</span>
            <button type="button" id="closeNotice" >Cerrar</button>    
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

  <script src="/dashboardResources/lib/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
  <script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" />
  <script src="/dashboardResources/lib/DataTables/DataTables-1.10.20/js/jquery.dataTables.min.js"></script>
  <script src="/dashboardResources/js/lightAlert/lightAlert.js?v={{ config('app.VERSION_JS') }}"></script>
</html>