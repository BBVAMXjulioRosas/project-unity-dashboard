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
                <!-- Modal para el envio de Mensaje-->

            <div class="modal fade" id="modalEnvioMensaje" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">Cerrar &times;</button>
                            <!-- <h4 class="encabezado" >Enviar Mensaje</h4>
                            <h3 class="cuerpo-modal">Escribe aquí el mensaje que deseas enviar</h3> -->
                        </div>
                        <div class="modal-body">
                            <!-- <textarea id="mensaje-text" name="mensaje" id="mensaje" cols="30" rows="10"></textarea> -->
                            <label class="construccion">En construcción</label>
                            
                        </div>
                        <!-- <div class="modal-footer">
                            <button type="button" id="sendMessage" class="btn btn-primary">Enviar mensaje</button>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="contenedor container-fluid">
                <div class="row">
                    <div class="encabezado col col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <label class="texto">Perfiles y resultados</label>
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
                    <div class=" col  col-sm-4 col-md-4 fechas">
                        <label>Desde:</label>
                        <input type="date" name="inicio" id="fechaIni">
                        <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class="col  col-sm-4 col-md-4 fechas">
                        <label> Hasta:</label>
                        <input type="date" name="final" id="fechaFin">
                        <i id="dateOfGlyphicon" class="glyphicon glyphicon-calendar"></i>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 button-form index">
                        <label> Usuarios y resultados</label>
                        <select class="selectMapa" name="filtroMapa" id="filtroMapa"></select>
                    </div>
                </div>

                <div class="row conten-table">
                    <!--div id="vmap" class="map-html" style="width: 950px; height: 800px;"></div-->
                    <div class="row content-paneles" id="paneles-mensaje">
                        <div class="col-xs-12 col-sm-12 col-md-6 content-total-envio">
                            <div class="col-xs-12">
                                <label class="total-registrados">Total de celulares registrados</label>
                            </div>
                            <div class="col-xs-12">
                                <label id="totalRegistros" class="totales"></label>
                            </div>
                            <div class="col-xs-12">
                                <input type="button" value="Enviar Mensaje" data-action="masivo" id="enviar-masivo">
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6 content-total-envio zonas">
                            <div class="col-xs-12">
                                <label class="total-zona">Total de celulares en la zona</label>
                            </div>
                            <div class="col-xs-12">
                                <dt><span id="estado-zona" hidden>Estado</span></dt>
                                <dt><span id="municipio-zona" hidden>Municipio</span></dt>
                                <dt><span id="delegacion-zona" hidden>Delegación</span></dt>
                            </div>
                            <div class="col-xs-12">
                                <label id="usuariosPorZona" class="totales totales-zona"></label>
                            </div>
                            <div class="col-xs-12">
                                <input type="button" value="Enviar Mensaje" class="enviar-zonas" data-action="zona" id="enviar-masivo-zona" disabled>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row graficas-tamis">
                        <div class="col-xs-12 col-sm-6 col-md-6">
                            <label class="title-graficas">Síntomas Primer Tamiz</label>
                            <canvas id="chartBar1"></canvas>
                        </div>
                        <!-- <div class="col-xs-12 col-sm-6 col-md-6">
                            <label class="title-graficas">Síntomas Segundo Tamiz</label>
                            <canvas id="chartBar2"  style="height:12vh; width:15vw"></canvas>
                        </div> -->
                        <div class="col-xs-12 col-sm-6 col-md-6">
                            <label class="title-graficas">Género y Edad</label>
                            <canvas id="chartStack1"></canvas> 
                        </div>
                        <!-- <div class="col-xs-12 col-sm-6 col-md-6 segunda-grafica">
                            <label class="title-graficas">Derechohabiente</label>
                            <canvas id="chartPie3"  style="height:12vh; width:15vw"></canvas>
                        </div> -->
                    </div>
                    <!-- Mapa -->
                    <div class="tabla-colores">
                        <div class="colores col-sm-4 col-md-4 col-sm-offset-8 col-md-offset-8">
                            <p><span class="dott" style="background-color: #e4d1aa;"></span>0 - 1,000 Registros</p>
                            <p><span class="dott" style="background-color: #dbb66a;"></span>1,000 - 4,000 Registros</p>
                            <p><span class="dott" style="background-color: #b09661;"></span>4,000 - 7,000 Registros</p>
                            <p><span class="dott" style="background-color: #ff9417;"></span>7,000 - 10,000 Registros</p>
                            <p><span class="dott" style="background-color: #ce5656;"></span>10,000 - 13,000 Registros</p>
                            <p><span class="dott" style="background-color: #911625;"></span>13,000 - 16,000 Registros</p>
                            <p><span class="dott" style="background-color: #370009;"></span>+ 16,000 Registros</p>
                        </div>
                    </div>

                    <div class="img-map">
                        <img id="mapMexico" src="">
                    </div>

                    <div class="map-html">
                        
                    </div>
                    <div class="description"></div>

                    <!--Fin del Mapa-->

                    <div class="row content-info-usuarios">
                        <div class="col-xs-12 col-sm-3 col-md-3">
                            <div class="info-usuarios">
                                <label class="titulo-info">Total Usuarios</label>
                                
                                <p><span id= "total-usuarios-card"></span></p>

                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                            <div class="info-usuarios">
                                <label class="titulo-info">Usuarios con perfiles adicionales</label>
                                
                                <p><span id= "usuario-perfiles"></span></p>
                                <p  class="porcentaje"><span id= "porcentaje-usuario-perfiles"></span> % del total de usuarios</p>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                            <div class="info-usuarios">
                                <label class="titulo-info">Promedio de periles por usuario</label>
                                
                                <p><span id= "promedio-perfiles"></span></p>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                            <div class="info-usuarios">
                                <label class="titulo-info">Total de Perfiles</label>
                                
                                <p><span id= "total-perfiles"></span></p>
                            </div>
                        </div>
                    </div>


                    <div class="col-sm-12 col-md-12">
                        <table id="tabla-datos" class="order-column dataTable">

                        </table>
                        <div class="paginacion row" style="text-align: center;">
                            <input type="button" class=" col-sm-3" value="Atrás" id="paginaAnterior"> 

                            <div id="paginadoTabla" class="col-sm-4" style="overflow-x: hidden;white-space: nowrap;">

                            </div>
                            <input type="button" class=" col-sm-3" value="Siguiente" id="siguientePagina">
                        </div>
                        <table class="table-footer totales">
                            <tfoot>
                                <tr>
                                    <td class="total-celular"><label class="texto"> Mostrando <span id="tamañoPagina"></span>
                                            de: <span id="totalRegistrosFooter"></span></label></td>
                                </tr>
                            </tfoot>
                        </table>
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


<script src="/dashboardResources/js/registroVisitas.js?v={{ config('app.VERSION_JS') }}"></script>

</html>