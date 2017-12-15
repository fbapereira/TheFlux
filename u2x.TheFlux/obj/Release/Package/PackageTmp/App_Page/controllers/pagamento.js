app.controller('pagamentoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    var oUsuario = U2X_ValidaLogin(dataservice.getUsuario());
    Populate();



    function Populate() {
        var obj = {};
        obj.id_instituicao = oUsuario.id_instituicao;
        U2X_AbreLoader();


        $http({
            method: 'POST',
            url: dataservice.url + '/api/TipoPagamento_Obtem',
            data: obj
        }).then(function sucess(response) {
            $scope.lstTipoPagamento = response.data;
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
        if (!$scope.nome || $scope.nome == "") {
            Materialize.toast('Digite o [nome] do novo tipo de pagamento.', 4000);
            return;
        }

        var tipoPagamento = {};


        tipoPagamento.id_instituicao = oUsuario.id_instituicao;
        tipoPagamento.cobranca_Juros = $scope.juros;
        tipoPagamento.nome = $scope.nome;
        tipoPagamento.is_ativo = true;

        U2X_AbreLoader();

        if (!$scope.juros) {
            $scope.juros = 0;
        }

        $http({
            method: 'POST',
            url: dataservice.url + '/api/TipoPagamento_Adicionar',
            data: tipoPagamento
        }).then(function sucess(response) {
            Materialize.toast('Tipo de Pagamento adicionado com sucesso', 4000);
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
        $scope.lstTipoPagamentoFiltered = $scope.lstTipoPagamento.filter(function (a) {

            //valida nome
            if ((sBusca) &&
                (sBusca.length > 0) &&
                (a.nome.toUpperCase().indexOf(sBusca.toUpperCase()) == -1)) {
                return false;
            }
            //valida cancelado
            if (bAtivos && !a.is_ativo) {
                return false;
            }
            return true;
        });
    }

    $scope.Alterar = function (tipoPagamento, is_ativo) {
        tipoPagamento.is_ativo = is_ativo;

        var sOperacao = is_ativo ? "reativado" : "cancelado";
        U2X_AbreLoader();

        $http({
            method: 'POST',
            url: dataservice.url + '/api/TipoPagamento_Alterar',
            data: tipoPagamento
        }).then(function sucess(response) {
            Materialize.toast('O tipo de pagamento foi ' + sOperacao, 4000);
            U2X_FechaLoader();
            Populate();
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }
});