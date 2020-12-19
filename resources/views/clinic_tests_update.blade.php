<!-- 
    @author David Manrique Romero
-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/DataTables/DataTables-1.10.20/css/jquery.dataTables.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/bootstrap4-glyphicons/css/bootstrap-glyphicons.min.css" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/css/clinic/clinic_tests_update.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>

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
          <div class="logout"><span class=arrow-bottom></span></div>
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
          <label class="textoSub">Centros de salud | Puebas y resultados</label>
          <div class="dateUpdate">
            <p>Última actualización:</p>
            <p id="datetime"></p>
          </div>
      </div>
      <div class="container-upload">
        <div class="col-md-3 upload">
            <button type="button" id="newRegistry" class="btn btn-info upload-file">
            <span class="glyphicon glyphicon-th-list"></span>Nuevo registro
            </button>
        </div>
        <div class="col-md-3 upload">
        <input type="button" name="file" id="file"  class="inputfile"/>
        <label for="file"><span style="padding-right:3px; padding-top: 3px;">
            <img class="img-glyphicon" src="/dashboardResources/img/iconfinder_upload.svg"></img>
            </span>Subir nuevo listado</label>
        <p class="legend"><span class="glyphicon glyphicon-exclamation-sign">
            </span>Se aceptan archivos .csv</p>
            <p id="fileAdd" class="legend">No se ha agregado ningun archivo</p>
        </div>
        <div class="col-md-3 upload">
            <button type="button" class="btn btn-info download-file" id="downloadFile">
                <span class="glyphicon glyphicon-download-alt"></span>Descargar listado actual
            </button>
            <p class="legend"><span class="glyphicon glyphicon-exclamation-sign">
            </span>Se descargara el listado</p>
            <p class="legend">actual de centros de salud</p>
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
                <div class="title-centros filters">
                  <label>Filtrar por región o capacidad de pruebas</label>
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
              <div class="select-component two-filter">
                <div class="col-md-4">
                  <label>Servicio de pruebas:</label>
                  <select id="servicioPruebas">
                    <option value="1">SI</option>
                    <option value="0">NO</option>
                  </select>
                </div>
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
      </div>
      <div class="container-list">
            <label class="textoSub">Listado de centros de salud</label>
              <div class="info-capacity">
              <div><span class="doti" style="background-color: #12322b;"></span>Normal</div>
              <div><span class="doti" style="background-color: #bd9869;"></span>Límite</div>
              <div><span class="doti" style="background-color: #690f1d;"></span>Saturada</div></div>
      </div>
        
          <div class="table-centros" id="table-centros"></div>
          <div id="footerTable"></div>
        
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
    <div class="modal fade" id="modalConstruction" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">Cerrar &times;</button>
                        </div>
                        <div class="modal-body">
                          <label class="construccion">En construcción</label>
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
  <script src="/dashboardResources/js/clinic/clinic_tests_update.js?v={{ config('app.VERSION_JS') }}"></script>
</html>