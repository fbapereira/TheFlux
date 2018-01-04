app.controller('investimentoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    //U2X_AbreLoader();

    //Valida Login
    validaLogin();
    carregaDados();


    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['', 'Aporte', 'Lucro'],
            ['30/12', 4287.06, 4245.76],
            ['29/12', 4287.06, 4249.02],
        ]);

        var docheight = $(window).height() / 3 * 2;
        var docwidth = $('#divPadrao').width() / 5 * 4;
        var options = {
            title: 'Lucro sobre Aporte',
            isStacked: true,
            height: docheight,
            width: docwidth
        };

        var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }

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

        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }

    //Variacao
    $scope.variacao = {}
    $scope.ShowVariacao = function () {
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
        $('#mdlNovoAporte').modal('open');
    }
    $scope.CloseAporte = function () {
        $('#mdlNovoAporte').modal('close');
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

});