app.controller('dashboardAlunoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //variaveis 
    var oUsuario;

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    //Valida Login
    validaLogin();
    carregaMensadalidades();

    //Carrega Dados
    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        $scope.usuario = oUsuario;
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
    }

    //Carrega mensalidades
    function carregaMensadalidades() {
    }



});