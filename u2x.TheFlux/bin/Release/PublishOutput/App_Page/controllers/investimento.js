app.controller('investimentoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    //U2X_AbreLoader();

    //Valida Login
    validaLogin();
    carregaDados();


    //Carrega Dados
    function validaLogin() {
        $scope.loggedUsuario = dataservice.getUsuario();
        if (!$scope.loggedUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
    }
    function carregaDados() {
        U2X_AbreLoader();
        var invest = {};

        invest.id_instituicao = $scope.loggedUsuario.id_instituicao;

        $http({
            method: 'POST',
            url: dataservice.url + '/api/InvestimentoRF_Obtem',
            data: invest
        }).then(function sucess(response) {
            $scope.investimentos = response.data;

            $scope.investimentos.forEach(function (investimento) {
                CarregarAportes(investimento);
                CarregarVariacao(investimento);
                if ($scope.targetInvestimento != undefined && investimento.id == $scope.targetInvestimento.id) {
                    $scope.targetInvestimento = investimento;
                }
            });

            U2X_FechaLoader();

        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

    function CarregarAportes(inv) {
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Aporte_Obtem',
            data: inv
        }).then(function sucess(response) {
            inv.aportes = response.data;

            inv.aportes = inv.aportes.sort(function (b, a) {
                if (moment(b.data_compra).isBefore(moment(a.data_compra))) return -1;
                else if (moment(b.data_compra).isAfter(moment(a.data_compra))) return 1;
                else return 0;
            });

        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }
    function CarregarVariacao(inv) {
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Variacao_Obtem',
            data: inv
        }).then(function sucess(response) {
            inv.variacao = response.data;

            inv.variacao = inv.variacao.sort(function (b, a) {
                if (moment(b.data).isBefore(moment(a.data))) return -1;
                else if (moment(b.data).isAfter(moment(a.data))) return 1;
                else return 0;
            });
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

    //Variacao
    $scope.variacao = {}
    $scope.ShowVariacao = function () {
        $scope.variacao = {}

        $('#mdlNovoVariacao').modal('open');
    }
    $scope.CloseVariacao = function () {
        $('#mdlNovoVariacao').modal('close');
    }
    $scope.AddVariacao = function () {


        if (!$scope.variacao.data) {
            Materialize.toast('Favor digitar a data', 4000);
            return;
        }
        if (!$scope.variacao.valor) {
            Materialize.toast('Favor digitar o valor', 4000);
            return;
        }

        $scope.variacao.id_investimento_RF = $scope.targetInvestimento.id;


        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Variacao_Adicionar',
            data: $scope.variacao
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();
            $scope.novoNome = "";
            $('#mdlNovoVariacao').modal('close');

            Materialize.toast('Novo aporte cadastrado', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
        $('#mdlNovoVariacao').modal('close');

    }

    //Aporte
    $scope.aporte = {}
    $scope.showAporte = function () {
        $scope.aporte = {};
        $('#mdlNovoAporte').modal('open');
    }
    $scope.CloseAporte = function () {
        $('#mdlNovoAporte').modal('close');
    }

    $scope.targetRemoveInvestimento = {}

    $scope.AbreremoveInvestimento = function (obj) {
        $scope.targetRemoveInvestimento = obj;
        $('#mdlRemoveInvestimento').modal('open');
    }
    $scope.FecharemoveInvestimento = function () {
        $('#mdlRemoveInvestimento').modal('close');

    }

    $scope.removeInvestimento = function () {
        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/InvestimentoRF_Deleta',
            data: $scope.targetRemoveInvestimento
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();
            $('#mdlRemoveInvestimento').modal('close');
            Materialize.toast('Investimento removido com sucesso', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

    $scope.AddAporte = function () {


        if (!$scope.aporte.data_compra) {
            Materialize.toast('Favor digitar a data', 4000);
            return;
        }
        if (!$scope.aporte.valor_aporte) {
            Materialize.toast('Favor digitar o valor', 4000);
            return;
        }

        $scope.aporte.id_investimento_RF = $scope.targetInvestimento.id;


        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Aporte_Adicionar',
            data: $scope.aporte
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();
            $scope.novoNome = "";
            $('#mdlNovoAporte').modal('close');

            Materialize.toast('Novo aporte cadastrado', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
        $('#mdlNovoAporte').modal('close');

    }

    //Ajuda 
    $scope.ShowAjuda = function () {
        $('#mdlAjuda').modal('open');
    }
    $scope.CloseAjuda = function () {
        $('#mdlAjuda').modal('close');
    }


    //Investimento

    $scope.ViewInvestimento = function (mov) {
        $scope.targetInvestimento = mov;
    }

    $scope.ShowInvestimento = function () {
        $scope.novoNome = '';
        $('#mdlNovoInvestimento').modal('open');
    }
    $scope.CloseInvestimento = function () {
        $('#mdlNovoInvestimento').modal('close');
    }

    $scope.AddInvestimento = function () {

        var invest = {};

        if (!$scope.novoNome) {
            Materialize.toast('Favor digitar nome', 4000);
            return;
        }

        invest.nome = $scope.novoNome;
        invest.is_ativo = true;
        invest.id_instituicao = $scope.loggedUsuario.id_instituicao;

        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/InvestimentoRF_Adicionar',
            data: invest
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();
            $scope.novoNome = "";
            $('#mdlNovoInvestimento').modal('close');

            Materialize.toast('Novo Investimento cadastrado', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
        $('#mdlNovoInvestimento').modal('close');
    }


    //calculos
    $scope.CalculaValorAporteTotal = function (investimento) {
        var valor = 0;
        if (investimento.aportes == undefined) { return 0; }

        investimento.aportes.forEach(function (aporte) {
            valor = valor + aporte.valor_aporte;
        });
        return valor;
    }

    $scope.CalculaValorAtual = function (investimento) {
        if (investimento.variacao == undefined) { return $scope.CalculaValorAporteTotal(investimento); }

        var obj = investimento.variacao[investimento.variacao.length - 1];
        if (obj == undefined) { return $scope.CalculaValorAporteTotal(investimento); }
        return obj.valor;
    }

    $scope.CalculaPercentual = function (investimento) {
        var total = $scope.CalculaValorAporteTotal(investimento);
        var atual = $scope.CalculaValorAtual(investimento);

        return ((atual / total) - 1) * 100;
    }


    $scope.trataValores = U2X_TrataValores;
    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }

    //Aporte
    $scope.removeAporte = {}

    $scope.AbreRemoveAporte = function (obj) {
        $scope.removeAporte = obj;
        $('#mdlRemoveAporte').modal('open');
    }
    $scope.FechaRemoveAporte = function () {
        $('#mdlRemoveAporte').modal('close');

    }

    $scope.RemoveAporte = function () {
        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Aporte_Remove',
            data: $scope.removeAporte
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();
            $('#mdlRemoveAporte').modal('close');
            Materialize.toast('Aporte removido com sucesso', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }
    // Variacao
    $scope.removeVariacao = {}

    $scope.AbreRemoveVariacao= function (obj) {
        $scope.removeVariacao= obj;
        $('#mdlRemoveVariacao').modal('open');
    }
    $scope.FechaRemoveVariacao= function () {
        $('#mdlRemoveVariacao').modal('close');

    }

    $scope.RemoveVariacao = function () {
        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Variacao_Remove',
            data: $scope.removeVariacao
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();
            $('#mdlRemoveVariacao').modal('close');
            Materialize.toast('Variação removido com sucesso', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

});