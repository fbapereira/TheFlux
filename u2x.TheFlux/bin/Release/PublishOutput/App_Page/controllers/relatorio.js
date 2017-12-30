app.controller('relatorioCtrl', function ($scope, $rootScope, $http, $location, dataservice) {

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

    function carregaMeses() {
        $scope.searchDate = [];
        //obtem as listas
        var lstDate = [];
        if (!$scope.lstMovimentacao) {
            return;
        }
        $scope.lstMovimentacao.forEach(function (movimentacao) {
            lstDate.push(moment(movimentacao.data))
        });

        // Obtem o minimo
        var minDate = moment.min(lstDate)
        var maxDate = moment.max(lstDate)

        //Obtem mes e ano 
        var minMes = Number(moment(minDate).format('MM'));
        var minAno = Number(moment(minDate).format('YYYY'));
        var maxMes = Number(moment(maxDate).format('MM'));
        var maxAno = Number(moment(maxDate).format('YYYY'));


        while (minMes != maxMes || minAno != maxAno) {
            $scope.searchDate.push(minMes + "/" + minAno);
            minMes = minMes + 1;
            if (minMes > 12) {
                minAno = minAno + 1;
                minMes = 1;
            }
        }
        $scope.searchDate.push(maxMes + "/" + maxAno);

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
            if (!$scope.lstMovimentacao) {
                $scope.oSearchDate = "1";
                U2X_FechaLoader();
                return;
            }

            $scope.lstMovimentacao.forEach(function (movimentacao) {
                //Ajusta valor
                if (!movimentacao.isEntrada) {
                    movimentacao.valor = movimentacao.valor * -1;
                }
            })

            $scope.oSearchDate = "1";
            $scope.Filtrar();
            carregaMeses();
            $scope.CarregarInterface();
            U2X_FechaLoader();
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        });

    }

    $scope.Filtrar = function () {
        $scope.lstMovimentacaoFiltered = $scope.lstMovimentacao.filter(function (mov) {
            var bRetorno = true;

            if ($scope.oSearchDate != "1") {
                var sMes = $scope.oSearchDate.split("/")[0]
                var sAno = $scope.oSearchDate.split("/")[1]

                var data = moment(mov.data);

                var oMes = Number(moment(data).format('MM'));
                var oAno = Number(moment(data).format('YYYY'));

                if (sMes != oMes || sAno != oAno) {
                    bRetorno = false;
                }
            }

            return bRetorno;
        });




    }

    $scope.CarregarInterface = function () {
        // calculo
        $scope.entradaLiquida = 0;
        $scope.entradaBruta = 0;
        $scope.saidaLiquida = 0;
        $scope.saidaBruta = 0;

        //adiciona tipo de pagamento
        $scope.lstMovimentacaoFiltered.forEach(function (movimentacao) {
            //Adiciona Show
            movimentacao.showMore = false;



            //Obtem Movimentacao
            movimentacao.tipoMovimentacao = $scope.lstTipoMovimentacao.filter(function (tipoMovimentacao) {
                return tipoMovimentacao.id == movimentacao.idTipoMovimentacao;
            })[0];

            //Obtem Pagamento
            movimentacao.tipoPagamento = $scope.lstTipoPagamento.filter(function (tipoPagamento) {
                return tipoPagamento.id == movimentacao.idTipoPagamento;
            })[0];

            //calculo de entradas e saidas
            if (movimentacao.isEntrada) {
                $scope.entradaLiquida = $scope.entradaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                $scope.entradaBruta = $scope.entradaBruta + movimentacao.valor;
            } else {
                $scope.saidaLiquida = $scope.saidaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_juros + 100) / 100))
                $scope.saidaBruta = $scope.saidaBruta + movimentacao.valor;
            }

        })
        $scope.lstMovimentacao = $scope.lstMovimentacao.sort(function (a, b) {
            if (moment(b.data).isBefore(moment(a.data))) return -1;
            else if (moment(b.data).isAfter(moment(a.data))) return 1;
            else return 0;
        })


        //carrega graficos 
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
        CarregaTabela();

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


    //chart


    function drawChart() {
        drawChartRegras();
        drawChartGasto();
        drawChartPagamento();
    }

    function drawChartRegras() {
        var conta = Number(($scope.entradaLiquida * 0.5).toFixed(2));
        var vida = Number(($scope.entradaLiquida * 0.35).toFixed(2));
        var liquida = Number(($scope.entradaLiquida * 0.15).toFixed(2));

        var data = google.visualization.arrayToDataTable([
            ['Destino', 'Valor'],
            ['Contas', conta],
            ['Estilo de Vida', vida],
            ['Investir', liquida],

        ]);

        var options = {
            title: 'Sugestão da Disposição do Dinheiro',
            animation: {
                duration: 1000,
                easing: 'out',
            },
            legend: 'bottom',
        };

        var chart = new google.visualization.PieChart(document.getElementById('pieRegras'));
        chart.draw(data, options);
    }



    function drawChartPagamento() {
        var lstChart = [];

        var saidas = $scope.lstMovimentacaoFiltered.filter(function (mov) {
            return !mov.isEntrada;
        });

        //para cada item
        saidas.forEach(function (mov) {

            var valor = mov.valor;
            if (valor < 0) { valor = valor * -1; }
            //verifica se existe na lstChart
            var oEle = lstChart.filter(function (itemChart) {
                return itemChart[0].id == mov.tipoMovimentacao.id;
            });

            var index = -1;
            if (oEle && oEle.length > 0) {
                index = lstChart.indexOf(oEle[0])
            }

            if (index == -1) {
                //Se nao  Adicionar o valor 
                lstChart.push([mov.tipoMovimentacao, valor])
            } else {
                //Se ouvir adiciona o item
                lstChart[index][1] = lstChart[index][1] + valor;
            }
        });

        lstChart.forEach(function (item) {
            item[0] = item[0].descricao;
        });
        lstChart.unshift(["Tipo de Movimentação", "Valor"])
        var data = google.visualization.arrayToDataTable(lstChart);
        var docheight = $(window).height() / 3 * 2;
        var options = {
            title: 'Saídas por Tipo de Gasto',
            animation: {
                duration: 1000,
                easing: 'out',
            },
            legend: 'bottom',
            height: docheight

        };

        var chart = new google.visualization.PieChart(document.getElementById('pieFormaPagamento'));
        chart.draw(data, options);
    }

    function drawChartGasto() {
        var lstChart = [];

        var saidas = $scope.lstMovimentacaoFiltered.filter(function (mov) {
            return !mov.isEntrada;
        });

        //para cada item
        saidas.forEach(function (mov) {
            var valor = mov.valor;
            if (valor < 0) { valor = valor * -1; }

            //verifica se existe na lstChart
            var oEle = lstChart.filter(function (itemChart) {
                return itemChart[0].id == mov.idTipoPagamento;
            });

            var index = -1;
            if (oEle && oEle.length > 0) {
                index = lstChart.indexOf(oEle[0])
            }

            if (index == -1) {
                //Se nao  Adicionar o valor 
                lstChart.push([mov.tipoPagamento, valor])
            } else {
                //Se ouvir adiciona o item
                lstChart[index][1] = lstChart[index][1] + valor;
            }
        });

        lstChart.forEach(function (item) {
            item[0] = item[0].nome;
        });

        lstChart.sort(function (a, b) {
            if (a[1] > b[1]) { return -1; }
            if (a[1] < b[1]) { return 1; }
            return 0;
        });

        lstChart.unshift(["Forma de Pagamento", "Valor"])

        var data = google.visualization.arrayToDataTable(lstChart);

        var options = {
            title: 'Saidas por Forma de Pagamento',
            animation: {
                duration: 1000,
                easing: 'out',
            },
            legend: 'bottom',
        };



        var chart = new google.visualization.PieChart(document.getElementById('pieFormaGasto'));
        chart.draw(data, options);
    }

    $scope.isTableTipoGasto = true;
    $scope.ChangeTipoGastoViewMode = function () {
        $scope.isTableTipoGasto = !$scope.isTableTipoGasto;
    }

    function CarregaTabela() {
        $scope.lstTabelaGasto = [];
        //para cada item

        var saidas = $scope.lstMovimentacaoFiltered.filter(function (mov) {
            return !mov.isEntrada;
        });
        saidas.forEach(function (mov) {
            var valor = mov.valor;
            if (valor < 0) { valor = valor * -1; }
            //verifica se existe na lstChart
            var oEle = $scope.lstTabelaGasto.filter(function (itemTabela) {
                return itemTabela.tipo.id == mov.tipoMovimentacao.id;
            });

            var index = -1;
            if (oEle && oEle.length > 0) {
                index = $scope.lstTabelaGasto.indexOf(oEle[0])
            }

            if (index == -1) {
                var a = {};
                a.value = valor;
                a.tipo = mov.tipoMovimentacao;

                //Se nao  Adicionar o valor 
                $scope.lstTabelaGasto.push(a);
            } else {
                //Se ouvir adiciona o item
                $scope.lstTabelaGasto[index].value = $scope.lstTabelaGasto[index].value + valor;
            }
        });

        $scope.lstTabelaGasto.sort(function (a, b) {
            if (a.value > b.value) { return -1; }
            if (a.value < b.value) { return 1; }
            return 0;
        });

    }

});