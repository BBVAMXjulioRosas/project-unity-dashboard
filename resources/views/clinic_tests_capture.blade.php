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
    <link href="/dashboardResources/css/clinic/clinic_tests_capture.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>

    <script>const BACK_URL = '{{ Config::get('app.url') }}';</script>
    <script src="/dashboardResources/js/jquery-3.5.0.min.js"></script>
    <script src="/dashboardResources/js/user.js?v={{ config('app.VERSION_JS') }}"></script>
</head>
<body>
<a name="init"></a>
  <input type="text" id="idRegistry" hidden="true">
  <input type="text" id="idHospital" hidden="true">
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
      <div class="btn-return">
            <button type="button" id="returnPage" class="btn btn-link return">
            <span class="glyphicon glyphicon-arrow-left"></span>Regresar
            </button>
      </div>
      <div class="form-capture select-component">
        <div class="col-md-4">
            <label for="nameHospital">Nombre</label>
            <div><input type="text" name="nameHospital" id="nameHospital"></div></div>
        <div class="col-md-4">
            <label>Estado:</label><div>
            <select id="estados">
            </select></div></div>
        <div class="col-md-4">
            <label>Municipio o Alcaldía</label><div>
            <select id="municipios">
            <option value="">Todos los Municipios / Alcaldías</option>
            </select></div></div>
        <div class="col-md-4">
            <label>Colonia o Asentamiento</label><div>
            <select id="colonias">
            <option value="">Todas las colonias o asentamientos</option>
            </select></div></div>
            <div class="container-calendar">
            <div class="col-md-4">
                    <label>Fecha:</label><div>
                    <input type="date" name="inicio" id="dateOf" required="required">
                    <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i></div>
            </div></div>
        <div class="col-md-4">
            <label>Servicio de pruebas</label>
            <div><input type="radio" name="radioBtn" id="radioBtnYes" checked><label for="radioBtnYes">Si</label>
            <input type="radio" name="radioBtn" id="radioBtnNo"><label for="radioBtnNo">No</label></div>
            </div>
        <div class="col-md-4">
            <label for="totalCapacity">Capacidad de pruebas por dia</label>
            <div><input type="text" name="totalCapacity" id="totalCapacity"></div></div>
        <div class="col-md-4">
            <label for="occupiedCapacity">Capacidad ocupada</label>
            <div><input type="text" name="occupiedCapacity" id="occupiedCapacity"></div></div>
        <div class="col-md-4">
            <label for="totalTest">Pruebas realizadas</label>
            <div><input type="text" name="totalTest" id="totalTest"></div></div>
        <div class="col-md-4">
            <label for="positiveTest">Pruebas positivas</label>
            <div><input type="text" name="positiveTest" id="positiveTest"></div></div>
        <div class="col-md-4">
            <label for="negativeTest">Pruebas negativas</label>
            <div><input type="text" name="negativeTest" id="negativeTest"></div></div>
        <div class="col-md-4 btn-contain">
            <button class="btn btn-primary" id="cleanForm">Limpiar</button>
            <button class="btn btn-primary" id="btnDeleteRegistry">Eliminar</button>
            <button class="btn btn-primary" id="saveRegistry">Guardar</button></div>
      </div>
      </section>
    </div>

    <footer>    
      <div class="footer-container">
        <div class="logoFooter"></div>
      </div>
      <div class="pleca"></div>
    </footer>

    <div class="modal fade bd-example-modal-sm" id="modalSuccess" tabindex="-1" role="dialog" aria-hidden="true" data-keyboard="false"data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer">
          <button type="button" id="closeModal" class="btn btn-primary">Cancelar</button>
          <button type="button" id="btnModal" class="btn btn-primary">Aceptar</button></div>
        </div>
      </div>
    </div>


</body>
  <script src="/dashboardResources/lib/DataTables/DataTables-1.10.20/js/jquery.dataTables.min.js"></script>
  <script src="/dashboardResources/lib/bootstrap-4.4.1-dist/js/bootstrap.min.js"></script>
  <script src="/dashboardResources/js/clinic/clinic_tests_capture.js?v={{ config('app.VERSION_JS') }}"></script>
</html>