app.controller('addMovimentacaoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    $scope.lstTipoMovimentacao;
    $scope.lstTipoPagamento;
    $scope.loggedUsuario = dataservice.getUsuario();
    $scope.movimentacao = {};
    $scope.movimentacao.tipoMovimentacao = {};
    $scope.movimentacao.tipoPagamento = {};
    $scope.movimentacao.repetir = 1;
    $scope.movimentacao.data = moment();
    $scope.movimentacao.valor = 0.00;

    //Inicia Processo
    U2X_ConfiguraInterface();
    validaLogin();
    carregaTipos();

    function carregaTipos() {
        U2X_AbreLoader();
        var p1 = carregaTipoMovimentacao();
        var p2 = carregaTipoPagamento();
        Promise.all([p1, p2]).then(function () {
            U2X_FechaLoader();
            Materialize.updateTextFields();
        });
    }

    function carregaTipoMovimentacao() {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: dataservice.url + "/api/TipoMovimentacao/" + $scope.loggedUsuario.id_instituicao
            }).then(function sucess(response) {
                $scope.lstTipoMovimentacao = response.data;
                resolve();
            }, function errorCallback(response) {
                console.log(response);
                Materialize.toast('Não foi possível realizar a operação', 4000);
                reject();
            });
        });
    }

    function carregaTipoPagamento() {
        return new Promise(function (resolve, reject) {
            var obj = {};
            obj.id_instituicao = $scope.loggedUsuario.id_instituicao;

            $http({
                method: 'POST',
                url: dataservice.url + "/api/TipoPagamento_Obtem",
                data: obj
            }).then(function sucess(response) {
                $scope.lstTipoPagamento = response.data;
                resolve();
            }, function errorCallback(response) {
                console.log(response);
                Materialize.toast('Não foi possível realizar a operação', 4000);
                reject();
            });
        });
    }

    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
    }

    $scope.btnAdd = function () {
        if (!$scope.movimentacao.tipoMovimentacao.id || $scope.movimentacao.tipoMovimentacao.id == 0) {
            Materialize.toast('Selecione o [Tipo de Movimentação].', 4000);
            return;
        }

        if (!$scope.movimentacao.tipoPagamento.id || $scope.movimentacao.tipoPagamento.id == 0) {
            Materialize.toast('Selecione o [Tipo de Pagamento].', 4000);
            return;
        }

        if ($scope.movimentacao.valor <= 0) {
            Materialize.toast('Valor deve ser maior que zero.', 4000);
            return;
        }

        if ($scope.movimentacao.repetir <= 0) {
            Materialize.toast('A movimentação deve acontecer pelo menos 1 vez.', 4000);
            return;
        }

        var sendData = {};
        sendData.isEntrada = $scope.movimentacao.isEntrada;
        sendData.idUsuario = $scope.loggedUsuario.id;
        sendData.idTipoMovimentacao = $scope.movimentacao.tipoMovimentacao.id;
        sendData.idTipoPagamento = $scope.movimentacao.tipoPagamento.id;
        sendData.descricao = $scope.movimentacao.descricao;
        sendData.valor = $scope.movimentacao.valor;

        sendData.data = moment($scope.movimentacao.data);//.add(_i, "M");

        $http({
            method: 'POST',
            url: dataservice.url + "/api/MovimentacaoPessoal_Adicionar",
            data: sendData
        }).then(function sucess(response) {
            $location.path("/dashboard");
            Materialize.toast('Movimentação cadastrada com sucesso.', 4000);
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
        });

    }
});