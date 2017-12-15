app.controller('historicoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    //Valida Login
    validaLogin();
    carregaTipos();

    //Carrega Dados
    function validaLogin() {
        $scope.loggedUsuario = dataservice.getUsuario();
        if (!$scope.loggedUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
    }

    function carregaTipos() {
        U2X_AbreLoader();
        var p1 = carregaTipoMovimentacao();
        var p2 = carregaTipoPagamento();
        Promise.all([p1, p2]).then(function () {
            carregaDados();
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

    //Carrega os dados
    function carregaDados() {
        $http({
            method: 'POST',
            url: dataservice.url + '/api/MovimentacaoInstitucional_Obtem',
            data: $scope.loggedUsuario
        }).then(function sucess(response) {
            $scope.lstMovimentacao = response.data;
            //adiciona tipo de pagamento
            $scope.lstMovimentacao.forEach(function (movimentacao) {
                //Adiciona Show
                movimentacao.showMore = false;

                //Ajusta valor
                if (!movimentacao.isEntrada) {
                    movimentacao.valor = movimentacao.valor * -1;
                }

                //Obtem Movimentacao
                movimentacao.tipoMovimentacao = $scope.lstTipoMovimentacao.filter(function (tipoMovimentacao) {
                    return tipoMovimentacao.id == movimentacao.idTipoMovimentacao;
                })[0];

                //Obtem Pagamento
                movimentacao.tipoPagamento = $scope.lstTipoPagamento.filter(function (tipoPagamento) {
                    return tipoPagamento.id == movimentacao.idTipoPagamento;
                })[0];
            })
            $scope.lstMovimentacao = $scope.lstMovimentacao.sort(function (a, b) {
                if (moment(b.data).isBefore(moment(a.data))) return -1;
                else if (moment(b.data).isAfter(moment(a.data))) return 1;
                else return 0;
            })


            U2X_FechaLoader();
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        });

    }

    $scope.Apagar = function (movimentacao) {

        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Movimentacao_Deletar',
            data: movimentacao
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();

        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

    $scope.getStyle = function (nNumber) {
        return nNumber > 0 ? "green" : (nNumber == 0 ? "black" : "red");
    }
    $scope.trataValores = U2X_TrataValores;
    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }

});