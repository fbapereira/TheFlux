app.controller('menuCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Obtem ususario 
    $scope.usuario = dataservice.getUsuario();

    //Recebe usuario 
    $rootScope.$on('usuario_logado', function (e, args, status) {
        $scope.usuario = dataservice.getUsuario();
    });

    // log Out
    $scope.LogOut = function () {
        $scope.usuario = undefined;
        dataservice.setUsuario(undefined);
        $location.path("/login");
    }
});

