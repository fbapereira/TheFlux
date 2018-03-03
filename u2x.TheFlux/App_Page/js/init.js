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
            .when("/dashboard_admin", {
                templateUrl: "controllers/dashboard_admin.html"
            })
            .when("/dashboard_aluno", {
                templateUrl: "controllers/dashboard_aluno.html"
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
            })
            .when("/alunos", {
                templateUrl: "controllers/alunos.html"
            })
            .when("/mensalidade", {
                templateUrl: "controllers/mensalidade.html"
            })
            .when("/mensalidade_aluno", {
                templateUrl: "controllers/mensalidade_aluno.html"
            })
            .when("/contas", {
                templateUrl: "controllers/contas_futuras.html"
            });
    });


app.factory('dataservice', function () {

    var instituicao;
    var usuario;
    var aluno;

    return {
        _url: 'http://app.basicflux.com',
        url: 'http://localhost:64010',

        setInstituicao: function (oInstituicao) {
            if (!oInstituicao || !oInstituicao.id) {
                setCookie("instituicao", "");
            }

            instituicao = oInstituicao;
            setCookie("instituicao", JSON.stringify(oInstituicao));
        },

        getInstituicao: function () {
            try {
                var oInstituicao = JSON.parse(getCookie("instituicao"));
                if (oInstituicao.id) {
                    return oInstituicao;
                }
                return undefined;
            } catch (e) {
                return undefined;
            }
        },


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
        },


        setAluno: function (aluno) {
            if (!aluno || !aluno.id) {
                setCookie("aluno", "");
            }

            aluno = aluno;
            setCookie("aluno", JSON.stringify(aluno));
        },
        getAluno: function () {
            try {
                var oAluno = JSON.parse(getCookie("aluno"));
                if (oAluno.id) {
                    return oAluno;
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

