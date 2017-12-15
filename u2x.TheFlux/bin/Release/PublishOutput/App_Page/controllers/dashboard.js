app.controller('dashboardCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //variaveis 
    var oUsuario;
    var lstMovimentacao;
    var lstTipoPagamento;

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    //Valida Login
    validaLogin();
    carregaDados();

    //Carrega Dados
    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        $scope.usuario = oUsuario;
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
    }

    function carregaDados() {
        $http({
            method: 'POST',
            url: dataservice.url + '/api/MovimentacaoInstitucional_Obtem',
            data: oUsuario
        }).then(function sucess(response) {
            $scope.lstMovimentacao = response.data;
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        }).then(function sucess(response) {
            $http({
                method: 'POST',
                url: dataservice.url + '/api/TipoPagamento_Obtem',
                data: { "id_instituicao": oUsuario.id_instituicao }
            }).then(function sucess(response) {
                lstTipoPagamento = response.data;

                if (!$scope.lstMovimentacao || $scope.lstMovimentacao.length == 0) {
                    U2X_FechaLoader();
                    return;
                }

                //adiciona tipo de pagamento
                $scope.lstMovimentacao.forEach(function (movimentacao) {
                    movimentacao.showMore = false;
                    if (!movimentacao.isEntrada) {
                        movimentacao.valor = movimentacao.valor * -1;
                    }

                    movimentacao.tipoPagamento = lstTipoPagamento.filter(function (tipoPagamento) {
                        return tipoPagamento.id == movimentacao.idTipoPagamento;
                    })[0];
                })

                // calculo
                $scope.entradaLiquida = 0;
                $scope.entradaBruta = 0;
                $scope.saidaLiquida = 0;
                $scope.saidaBruta = 0;


                $scope.entradaLiquidaFutura = 0;
                $scope.entradaBrutaFutura = 0;
                $scope.saidaLiquidaFutura = 0;
                $scope.saidaBrutaFutura = 0;

                $scope.lstMovimentacao.forEach(function (movimentacao) {
                    if (moment(movimentacao.data).isBefore(moment(Date()))) {
                        if (movimentacao.isEntrada) {
                            $scope.entradaLiquida = $scope.entradaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.entradaBruta = $scope.entradaBruta + movimentacao.valor;
                        } else {
                            $scope.saidaLiquida = $scope.saidaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.saidaBruta = $scope.saidaBruta + movimentacao.valor;
                        }
                    } else {
                        if (movimentacao.isEntrada) {
                            $scope.entradaLiquidaFutura = $scope.entradaLiquidaFutura + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.entradaBrutaFutura = $scope.entradaBrutaFutura + movimentacao.valor;
                        } else {
                            $scope.saidaLiquidaFutura = $scope.saidaLiquidaFutura + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.saidaBrutaFutura = $scope.saidaBrutaFutura + movimentacao.valor;
                        }
                    }
                });
                //$scope.saidaLiquida = $scope.saidaLiquida * -1;
                //$scope.saidaBruta = $scope.saidaBruta * -1;
                $('.collapsible').collapsible();

                U2X_FechaLoader();
            }, function errorCallback(response) {
                console.log(response);
                Materialize.toast('Não foi possível realizar a operação', 4000);
                $location.path("/");
                U2X_FechaLoader();
                return;
            });
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