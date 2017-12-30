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
        var p3 = carregaUsuario();
        Promise.all([p1, p2, p3]).then(function () {
            carregaDados();
            Materialize.updateTextFields();
        });
    }

    function carregaMeses() {
        $scope.searchDate = [];
        //obtem as listas
        var lstDate = [];
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

    function carregaUsuario() {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: dataservice.url + '/api/usuario/' + $scope.loggedUsuario.id_instituicao
            }).then(function sucess(response) {
                $scope.lstUsuario = response.data;
                resolve();
            }, function errorCallback(response) {
                U2X_TrataErro(response);
                U2X_FechaLoader();
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

    //Carrega os dados
    function carregaDados() {

        $http({
            method: 'POST',
            url: dataservice.url + '/api/MovimentacaoInstitucional_Obtem',
            data: $scope.loggedUsuario
        }).then(function sucess(response) {
            $scope.lstMovimentacao = response.data;
            if (!$scope.lstMovimentacao) {
                $scope.oSearchTipo = "-1";
                $scope.oSearchDate = "1";
                return;
            }

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

                //Usuario
                movimentacao.usuario = $scope.lstUsuario.filter(function (usuario) {
                    return usuario.id == movimentacao.idUsuario;
                })[0].login;
            })
            $scope.lstMovimentacao = $scope.lstMovimentacao.sort(function (a, b) {
                if (moment(b.data).isBefore(moment(a.data))) return -1;
                else if (moment(b.data).isAfter(moment(a.data))) return 1;
                else return 0;
            })

            $scope.oSearchTipo = "-1";
            $scope.oSearchDate = "1";
            $scope.Filtrar();

            carregaMeses();
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
        if (!$scope.lstMovimentacao) {
            return false;
        }

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

            //valida entrada
            if ($scope.oSearchTipo != "-1" && $scope.oSearchTipo != mov.isEntrada) {
                bRetorno = false;
            }


            return bRetorno;
        });

    }
    $scope.targetMovimentacao;
    $scope.ApagarShow = function (movimentacao) {
        $scope.targetMovimentacao = movimentacao;
        $('#mdlApagar').modal('open');
    }
    $scope.ApagarHide = function () {
        $('#mdlApagar').modal('close');
    }

    $scope.EditarShow = function (movimentacao) {
        $scope.targetMovimentacao = movimentacao;
        $scope.targetMovimentacao.isEntrada = movimentacao.isEntrada.toString();
        $scope.targetMovimentacao.data = moment($scope.targetMovimentacao.data).toDate();

        if ($scope.targetMovimentacao.valor < 0) {
            $scope.targetMovimentacao.valor = $scope.targetMovimentacao.valor * -1;
        }
        $('#mdlEditar').modal('open');
    }
    $scope.EditarHide = function () {

        if ($scope.targetMovimentacao.isEntrada == 0 || $scope.targetMovimentacao.isEntrada == 2) {
            $scope.targetMovimentacao.valor = $scope.targetMovimentacao.valor * -1;
        }

        $('#mdlEditar').modal('close');
    }





    $scope.Apagar = function () {

        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Movimentacao_Deletar',
            data: $scope.targetMovimentacao
        }).then(function sucess(response) {
            carregaDados();
            U2X_FechaLoader();

            $('#mdlApagar').modal('close');

            Materialize.toast('Exclusão concluida com sucesso', 4000);
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }


    $scope.Editar = function () {

        U2X_AbreLoader();
        $http({
            method: 'POST',
            url: dataservice.url + '/api/MovimentacaoPessoal_Alterar',
            data: $scope.targetMovimentacao
        }).then(function sucess(response) {
            carregaDados();

            $('#mdlEditar').modal('close');

            Materialize.toast('Edição concluida com sucesso', 4000);
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

    $scope.getStyleByType = function (nNumber) {
        return nNumber == 1 ? "green" : (nNumber == 2 ? "Lightblue" : "red");
    }
    $scope.trataValores = U2X_TrataValores;
    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }



});