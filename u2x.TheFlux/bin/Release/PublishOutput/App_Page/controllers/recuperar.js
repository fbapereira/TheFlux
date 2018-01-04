
app.controller('recuperarCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    U2X_ConfiguraInterface();

    $scope.recuperar = function () {

        if (!$scope.login || $scope.login == "") {
            Materialize.toast('Favor preencher [Login].', 4000);
            return;
        }

        var value = {};
        value.login = $scope.login;

        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Senha_Resetar',
            data: value
        }).then(function sucess(response) {
            var email = response.data.email;
            email = email.split("@")[0][0] + "...@" + email.split("@")[1];
            Materialize.toast('Sua nova senha foi enviada para o email ' + email, 4000);
            U2X_FechaLoader();

        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

});