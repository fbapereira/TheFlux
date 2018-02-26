app.controller('loginCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    var oUsuario;

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    //Self Login
    oUsuario = dataservice.getUsuario();
    if (oUsuario) {
        LoginAtServer();
    } else {
        U2X_FechaLoader();
    }

    //Login
    $scope.Login = function () {
        oUsuario = {};
        oUsuario.login = $scope.login;
        oUsuario.senha = $scope.senha;
        LoginAtServer();
    };

    function ValidaTipoUsuario() {
        return new Promise(
            function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: dataservice.url + '/api/Instituicao/' + oUsuario.id,
                    data: oUsuario
                }).then(function sucess(response) {
                    if (response && response.data) {
                        resolve(response.data);
                    }
                    resolve(0);

                }, function errorCallback(response) {
                    resolve(0);
                });

            });
    }

    function LoginAtServer() {
        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Login',
            data: oUsuario
        }).then(function sucess(response) {
            //Valida Dados
            oUsuario = response.data;

            if (!oUsuario) {
                dataservice.setUsuario({});
                Materialize.toast('Usuario ou senha inválidos', 4000)
                $location.path("/");
                U2X_FechaLoader();
                return;
            }
            // Trata cabecalho
            dataservice.setUsuario(oUsuario);

            ValidaTipoUsuario()
                .then(function sucess(response) {
                    $scope.$emit('usuario_logado', dataservice.getUsuario());
                    U2X_FechaLoader();
                    dataservice.setInstituicao(response);
                }, function errorCallback(response) {
                    console.log(response);
                    Materialize.toast('Não foi possível realizar o login', 4000);
                    $location.path("/");
                    U2X_FechaLoader();
                    return;
                }).then(function () {
                    var oInstituicao = dataservice.getInstituicao();
                    if (oInstituicao.idTipo == 1) {
                        $location.path("/dashboard_admin");
                        $scope.$apply()
                        return;

                    } else {
                        $location.path("/dashboard");
                        $scope.$apply()
                        return;

                    }
                })
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar o login', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        });
    }
});
