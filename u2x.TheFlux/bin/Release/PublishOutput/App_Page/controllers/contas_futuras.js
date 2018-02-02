app.controller('contasFuturasCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //var
    var targetConta = {};

    $scope.lstTipoMovimentacao = [];
    $scope.lstTipoPagamentos = [];
    $scope.conta = {};
    $scope.contas = [];
    $scope.parcelas = [];

    $scope.trataValores = U2X_TrataValores;

    $scope.getStyle = function (nNumber) {
        return nNumber > 0 ? "green" : "red";
    }

    //Inicia Processo
    U2X_ConfiguraInterface();
    validaLogin();
    loadData();
    carregaDados();

    function validaLogin() {
        $scope.loggedUsuario = dataservice.getUsuario();
        if (!$scope.loggedUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
    }

    function loadData() {

        U2X_AbreLoader();
        var p1 = carregaTipoMovimentacao();
        var p2 = carregaTipoPagamento();
        var p3 = carregaContas();
        Promise.all([p1, p2, p3]).then(function () {
            carregaDados();
            U2X_FechaLoader();
            Materialize.updateTextFields();
        });

    }

    function carregaContas() {
        return new Promise(function (resolve, reject) {
            var obj = {};
            obj.id_usuario = $scope.loggedUsuario.id;
            $http({
                method: 'POST',
                url: "/api/ContaFutura_Obtem",
                data: obj
            }).then(function sucess(response) {
                $scope.contas = response.data;
                resolve();
            }, function errorCallback(response) {
                console.log(response);
                Materialize.toast('Não foi possível realizar a operação', 4000);
                reject();
            });
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

    function carregaDados() {
        $scope.conta.parcela = 1;
        $scope.conta.data = new Date;
        $scope.oSearchTipo = "-1";
        $scope.oSearchStatus = "-1";
        $scope.oSearchTipoPagamento = "-1";
    }

    $scope.openCollapsible = function (oConta, forcaCarregar) {
        //Valida já carregado
        if (!forcaCarregar) {
            if (targetConta && targetConta.id == oConta.id) {
                return true;
            }
        }
        $scope.parcelas = [];

        U2X_AbreLoader();

        //passa dados 
        targetConta = oConta;

        var obj = {};
        obj.id_conta = oConta.id;

        $http({
            method: 'POST',
            url: dataservice.url + "/api/ParcelaFutura_Obtem",
            data: obj
        }).then(function sucess(response) {
            $scope.parcelas = response.data;

            $scope.parcelas = $scope.parcelas.sort(function (b, a) {
                if (moment(b.dt_include).isBefore(moment(a.dt_include))) return -1;
                else if (moment(b.dt_include).isAfter(moment(a.dt_include))) return 1;
                else return 0;
            })

            U2X_FechaLoader();

        });

        return true;
    }

    $scope.CriaConta = function () {
        if (!$scope.conta.nome || $scope.conta.nome == "") {
            Materialize.toast('Digite o [Nome] do novo Tipo de Gasto.', 4000);
            return;
        }

        if (!$scope.conta.id_tipo_pagamento || $scope.conta.id_tipo_pagamento == "") {
            Materialize.toast('Selecione o [Tipo de Pagamento].', 4000);
            return;
        }

        if (!$scope.conta.id_tipo_movimentacao || $scope.conta.id_tipo_movimentacao == "") {
            Materialize.toast('Selecione o [Tipo de Movimentação].', 4000);
            return;
        }


        if (!$scope.conta.is_entrada || $scope.conta.is_entrada == "") {
            Materialize.toast('Selecione entre [Entrada/Saida].', 4000);
            return;
        }

        if (!$scope.conta.valor_base || $scope.conta.valor_base == "") {
            Materialize.toast('Digite o [Valor].', 4000);
            return;
        }


        if (!$scope.conta.parcela || $scope.conta.parcela == "") {
            Materialize.toast('Digite a quantidade de  [Parcelas].', 4000);
            return;
        }


        if (!$scope.conta.data || $scope.conta.data == "") {
            Materialize.toast('Digite a [Data].', 4000);
            return;
        }
        $scope.conta.id_usuario = $scope.loggedUsuario.id;
        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + "/api/ContaFutura_Criar",
            data: $scope.conta
        }).then(function sucess(response) {
            var ps = [];

            for (var i = 0; i < $scope.conta.parcela; i++) {
                var obj = {};

                obj.id_movimentacao_futura = response.data;
                obj.dt_include = moment($scope.conta.data).add("M", i).toDate();
                obj.valor_real = $scope.conta.valor_base;

                ps.push($http({
                    method: 'POST',
                    url: dataservice.url + "/api/ParcelaFutura_Criar",
                    data: obj
                }));

            }


            Promise.all(ps).then(function () {
                $("#mdlContaFutura").modal("close");
                carregaContas();
                U2X_FechaLoader();
            });

        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            U2X_FechaLoader();

        });
    }

    $scope.AbreModalCriaConta = function () {
        $scope.conta = {};

        $("#mdlContaFutura").modal("open");
    }

    $scope.FechaModalCriaConta = function () {
        $scope.conta = {};
        $("#mdlContaFutura").modal("close");
    }

    $scope.getStatus = function (conta) {

        if (conta.is_pago == "1") { return "Pago"; }
        if (moment(conta.dt_include).isBefore(moment(new Date()))) { return "Atrasado"; }
        return "Aguardando";

    }

    $scope.getStyle = function (conta) {

        if (conta.is_pago == "1") { return "grey"; }
        if (moment(conta.dt_include).isBefore(moment(new Date()))) { return "red"; }
        return "black";

    }

    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }

    //Pagamento 

    var targetParcela;
    $scope.AbreModalPagamento = function (oParcela, oConta) {
        targetParcela = oParcela;
        targetParcela.nome = oConta.nome;
        $("#mdlPagamento").modal("open");
    }

    $scope.FechaModalPagamento = function () {
        $("#mdlPagamento").modal("close");
    }

    $scope.RealizaPagamento = function () {
        $scope.FechaModalPagamento();
        U2X_AbreLoader();

        $http({
            method: 'POST',
            url: dataservice.url + "/api/ParcelaFutura_Pagar",
            data: targetParcela
        }).then(function sucess(response) {
            $("#mdlComprovante").modal("open");
            $scope.openCollapsible(targetConta, true);
            U2X_FechaLoader();

        });
    }

    $scope.FechaModalComprovante = function () {
        $("#mdlComprovante").modal("close");
    }

    $scope.EnviaComprovante = function () {
        targetParcela.email = $scope.emailComprovante;
        targetParcela.dt = moment(targetParcela.dt_include).format("DD/MM/YYYY");

        $http({
            method: 'POST',
            url: dataservice.url + "/api/ParcelaFutura_Comprovante",
            data: targetParcela
        }).then(function sucess(response) {
            $("#mdlComprovante").modal("close");
            U2X_FechaLoader();

        });

    }

});
