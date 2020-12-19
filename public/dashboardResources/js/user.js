$(function() {
  checkSession();
  addTitle();
});

function addTitle(){
  $("body").addClass("dashboard-covid19");
  $(".footer-container").append("<div class=\"logo2Footer\"></div>");
  $("#logo").html("<div class=\"title\">COVID 19</div><div class=\"subtitle\">App Autoevaluación</div>");
}

function addUser(user){
    const name = (user.name==undefined || user.name.length==0) ? "Usuario " + user.roleDescription : user.name;
    let _rolDesc;
    if("1"==user.role){
        _rolDesc = "Administrador";
    } else if("2"==user.role){
        _rolDesc = "Consultor";
    }

    $(".user-info").html("<div class=\"name\">"+ name +"</div><div class=\"profile\">"+_rolDesc+"</div>");
    $(".logout").append("<span class=menu-logout><img src=\"/dashboardResources/img/logout.png\"><a class=\"close-session\" href=\"#\">Cerrar sesión</a></span>");

    $('body').find('.logout').on("click", function(event) {
        if($(".logout").hasClass("open-logout")){
            $(".logout").removeClass("open-logout")
        } else {
            $(".logout").addClass("open-logout")
        }
    });

    $('body').find('.close-session').on("click", function(event) {
        let token = localStorage.getItem('AUTH-TOKEN');
        __Config.request.api(
            'POST',
            API_ENDPOINTS.logout,
            {},
            {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            }
        ).then((response) => {
            localStorage.removeItem('AUTH-TOKEN');
            window.location.href = '/dashboard';
        });            
    });
}

var __menu ={
    buildMenu: function(user){
        const _path = window.document.location.pathname;
        let menuOptionsHtml = "";
        let optionsMenu = __menu.getOptionsMenu();

        optionsMenu.forEach( function(option, indice) {
            let subOptions = "<ul class=\"ul-suboptions\">";
            let numSubOption = 0;
            let subOptionSelected = false;

            option.subOptions.forEach( function(subOption, indice) {
                if(subOption.roles.includes(user.role)){
                    let _class = "subOption";
                    if(_path==subOption.link){
                        _class+= " subOption-selected";
                        subOptionSelected = true;
                    }
                    subOptions +=  __menu.buildSubOption(subOption.label, subOption.link, _class);
                    numSubOption++;
                }
            });

            if(numSubOption>0){
                subOptions += "</ul>"
                menuOptionsHtml += __menu.buildOptionMenu(option.label, option.link, option.icon, (subOptionSelected) ? "option option-selected" : "option", subOptions);
            }
        });
        $(".ul-menu").html(menuOptionsHtml);
        $('body').find('.container-option').on("click", function(event) {
            event.preventDefault();
            $( ".option-selected" ).each(function( index ) {
                $(this).removeClass("option-selected");
            });

            $(this).parent().addClass("option-selected");
        });
    },

    buildSubOption : function(_label, _path , _class){
        return '<li class=\"'+_class+'\"><div class="container-subOption"><a href=\"'+_path+'\">'+_label+'</a></div></li>';
    },

    buildOptionMenu: function(_label, _path, _icon, _class, subOptions){
        return '<li class=\"'+_class+'\">'
                    +'<div class="container-option">'
                        +'<div class=\"text-option\"><div class=\"icon-menu '+_icon+'\"></div><a href=\"'+_path+'\">'+_label+'</a></div><span class="arrow-bottom"></span>'
                    +'</div>'+subOptions+
                '</li>';
    },

    getOptionsMenu: function (){
        return [{
                label: "Resultados app", link: "#", icon: "icon_home",
                subOptions: [
                    { label: "Pruebas", link: "/dashboard", roles: [1,2] },
                    { label: "Perfiles y resultados", link: "/dashboard/visits", roles: [1,2] },
                    { label: "Casos sospechosos", link: "/dashboard/sospechosos", roles: [1,2] },
                    { label: "Razones de momios", link: "/dashboard/momios", roles: [1,2] },
                ]
            },{
                label: "Centros de salud", link: "#", icon: "icon_centros",
                subOptions: [
                    { label: "Capacidad de pruebas", link: "/dashboard/clinic", roles: [1,2] },
                    { label: "Localización", link: "/dashboard/clinic/localizations", roles: [1,2] },
                ]
            },
            {
                label: "Semáforo", link: "#", icon: "icon_semaforo",
                subOptions: [
                    { label: "Semáforo Recomendado", link: "/dashboard/lightAlert", roles: [1,2] },
                ]
            },
            {
                label: "Administración", link: "#", icon: "icon_admin",
                subOptions: [
                    { label: "Centros de Salud", link: "/dashboard/clinic/administration", roles: [1] },
                    { label: "Usuarios", link: "/dashboard/manageUsers", roles: [1] },
                ]
            }
        ]
    }
}

var API_URL = `${BACK_URL}/api`;

var API_ENDPOINTS = {
    session: 'admins/session',
    login: 'admins/signin',
    logout: 'admins/logout',
    resetPassword: 'admins/resetPassword'
};

var tokenSession = localStorage.getItem('AUTH-TOKEN');
if(tokenSession){
  $.ajaxSetup({
    headers: {
      'Authorization' : `Bearer ${tokenSession}`
    }
  });
}

var __Config = {
    session: {
        isAuthenticated: false,
        user: {},
    },
    utils: {
        showLoader: function(flag) {
            const loader = $('body').find('.loader-wrapper');

            if (flag) {
                if (loader.length) return;

                $('body').append(`
                    <div data-loader class="loader-wrapper">
                        <div class="loader">Loading...</div>
                    </div>
                `);

                $('body').find('.loader-wrapper').show();
            } else {
                if (!loader.length) return;

                $('body').find('.loader-wrapper').remove();
            }
        },
        hideLoginForm: function() {
            $('.session-wrapper').remove();
        },
        showLoginForm: function() {
            const html = `
                <div class="session-wrapper">
                    <div class="row">
                        <div class="col-12">
                            <form class="login-form">
                                <fieldset class="login-float-label">
                                    <input name="email" autocomplete="off" type="text" class="form-control" required />
                                    <label for="email" data-i18n="login.email">Email</label>
                                </fieldset>
                                <fieldset class="login-float-label">
                                    <input name="password" autocomplete="off" type="password" class="form-control" required />
                                    <label for="password" data-i18n="login.password">Password</label>
                                </fieldset>
                                <a href="#" class="changePassword" data-i18n="login.resetPassword">¿Olvidaste tu contraseña?</a>
                                <p class="error-message"></p>
                                <button class="btn login-button" type="submit" data-i18n="login.login">Iniciar sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            $('body').append(html);

            $('body').find('.login-form')
                .on("submit", function(event) {
                    event.preventDefault();
                    const $form = $('.login-form');
                    const $btn = $('.login-button');
                    const $email = $form.find('[name="email"]');
                    const $password = $form.find('[name="password"]');
                    const $error = $form.find('.error-message');

                    $error.html('').hide();

                    if ($email.val() === "") {
                        $email.addClass('is-invalid');
                        return;
                    } else {
                        $email.removeClass('is-invalid');
                    }

                    if ($password.val() === "") {
                        $password.addClass('is-invalid');
                        return;
                    } else {
                        $password.removeClass('is-invalid');
                    }

                    $btn.addLoader(function() {
                        __Config.request.api(
                            'POST',
                            API_ENDPOINTS.login,
                            { email: $email.val(), password: $password.val() },
                            { contentType: 'application/x-www-form-urlencoded' }
                        ).then((response) => {
                            __Config.session.isAuthenticated = true;
                            __Config.session.user = response;

                            localStorage.setItem('AUTH-TOKEN', response.jwt);

                            // __Config.utils.hideLoginForm();
                            window.location.reload();
                        }).catch((error) => {
                            if("Unauthorized user"==error.responseText){
                                $error.html("Usuario y / o contraseña no válidos").show();
                            } else {
                                $error.html(error.responseText).show();
                            }
                            $btn.removeLoader();
                        })
                    });
                });

            $('body').find('.changePassword')
                .on("click", function(event) {
                    __Config.utils.showSendResetForm($( "input[name*='email']" ).val());
            });
        },
        showSendResetForm: function(email) {
            const html = `
                <div class="session-wrapper">
                    <div class="row">
                        <div class="col-12">
                            <form class="reset-form">
                                <p class="message">Ingresa tu correo electronico</p>
                                <fieldset class="reset-float-label">
                                    <input name="email" autocomplete="off" type="text" class="form-control" required value="${email}"/>
                                    <label for="email" data-i18n="reset.email">Email</label>
                                </fieldset>
                                <p class="error-message"></p>
                                <div class="section-button">
                                    <a class="btn cancel-button"data-i18n="reset.cancel">Cancelar</a>
                                    <button class="btn reset-button" type="submit" data-i18n="reset.continue">Continuar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            $('.session-wrapper').remove();
            $('body').append(html);

            $('body').find('.reset-form')
                .on("submit", function(event) {
                    event.preventDefault();
                    const $form = $('.reset-form');
                    const $btn = $('.reset-button');
                    const $email = $form.find('[name="email"]');
                    const $error = $form.find('.error-message');
                    $error.html('').hide();

                    if ($email.val() === "" || !validateEmail($email.val())) {
                        $error.html("Correo no valido").show();
                        return;
                    }

                    $btn.addLoader(function() {
                        __Config.request.api(
                            'POST',
                            API_ENDPOINTS.resetPassword,
                            { email: $email.val()},
                            { contentType: 'application/x-www-form-urlencoded' }
                        ).then((response) => {
                            $btn.removeLoader();
                            __Config.utils.showSuccessResetPasswordForm($email.val());
                        }).catch((error) => {
                            $error.html(error.responseText).show();
                            $btn.removeLoader();
                        })
                    });
            });

            $('body').find('.cancel-button')
            .on("click", function(event) {
                __Config.utils.showLoginForm();
            });
        },
        showSuccessResetPasswordForm: function(email) {
            const html = `
                <div class="session-wrapper">
                    <div class="row">
                        <div class="col-12">
                            <form class="success-form">
                                <div class="formSuccess">
                                  <div class="icon-success">
                                    <img src="/dashboardResources/img/success.png">
                                  </div>
                                  <p class="message">Se ha enviado un correo electronico a ${email}. Sigue las instrucciones para restablecer la contraseña.</p>
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
                    __Config.utils.showLoginForm();
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


function checkSession() {
    __Config.utils.showLoader(true);

    const token = localStorage.getItem('AUTH-TOKEN');

    if (!token) {
        $("body").show();
        __Config.utils.showLoader(false);
        __Config.utils.showLoginForm();
        return;
    } else {
        $("body").show();
    }

    __Config.request.api(
        'GET',
        API_ENDPOINTS.session,
        {},
        {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        }
    ).then((response) => {
        __Config.session.isAuthenticated = true;
        __Config.session.user = response;
        __menu.buildMenu(__Config.session.user);
        addUser(__Config.session.user);
        localStorage.setItem('user', JSON.stringify(__Config.session.user));
        __Config.utils.showLoader(false);
    })
    .catch((error) => {
        __Config.utils.showLoader(false);
        __Config.utils.showLoginForm();
    });
}


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
