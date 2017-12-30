app.controller('movimentacaoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    var oUsuario = U2X_ValidaLogin(dataservice.getUsuario());
    Populate();

    function Populate() {
        U2X_AbreLoader();
        $http({
            method: 'GET',
            url: dataservice.url + '/api/TipoMovimentacao/' + oUsuario.id_instituicao,

        }).then(function sucess(response) {
            $scope.lstTipoMovimentacao = response.data;
            U2X_FechaLoader();
            $scope.changeBusca($scope.sBusca, $scope.bAtivos);

        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

    $scope.OpenAddStatus = function () {
        $('#mdlChangePassword').modal('open');
    }

    $scope.CloseAddStatus = function () {
        $('#mdlChangePassword').modal('close');
    }

    $scope.AddStatus = function () {
        if (!$scope.descricao || $scope.descricao == "") {
            Materialize.toast('Digite o [descricao] do novo Tipo de Gasto.', 4000);
            return;
        }

        var tipoMovimentacao = {};

        tipoMovimentacao.id_instituicao = oUsuario.id_instituicao;
        tipoMovimentacao.descricao = $scope.descricao;
        tipoMovimentacao.is_ativo = true;

        U2X_AbreLoader();

        $http({
            method: 'POST',
            url: dataservice.url + '/api/TipoMovimentacao',
            data: tipoMovimentacao
        }).then(function sucess(response) {
            Materialize.toast('Tipo de Gasto adicionado com sucesso', 4000);
            U2X_FechaLoader();
            $scope.CloseAddStatus();
            Populate();
            $scope.changeBusca($scope.sBusca, $scope.bAtivos);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });

    }


    $scope.changeBusca = function (sBusca, bAtivos) {
        changeBuscaPrivate(sBusca, bAtivos)
    }
    function changeBuscaPrivate(sBusca, bAtivos) {
        $scope.lstTipoMovimentacaoFiltered = $scope.lstTipoMovimentacao.filter(function (a) {

            //valida nome
            if ((sBusca) &&
                (sBusca.length > 0) &&
                (a.nome.toUpperCase().indexOf(sBusca.toUpperCase()) == -1)) {
                return false;
            }
            //valida cancelado
            //if (bAtivos && !a.is_ativo) {
            if (a.is_canceled) {
                return false;
            }
            return true;
        });
    }

    $scope.Alterar = function (tipoMovimentacao, is_ativo) {
        tipoMovimentacao.is_canceled = !is_ativo;

        var sOperacao = tipoMovimentacao.is_canceled ? "reativado" : "cancelado";
        var id = tipoMovimentacao.is_canceled ? 1 : 0;
        U2X_AbreLoader();
        $http({
            method: 'GET',
            url: dataservice.url + '/api/TipoMovimentacao/AlteraStatus/' + tipoMovimentacao.id + "/" + id,
            data: tipoMovimentacao
        }).then(function sucess(response) {
            Materialize.toast('O Tipo de Gasto foi ' + sOperacao, 4000);
            U2X_FechaLoader();
            Populate();
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }
});