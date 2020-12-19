var API_URL = `${BACK_URL}/api`;

$(function() {
  __Config.utils.resetPasswordForm();
});

var API_ENDPOINTS = {
  resetPassword: 'admins/password'
};

var __Config = {
    utils: {
        resetPasswordForm: function() {

            $('body').find('.reset-form')
                .on("submit", function(event) {
                    event.preventDefault();
                    let $form = $('.reset-form');
                    let $btn = $form.find('.reset-button');
                    let $hash = $form.find('[name="code"]');
                    let $password = $form.find('[name="password"]');
                    let $confirmPassword = $form.find('[name="confirmPassword"]');
                    let $error = $('.reset-form').find('.error-message');
                    $error.html('').hide();

                    if($password.val()!=$confirmPassword.val()){
                        $error.html("La confirmación de contraseña no coincide").show();
                        return;
                    }

                    $btn.addLoader(function() {
                        __Config.request.api(
                            'POST',
                            API_ENDPOINTS.resetPassword,
                            { hash: $hash.val(), password: $password.val()},
                            { contentType: 'application/x-www-form-urlencoded' }
                        ).then((response) => {
                            __Config.utils.showSuccessPasswordForm();
                        }).catch((error) => {
                            let messageError = "";
                            let objError = JSON.parse(error.responseText);

                            if(objError.password){
                                objError.password.forEach( function(message, index) {
                                    messageError += "<div>"+message + "</div>";
                                });
                            } else {
                                messageError = "Servicio temporalmente no disponible";
                            }
                            $error.html(messageError).show();
                            $btn.removeLoader();
                        })
                    });
            });

            $('body').show();

            $('body').find('.cancel-button')
            .on("click", function(event) {
              location.href="/dashboard/manageUsers";
            });
        },
        showSuccessPasswordForm: function(email) {
            const html = `
                <div class="session-wrapper">
                    <div class="row">
                        <div class="col-12">
                            <form class="success-form">
                                <div class="formSuccess">
                                  <div class="icon-success">
                                    <img src="/dashboardResources/img/success.png">
                                  </div>
                                  <p class="message">La contraseña a sido asignada con éxito</p>
                                  <p class="error-message"></p>
                                  <div class="section-button">
                                    <button class="btn success-button" type="submit" data-i18n="success.accept">Aceptar</button>
                                  </div>
                                </div>
                            </form>
                        </div>    
                    </div>
                </div>
            `;
            $('.session-wrapper').remove();
            $('body').append(html);

            $('body').find('.success-form')
                .on("submit", function(event) {
                    event.preventDefault();
                    location.href="/dashboard";
            });
        }
    },
    request: {
        api: function(method, endpoint, params, conf = {}) {
            let data = params;
            
            switch (method) {
                case 'GET':
                case 'DELETE':
                    break;
                case 'POST':
                case 'PUT':
                default:
                    if(typeof conf.contentType === 'undefined') {
                        data = JSON.stringify(data);
                    }
                break;
            }
            
            if (typeof conf.contentType === 'undefined') {
                conf.contentType = 'application/json';
            }
            
            return $.ajax({
                ...conf,
                data,
                method: method || 'GET',
                url: `${API_URL}/${endpoint}`
            });
        }
    }
};

$.fn.extend({
  isLoading : function() {
      return $(this).hasClass("please_wait");
  },

  addLoader: function(callback) {
      var $this = $(this);
      if (!$this.isLoading()) {

          $this.removeClass("btn-success").find('i.fa-check').remove();
          $this.removeClass("btn-danger").find('i.fa-exclamation-triangle').remove();

          $this.addClass("please_wait")
              .prop("disabled", true)
              .append(
                  $('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
                      .css("color", $this.css("color"))
                      .css("margin-left","5px")
                      .css("position","relative")
                      .css("bottom","2px"));
                      
          $this.parent().find("button").prop("disabled", true);
          $this.parent().find("input[type=button]").prop("disabled", true);
          
          if(callback && typeof(callback) == "function")
              callback();
      }
  },

  removeLoader : function() {
      var $this = $(this);
      if ($this.isLoading()) {
          $this
              .removeClass("please_wait")
              .prop("disabled",false)
              .find(".spinner-border:first")
              .remove();
          $this.parent().find("button").prop("disabled", false);
          $this.parent().find("input[type=button]").prop("disabled", false);
      }
  }
});

$(window).on("orientationchange",function(){
    setMinHeight(event.orientation);
});

function setMinHeight(orientation){
    var heightWindow = $(window).height();
    try {
        var heightScreen;
        
        if("landscape"==orientation){
            heightScreen = screen.width;
        } else {
            
            heightScreen = screen.height;	
        }
                
        if(heightScreen<heightWindow){
            return heightScreen;
        }
    } catch (e) {	}
    $(".body").css("minHeight", (heightWindow-260));
}

function validateEmail(value){
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(value);
}


            
            
