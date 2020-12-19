<!-- 
    @author David Alejandro Reyes Domínguez
-->
<!DOCTYPE html>
<html lang="es">

<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css" />
    <link href="/dashboardResources/css/registroVisitas.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css" />
    
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

        <section class="content">
            <div class="contenedor container-fluid">
                <div class="row">
                    <div class="encabezado col col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <label class="texto">Casos Sospechosos</label>
                    </div>
                    <div class="encabezado col col-sm-7 col-md-7 col-lg-7 col-xl-7">
                        <p class="texto-update"> Última actualización: <span id="update"></span></p>
                    </div>
                    <div id="reiniciarFiltros" class="encabezado refresh col col-sm-1 col-md-1 col-lg-1 col-xl-1">
                        <img src="/dashboardResources/img/Refresh_icon.svg">
                    </div>
                </div>

                <div class="row select-component">
                    <div class='col col-sm-4 col-md-4 index'>
                        <label> Estado</label>
                        <select class='estados' name="estados" id="estados">
                            <option>Todos los Estados</option>
                        </select>
                    </div>
                    <div class='col col-sm-4 col-md-4 index'>
                        <label> Municipio o Alcaldía</label>
                        <select class='estados' name="delegacion" id="municipios">
                            <option>Todos los municipios / alcaldías</option>
                        </select>
                    </div>
                    <div class='col col-sm-4 col-md-4 index'>
                        <label> Colonia o asentamiento</label>
                        <select class='estados' name="alcaldia" id="colonias">
                            <option>Todas las colonias o asentamientos</option>
                        </select>
                    </div>
                    <div class='col col-sm-4 col-md-4 fechas'>
                        <label>Desde:</label>
                        <input type="date" name="inicio" id="fechaIni">
                        <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class='col col-sm-4 col-md-4 fechas'>
                        <label> Hasta:</label>
                        <input type="date" name="final" id="fechaFin">
                        <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class='col col-sm-4 col-md-4 index'>
                        <label> Género</label>
                        <select class="selectMapa" name="filtroMapa" id="genero">
                            <option>Todos</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class='col col-sm-5 col-md-4 index'>
                        <label> Temporalidad</label>
                        <div class="row temporalidad">
                            <button id="total-button" class="col-xs-4 col-sm-4 boton-period-selected">Total</button>
                            <button id="month-button" class="col-xs-4 col-sm-4">1 mes</button>
                            <button id="week-button" class="col-xs-4 col-sm-4"> 1 Semana</button>
                        </div>
                    </div>
                    <div class='col col-sm-7 col-md-8 index'>
                        <label> Factor de Riesgo</label>
                        <div class="row temporalidad">
                            <label for="diabetes" class="col-xs-6 col-sm-3 col-md-3"><input type="checkbox" name="" id="diabetes" value="diabetes">
                                Diabetes</label>
                            <label for="hiperten" class="col-xs-6 col-sm-3 col-md-3"><input type="checkbox" name="" id="hiperten" value="hipertension">
                                Hipertensión</label>
                            <label for="obesidad" class="col-xs-6 col-sm-3 col-md-3"><input type="checkbox" name="" id="obesidad" value="Obesidad">
                                Obesidad</label>
                            <label for="defensas" class="col-xs-6 col-sm-3 col-md-3"><input type="checkbox" name="" id="defensas" value="defensas">
                                Defensas Bajas</label>
                        </div>
                    </div>
                </div>

            </div>


            <div class="row tabla-momios">
                <div id="tabla-diabetes" class="col-xs-12 col-sm-6 col-md-6">
                    <label class="title-graficas">Diabetes</label>
                    <label><b>OR: </b><span id="orDiabetes">0</span></label>
                    <label><b>Min: </b><span id="minDiabetes">0</span></label>
                    <label><b>Max: </b><span id="maxDiabetes">0</span></label>
                    <table>
                        <tr>
                            <th scope="row">Exposición</th>
                            <th class="encabezado">Casos</th>
                            <th class="encabezado">No Casos</th>
                        </tr>
                        <tr>
                            <td class="lateral">Expuestos</td>
                            <td><span id="expuestosDiabetes">0</span></td>
                            <td><span id="expuestosDiabetesPorcentaje">0</span></td>
                        </tr>
                        <tr>
                            <td class="lateral">No Expuestos</td>
                            <td><span id="noExpuestosDiabetes">0</span></td>
                            <td><span id="noExpuestosDiabetesPorcentaje">0</span></td>
                        </tr>
                    </table>
                </div>
                <div id="tabla-hiper" class="col-xs-12 col-sm-6 col-md-6">
                    <label class="title-graficas">Hipertensión</label>
                    <label><b>OR: </b><span id="orHiper">0</span></label>
                    <label><b>Min: </b><span id="minHiper">0</span></label>
                    <label><b>Max: </b><span id="maxHiper">0</span></label>
                    <table>
                        <tr>
                            <th scope="row">Exposición</th>
                            <th class="encabezado">Casos</th>
                            <th class="encabezado">No Casos</th>
                        </tr>
                        <tr>
                            <td class="lateral">Expuestos</td>
                            <td><span id="expuestosHiper">0</span></td>
                            <td><span id="expuestosHiperPorcentaje">0</span></td>
                        </tr>
                        <tr>
                            <td class="lateral">No Expuestos</td>
                            <td><span id="noExpuestosHiper">0</span></td>
                            <td><span id="noExpuestosHiperPorcentaje">0</span></td>
                        </tr>
                    </table>
                </div>
                <div id="tabla-obesidad" class="col-xs-12 col-sm-6 col-md-6">
                    <label class="title-graficas">Obesidad</label>
                    <label><b>OR: </b><span id="orObesi">0</span></label>
                    <label><b>Min: </b><span id="minObesi">0</span></label>
                    <label><b>Max: </b><span id="maxObesi">0</span></label>
                    <table>
                        <tr>
                            <th scope="row">Exposición</th>
                            <th class="encabezado">Casos</th>
                            <th class="encabezado">No Casos</th>
                        </tr>
                        <tr>
                            <td class="lateral">Expuestos</td>
                            <td><span id="expuestosObesi">0</span></td>
                            <td><span id="expuestosObesiPorcentaje">0</span></td>
                        </tr>
                        <tr>
                            <td class="lateral">No Expuestos</td>
                            <td><span id="noExpuestosObesi">0</span></td>
                            <td><span id="noExpuestosObesiPorcentaje">0</span></td>
                        </tr>
                    </table>
                </div>
                <div id="tabla-defensas" class="col-xs-12 col-sm-6 col-md-6">
                    <label class="title-graficas">Defensas bajas</label>
                    <label><b>OR: </b><span id="orDefen">0</span></label>
                    <label><b>Min: </b><span id="minDefen">0</span></label>
                    <label><b>Max: </b><span id="maxDefen">0</span></label>
                    <table>
                        <tr>
                            <th scope="row">Exposición</th>
                            <th class="encabezado">Casos</th>
                            <th class="encabezado">No Casos</th>
                        </tr>
                        <tr>
                            <td class="lateral">Expuestos</td>
                            <td><span id="expuestosDefen">0</span></td>
                            <td><span id="expuestosDefenPorcentaje">0</span></td>
                        </tr>
                        <tr>
                            <td class="lateral">No Expuestos</td>
                            <td><span id="noExpuestosDefen">0</span></td>
                            <td><span id="noExpuestosDefenPorcentaje">0</span></td>
                        </tr>
                    </table>
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


<script src="/dashboardResources/js/momios.js?v={{ config('app.VERSION_JS') }}"></script>

</html>