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


    function LoginAtServer() {
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Login',
            data: oUsuario
        }).then(function sucess(response) {
            //obtem 
            var obj = response.data;

            //Valida Dados
            if (!obj) {
                dataservice.setUsuario({});
                Materialize.toast('Usuario ou senha inválidos', 4000)
                $location.path("/");
                U2X_FechaLoader();
                return;
            }

            // Trata cabecalho
            dataservice.setUsuario(obj);
            $scope.$emit('usuario_logado', obj);
            $location.path("/dashboard");
            U2X_FechaLoader();

        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar o login', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        });
    }
});
