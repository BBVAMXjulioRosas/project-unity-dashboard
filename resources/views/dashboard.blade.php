<!DOCTYPE html>
<html lang="es">  
  <head>
    <!-- 
      @author Manuel Lopez Jaguey
    -->
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    <link href="/dashboardResources/css/responsive.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>

    <script>const BACK_URL = '{{ Config::get('app.url') }}';</script>
    <script src="/dashboardResources/js/jquery-3.5.0.min.js"></script>
    <script src="/dashboardResources/js//user.js?v={{ config('app.VERSION_JS') }}"></script>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/bootstrap4-glyphicons/css/bootstrap-glyphicons.min.css" rel="stylesheet" type="text/css"/>
    <script src="/dashboardResources/js/util/dateUtil.js?v={{ config('app.VERSION_JS') }}"></script>
    <script src="/dashboardResources/js/util/numberUtil.js?v={{ config('app.VERSION_JS') }}"></script>
    <link href="/dashboardResources/css/dashboardTest/dashboardTest.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
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
            <div class="title-graph">Pruebas</div>
            <div class="lastUpgrade"></div>
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
                <label>Colonia o asentamiento</label>
                <select class='estados' name="alcaldia" id="alcaldia">
                    <option>Alcaldía</option>
                </select>
            </div>
          </div>

          <div class="filter-date">
            <div class="filter-date-calendar">
              <div class="date">
                <label>Desde:</label>
                <input type="date" name="inicio" id="fechaIni" value="">
                <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i>
              </div>
              <div class="date">
                <label>Hasta:</label>
                <input type="date" name="final" id="fechaFin" value="">
                <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i>
              </div>
            </div>
            <div class="filter-date-period">
              <button data-val="week" class="boton-period-date boton-period-selected">1 semana</button>
              <button data-val="month" class="boton-period-date">1 mes</button>
              <button data-val="threeMonth" class="boton-period-date">3 meses</button>
              <button data-val="total" class="boton-period-date">total</button>
            </div>
          </div>

          <div class="row select-component tab">
            <input type="hidden" value="all" id="tabSelected">
            <div class="tab-content">
            </div>
          </div>

          <div>
            <!--<div class=graph-risk-leyend>
              <div class="graph-risk-content">
              </div>
            </div>-->
            <div id="riskLevel" class="canvas-comtainer">
            </div>
          </div>
          
          <div class="graph-bottom">
            <div class="graph-bottom-area">
              <div class="table-bar">
                <input type="hidden" value="" id="minAge">
                <input type="hidden" value="" id="maxAge">
                <div class="title-graph">Edades</div>
                <div class="graph-bar">
                  <div style="height: 20px; width: 20%; background-color: antiquewhite;"></div>
                </div>  
                <div id="ageRange"></div>
                
                <div class="rangeslider">
                  <input class="min rangeMin" name="range_1" type="range" min="0" max="100" value="0" />
                  <input class="max rangeMax" name="range_1" type="range" min="0" max="100" value="100" />
                  <span class="range_min light left">0 años</span>
                  <span class="range_max light right">+99 años</span>
                </div>

                <div class="warning-graph">
                  <img src="/dashboardResources/img/icon/icon-info.png">
                  <span class="aviso-bar"></span>
                </div>
              </div>

              <div class="graph-bubble">
                <div class="title-graph">G&eacute;nero</div>
                <div class="graph-bubble-content"></div>
                <div class="graph-bubble-area"></div>

                <div class="warning-graph">
                  <img src="/dashboardResources/img/icon/icon-info.png">
                  <span class="aviso-bubble"></span>
                </div>
              </div>
              
            </div>
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
  
  <script src="/dashboardResources/js/Chart.min.js"></script>
  <script src="/dashboardResources/js/dashboardTest/dashBoardTest.js?v={{ config('app.VERSION_JS') }}"></script>
</html>