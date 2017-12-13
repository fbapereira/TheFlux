app.controller('addUsuarioCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    $scope.targetUsuario = {};
    $scope.loggedUsuario = dataservice.getUsuario();

    //Inicia Processo
    U2X_ConfiguraInterface();
    validaLogin();
    $('.collapsible').collapsible();

    $scope.btnAdd = function () {

        if (!$scope.targetUsuario.login) {
            this.toasterService.pop('success', 'Digite o [login].');
            return;
        }

        if (!$scope.targetUsuario.senha) {
            this.toasterService.pop('success', 'Digite a [senha].');
            return;

        }

        U2X_AbreLoader();
        $scope.targetUsuario.id_instituicao = $scope.loggedUsuario.id_instituicao;

        $http({
            method: 'POST',
            url: dataservice.url + '/api/usuario',
            data: $scope.targetUsuario
        }).then(function sucess(response) {
            $location.path("/usuario");
            U2X_FechaLoader();
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            $location.path("/usuario");
            U2X_FechaLoader();
            return;
        });

    }

    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }

        if (!oUsuario.isAdmin) {
            $location.path("/");
            U2X_FechaLoader();
        }
    }
});

