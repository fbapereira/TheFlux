app.controller('widgetEstrelaCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    var oUsuario = U2X_ValidaLogin(dataservice.getUsuario());

    CarregaDados();
    $scope.estrelas = "?";
    function CarregaDados() {

        $http({
            method: 'POST',
            url: dataservice.url + '/api/Obtem_Estrela',
            data: oUsuario
        }).then(function sucess(response) {
            if (response) {
                if (response.data) {
                    $scope.estrelas = response.data;
                }
            }
        }, function errorCallback(response) {
        });
    }

    $scope.OpenAddEstrelas = function () {
        $('#mdlEstrela').modal('open');
    }

    $scope.CloseAddEstrela = function () {
        $('#mdlEstrela').modal('close');
    }

    $scope.AddEstrela = function () {


        if (!$scope.email || $scope.email == "") {
            Materialize.toast('Favor preencher [E-mail].', 4000);
            return;
        }

        if (!U2X_ValidateEmail($scope.email)) {
            Materialize.toast('O [e-mail] é inválido.', 4000);
            return;
        }

        if (!$scope.telefone || $scope.telefone == "") {
            Materialize.toast('Favor preencher [Telefone].', 4000);
            return;
        }

        U2X_AbreLoader();
        var estrela = {}
        estrela.id_usuario = oUsuario.id;
        estrela.telefone = $scope.telefone;
        estrela.email = $scope.email;

        $http({
            method: 'POST',
            url: dataservice.url + '/api/Adicionar_Estrela',
            data: estrela
        }).then(function sucess(response) {
            Materialize.toast('Vamos enviar um pedido para o seu amigo.', 4000);
            U2X_FechaLoader();
            CarregaDados();
            $('#mdlEstrela').modal('close');
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });

    }
});