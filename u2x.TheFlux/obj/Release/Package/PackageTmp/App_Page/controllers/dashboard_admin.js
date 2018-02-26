app.controller('dashboardCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //variaveis 
    var oUsuario;
    var lstMovimentacao;
    alert('oi');

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    ValidaTipoUsuario()
        .then(function (TipoInstituicao) {
            if (TipoInstituicao == 1) { }

            //Valida Login
            validaLogin();
            carregaDados();

        });


    function ValidaTipoUsuario() {
        return new Promise(
            function (resolve, reject) {
                $http({
                    method: 'GET',
                    url: dataservice.url + '/api/Instituicao',
                    data: oUsuario
                }).then(function sucess(response) {
                    if (response && response.data) {
                        resolve(response.data.idTipo);
                    }
                    resolve(0);

                }, function errorCallback(response) {
                    resolve(0);
                });

            });
    }

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
            if (!$scope.lstMovimentacao || $scope.lstMovimentacao.length == 0) {
                $('.tap-target').tapTarget('open');
            }
            $http({
                method: 'POST',
                url: dataservice.url + '/api/TipoPagamento_Obtem',
                data: { "id_instituicao": oUsuario.id_instituicao }
            }).then(function sucess(response) {
                $scope.lstTipoPagamento = response.data;

                if (!$scope.lstMovimentacao || $scope.lstMovimentacao.length == 0) {
                    U2X_FechaLoader();
                    return;
                }

                //adiciona tipo de pagamento
                $scope.lstMovimentacao.forEach(function (movimentacao) {
                    movimentacao.showMore = false;
                    if (movimentacao.isEntrada == 0) {
                        movimentacao.valor = movimentacao.valor * -1;
                    }

                    movimentacao.tipoPagamento = $scope.lstTipoPagamento.filter(function (tipoPagamento) {
                        return tipoPagamento.id == movimentacao.idTipoPagamento;
                    })[0];
                })
                $scope.lstTipoPagamento = $scope.lstTipoPagamento.filter(function (tipoPagamento) {
                    return tipoPagamento.is_ativo;
                });

                // calculo
                $scope.entradaLiquida = 0;
                $scope.entradaBruta = 0;
                $scope.saidaLiquida = 0;
                $scope.saidaBruta = 0;
                $scope.investimentoLiquida = 0;
                $scope.investimentoBruta = 0;

                $scope.entradaLiquidaFutura = 0;
                $scope.entradaBrutaFutura = 0;
                $scope.saidaLiquidaFutura = 0;
                $scope.saidaBrutaFutura = 0;
                $scope.investimentoLiquidaFutura = 0;
                $scope.investimentoBrutaFutura = 0;

                $scope.lstMovimentacao.forEach(function (movimentacao) {
                    if (moment(movimentacao.data).isBefore(moment(Date()))) {
                        if (movimentacao.isEntrada == 0) {
                            $scope.saidaLiquida = $scope.saidaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.saidaBruta = $scope.saidaBruta + movimentacao.valor;
                        }

                        if (movimentacao.isEntrada == 1) {
                            $scope.entradaLiquida = $scope.entradaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.entradaBruta = $scope.entradaBruta + movimentacao.valor;
                        }

                        if (movimentacao.isEntrada == 2) {
                            $scope.investimentoLiquida = $scope.investimentoLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.investimentoBruta = $scope.investimentoBruta + movimentacao.valor;
                        }
                    } else {

                        if (movimentacao.isEntrada == 0) {
                            $scope.saidaLiquidaFutura = $scope.saidaLiquidaFutura + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.saidaBrutaFutura = $scope.saidaBrutaFutura + movimentacao.valor;
                        }

                        if (movimentacao.isEntrada == 1) {
                            $scope.entradaLiquidaFutura = $scope.entradaLiquidaFutura + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.entradaBrutaFutura = $scope.entradaBrutaFutura + movimentacao.valor;
                        }

                        if (movimentacao.isEntrada == 2) {
                            $scope.investimentoLiquidaFutura = $scope.investimentoLiquidaFutura + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                            $scope.investimentoBrutaFutura = $scope.investimentoBrutaFutura + movimentacao.valor;
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
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        })
    }


    $scope.getStyle = function (nNumber) {
        return nNumber > 0 ? "green" : (nNumber == 0 ? "black" : "red");
    }

    $scope.trataValores = U2X_TrataValores;
    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }



    function carregaTipoMovimentacao() {
        $http({
            method: 'GET',
            url: dataservice.url + "/api/TipoMovimentacao/" + oUsuario.id_instituicao
        }).then(function sucess(response) {

            var lst = response.data;
            if (lst && lst.length > 0) {
                $scope.lstTipoMovimentacao = lst.filter(function (oTipoMovimentacao) {
                    return !oTipoMovimentacao.is_canceled;
                });
            }
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
        });
    }


    $scope.showAjudaConsolidado = function () {
        $('#mdlAjudaConsolidado').modal('open');
    }
    $scope.CloseAjudaConsolidado = function () {
        $('.modal').modal('close');
    }

    $scope.showAjudaFuturo = function () {
        $('#mdlAjudaFuturo').modal('open');
    }
    $scope.CloseAjudaFuturo = function () {
        $('.modal').modal('close');
    }

    $scope.showAjudaAtual = function () {
        $('#mdlAjudaAtual').modal('open');
    }
    $scope.CloseAjudaAtual = function () {
        $('.modal').modal('close');
    }

});