app.controller('menuCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Obtem ususario 
    $scope.usuario = dataservice.getUsuario();
    $scope.instituicao = dataservice.getInstituicao();

    //Recebe usuario 
    $rootScope.$on('usuario_logado', function (e, args, status) {
        $scope.usuario = dataservice.getUsuario();
        $scope.instituicao = dataservice.getInstituicao();
    });

    // log Out
    $scope.LogOut = function () {
        $scope.usuario = undefined;
        dataservice.setUsuario(undefined);
        $location.path("/login");
    }
});

