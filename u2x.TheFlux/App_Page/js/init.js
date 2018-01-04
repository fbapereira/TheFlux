var app = angular.module('myApp', ["ngRoute"]);
app
    .directive('myRepeatDirective', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {

                $('.collapsible').collapsible();
                $('select').material_select();
            }
        };
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "controllers/login.html"
            })
            .when("/login", {
                templateUrl: "controllers/login.html"
            })
            .when("/dashboard", {
                templateUrl: "controllers/dashboard.html"
            })
            .when("/movimentacao", {
                templateUrl: "controllers/movimentacao.html"
            })
            .when("/recuperar", {
                templateUrl: "controllers/recuperar.html"
            })
            .when("/pagamento", {
                templateUrl: "controllers/pagamento.html"
            })
            .when("/usuario", {
                templateUrl: "controllers/usuario.html"
            })
            .when("/addusuario", {
                templateUrl: "controllers/add_usuario.html"
            })
            .when("/addmovimentacao", {
                templateUrl: "controllers/add_movimentacao.html"
            })
            .when("/historico", {
                templateUrl: "controllers/historico.html"
            })
            .when("/relatorio", {
                templateUrl: "controllers/relatorio.html"
            })
            .when("/investimento", {
                templateUrl: "controllers/investimento.html"
            })
            .when("/cadastro", {
                templateUrl: "controllers/cadastro.html"
            }); 
    });


app.factory('dataservice', function () {

    var usuario;

    return {
        url: 'http://app.basicflux.com',
           
        setUsuario: function (usuario) {
            if (!usuario || !usuario.login) {
                setCookie("usuario", "");
            }

            usuario = usuario;
            setCookie("usuario", JSON.stringify(usuario));
        },
        getUsuario: function () {
            try {
                var oUsuario = JSON.parse(getCookie("usuario"));
                if (oUsuario.login) {
                    return oUsuario;
                }
                return undefined;
            } catch (e) {
                return undefined;
            }

        }
    };


    function setCookie(cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});

