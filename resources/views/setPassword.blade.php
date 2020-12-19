<!DOCTYPE html>
<html lang="es">  
  <head>
    <meta charset="UTF-8">
    <link href="/dashboardResources/css/master.css?v={{ config('app.VERSION_JS') }}" rel="stylesheet" type="text/css"/>
    
    <script>const BACK_URL = '{{ Config::get('app.url') }}';</script>
    <script src="/dashboardResources/js/jquery-3.5.0.min.js"></script>
    <script src="/dashboardResources/js/password/password.js?v={{ config('app.VERSION_JS') }}"></script>
    <link href="/dashboardResources/lib/bootstrap-4.4.1-dist/bootstrap4-glyphicons/css/bootstrap-glyphicons.min.css" rel="stylesheet" type="text/css"/>
  </head>
  <body>
    <div class="session-wrapper">
        <div class="row">
            <div class="col-12">
                <form class="reset-form">
                    <input name="code" autocomplete="off" type="hidden" value="{{$hash}}" />
                    <p class="message">Introduce tu nueva contraseña </p>
                    
                    <fieldset class="reset-float-label">
                        <input name="password" autocomplete="off" type="password" class="form-control" required />
                        <label for="password" data-i18n="reset.password">Contraseña</label>
                    </fieldset>
                    <fieldset class="reset-float-label">
                        <input name="confirmPassword" autocomplete="off" type="password" class="form-control" required />
                        <label for="confirmPassword" data-i18n="reset.confirmPassword">Confirma contraseña</label>
                    </fieldset>
                    <p class="error-message"></p>

                    <div class="info-message">
                        <ul>                        
                            <li class="message"> La contraseña debe tener por lo menos 10 caracteres</li>
                            <li class="message"> Debe contener al menos dos letras minúsculas</li>
                            <li class="message"> Debe contener al menos dos letras mayúsculas</li>
                            <li class="message"> Debe contener al menos dos números</li>
                            <li class="message"> Debe contener al menos dos caracteres especiales</li>
                            <li class="message"> No usar alguna de tus últimas 6 contraseñas </li>
                        </ul>
                    </div>

                    <div class="section-button">
                        <a class="btn cancel-button"data-i18n="reset.cancel">Cancelar</a>
                        <button class="btn reset-button" type="submit" data-i18n="reset.continue">Continuar</button>
                    </div>
                </form>
            </div>    
        </div>
    </div>

  </body> 
</html>