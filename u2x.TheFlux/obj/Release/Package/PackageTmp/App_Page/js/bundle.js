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

                var lst = response.data;
                if (lst && lst.length > 0) {
                    $scope.lstTipoMovimentacao = lst.filter(function (oTipoMovimentacao) {
                        return !oTipoMovimentacao.is_canceled;
                    });
                }
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

                var lst = response.data;
                if (lst && lst.length > 0) {
                    $scope.lstTipoPagamento = lst.filter(function (oTipoMovimentacao) {
                        return oTipoMovimentacao.is_ativo;
                    });
                }
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
app.controller('addUsuarioCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    $scope.targetUsuario = {};
    $scope.loggedUsuario = dataservice.getUsuario();

    //Inicia Processo
    U2X_ConfiguraInterface();
    validaLogin();
    $('.collapsible').collapsible();

    $scope.btnAdd = function () {

        if (!$scope.targetUsuario.login) {
            this.toasterService.pop('success', 'Digite o [login].');
            return;
        }

        if (!$scope.targetUsuario.senha) {
            this.toasterService.pop('success', 'Digite a [senha].');
            return;

        }

        U2X_AbreLoader();
        $scope.targetUsuario.id_instituicao = $scope.loggedUsuario.id_instituicao;

        $http({
            method: 'POST',
            url: dataservice.url + '/api/usuario',
            data: $scope.targetUsuario
        }).then(function sucess(response) {
            $location.path("/usuario");
            U2X_FechaLoader();
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });

    }

    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
            return;
        }

        if (!oUsuario.isAdmin) {
            $location.path("/");
            U2X_FechaLoader();
            return;
        }
    }
});


app.controller('cadastroCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();

    $scope.cadastra = function () {

        if (!$scope.nome || $scope.nome == "") {
            Materialize.toast('Favor preencher [Nome].', 4000);
            return;
        }

        if (!$scope.documento || $scope.documento == "") {
            Materialize.toast('Favor preencher [CPF/CNPJ].', 4000);
            return;
        }

        if (!U2X_ValidaCPFCNPJ($scope.documento)) {
            Materialize.toast('O [CPF/CNPJ] é inválido.', 4000);
            return;
        }


        if (!$scope.email || $scope.email == "") {
            Materialize.toast('Favor preencher [E-mail].', 4000);
            return;
        }

        if (!U2X_ValidateEmail($scope.email)) {
            Materialize.toast('O [e-mail] é inválido.', 4000);
            return;
        }

        if (!$scope.telefone || $scope.telefone == "") {
            Materialize.toast('Favor preencher [Telefone].', 4000);
            return;
        }

        if (!$scope.login || $scope.login == "") {
            Materialize.toast('Favor preencher [Login].', 4000);
            return;
        }

        if ($scope.login.split(" ").length > 1) {
            Materialize.toast('O [Login] não pode conter espaços.', 4000);
            return;
        }

        if (!$scope.senha || $scope.senha == "") {
            Materialize.toast('Favor preencher [Senha].', 4000);
            return;
        }

        if (!$scope.senha || $scope.senha.length <= 4) {
            Materialize.toast('Favor digitar uma [Senha] com mais de 4 digitos.', 4000);
            return;
        }

        if ($scope.senha != $scope.confirmacaoSenha) {
            Materialize.toast('A [Senha] e [Confirmacao de Senha] não são iguais.', 4000);
            return;
        }

        var value = {};

        value.nome = $scope.nome;
        value.documento = $scope.documento;
        value.telefone = $scope.telefone;
        value.email = $scope.email;
        value.login = $scope.login;
        value.senha = $scope.senha;

        U2X_AbreLoader();

        $http({
            method: 'POST',
            url: dataservice.url + '/api/Instituicao_Adicionar',
            data: value
        }).then(function sucess(response) {
            var oUsuario = {};
            oUsuario.login = $scope.login;
            oUsuario.senha = $scope.senha;
            dataservice.setUsuario(oUsuario);

            $location.path("/");
            U2X_FechaLoader();
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });

    }

});
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
app.controller('loginCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    var oUsuario;

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    //Self Login
    oUsuario = dataservice.getUsuario();
    if (oUsuario) {
        LoginAtServer();
    } else {
        U2X_FechaLoader();
    }

    //Login
    $scope.Login = function () {
        oUsuario = {};
        oUsuario.login = $scope.login;
        oUsuario.senha = $scope.senha;
        LoginAtServer();
    };


    function LoginAtServer() {
        $http({
            method: 'POST',
            url: dataservice.url + '/api/Login',
            data: oUsuario
        }).then(function sucess(response) {
            //obtem 
            var obj = response.data;

            //Valida Dados
            if (!obj) {
                dataservice.setUsuario({});
                Materialize.toast('Usuario ou senha inválidos', 4000)
                $location.path("/");
                U2X_FechaLoader();
                return;
            }

            // Trata cabecalho
            dataservice.setUsuario(obj);
            $scope.$emit('usuario_logado', obj);
            $location.path("/dashboard");
            U2X_FechaLoader();

        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar o login', 4000);
            $location.path("/");
            U2X_FechaLoader();
            return;
        });
    }
});

app.controller('menuCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Obtem ususario 
    $scope.usuario = dataservice.getUsuario();

    //Recebe usuario 
    $rootScope.$on('usuario_logado', function (e, args, status) {
        $scope.usuario = dataservice.getUsuario();
    });

    // log Out
    $scope.LogOut = function () {
        $scope.usuario = undefined;
        dataservice.setUsuario(undefined);
        $location.path("/login");
    }
});


app.controller('movimentacaoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    var oUsuario = U2X_ValidaLogin(dataservice.getUsuario());
    Populate();

    function Populate() {
        U2X_AbreLoader();
        $http({
            method: 'GET',
            url: dataservice.url + '/api/TipoMovimentacao/' + oUsuario.id_instituicao,

        }).then(function sucess(response) {
            $scope.lstTipoMovimentacao = response.data;
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
        if (!$scope.descricao || $scope.descricao == "") {
            Materialize.toast('Digite o [descricao] do novo tipo de Movimentacao.', 4000);
            return;
        }

        var tipoMovimentacao = {};

        tipoMovimentacao.id_instituicao = oUsuario.id_instituicao;
        tipoMovimentacao.descricao = $scope.descricao;
        tipoMovimentacao.is_ativo = true;

        U2X_AbreLoader();

        $http({
            method: 'POST',
            url: dataservice.url + '/api/TipoMovimentacao',
            data: tipoMovimentacao
        }).then(function sucess(response) {
            Materialize.toast('Tipo de Movimentacao adicionado com sucesso', 4000);
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
        $scope.lstTipoMovimentacaoFiltered = $scope.lstTipoMovimentacao.filter(function (a) {

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

    $scope.Alterar = function (tipoMovimentacao, is_ativo) {
        tipoMovimentacao.is_canceled = !is_ativo;

        var sOperacao = tipoMovimentacao.is_canceled ? "cancelado" : "reativado";
        var id = tipoMovimentacao.is_canceled ? 1 : 0;
        U2X_AbreLoader();
        $http({
            method: 'GET',
            url: dataservice.url + '/api/TipoMovimentacao/AlteraStatus/' + tipoMovimentacao.id + "/" + id,
            data: tipoMovimentacao
        }).then(function sucess(response) {
            Materialize.toast('O tipo de Movimentacao foi ' + sOperacao, 4000);
            U2X_FechaLoader();
            Populate();
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });
    }
});
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
app
    .controller('usuarioCtrl', function ($scope, $rootScope, $http, $location, dataservice) {

        $scope.loggedUsuario = {};
        $scope.lstUsuario = [];
        $scope.lstUsuarioFiltered = [];
        $scope.targetUsuario = {};
        $scope.sSenha = "";
        $scope.sBusca = ""


        //Inicia Processo
        U2X_ConfiguraInterface();
        Populate();

        function Populate() {
            $scope.loggedUsuario = dataservice.getUsuario();
            U2X_AbreLoader();
            if ($scope.loggedUsuario.isAdmin) {
                $http({
                    method: 'GET',
                    url: dataservice.url + '/api/usuario/' + $scope.loggedUsuario.id_instituicao
                }).then(function sucess(response) {
                    $scope.lstUsuario = response.data;
                    $scope.lstUsuarioFiltered = response.data;
                    U2X_FechaLoader();
                }, function errorCallback(response) {
                    U2X_TrataErro(response);
                    U2X_FechaLoader();
                })
            } else {
                $scope.lstUsuario = [];
                $scope.lstUsuario.push($scope.loggedUsuario);
                $scope.lstUsuarioFiltered = $scope.loggedUsuario;
                U2X_FechaLoader();
            }

        }

        $scope.changeBusca = function (busca) {
            $scope.lstUsuarioFiltered = $scope.lstUsuario.filter(function (a) {
                //valida nome
                if ((busca || busca.length == 0) &&
                    (a.login.toUpperCase().indexOf(busca.toUpperCase()) == -1)) {
                    return false;
                }
                return true;
            });
        }

        $scope.OpenChangePassword = function (usuario) {
            $scope.targetUsuario = usuario;
            $('#mdlChangePassword').modal('open');
        }

        $scope.CloseChangePassword = function () {
            $('#mdlChangePassword').modal('close');
        }


        $scope.ChangePassword = function () {
            if (!$scope.sSenha || $scope.sSenha.length < 4) {
                Materialize.toast('Digite o uma nova [senha] para o usuário.', 4000)
                return;
            }
            $scope.targetUsuario.senha = $scope.sSenha;
            U2X_AbreLoader();

            $http({
                method: 'POST',
                url: dataservice.url + '/api/UsuarioAtualiza',
                data: $scope.targetUsuario
            }).then(function sucess(response) {
                Materialize.toast('O usuario [' + $scope.targetUsuario.login + '] trocou de senha', 4000)
                U2X_FechaLoader();
                $('#mdlChangePassword').modal('close');
            }, function errorCallback(response) {
                U2X_TrataErro(response);
                U2X_FechaLoader();
                $('#mdlChangePassword').modal('close');
            })
        }

        $scope.ChangeAdmin = function (usuario, toAdmin) {
            $scope.targetUsuario = usuario;
            $scope.targetUsuario.isAdmin = toAdmin;

            var sComplemento = toAdmin ? "tornou se administrador" : "deixou de ser administrador";

            $http({
                method: 'POST',
                url: dataservice.url + '/api/UsuarioAtualiza',
                data: $scope.targetUsuario
            }).then(function sucess(response) {
                Materialize.toast('O usuario [' + $scope.targetUsuario.login + '] ' + sComplemento + ' com sucesso.', 4000)
                U2X_FechaLoader();
                Populate();
                $('#mdlChangePassword').modal('close');
            }, function errorCallback(response) {
                U2X_TrataErro(response);
                U2X_FechaLoader();
                $('#mdlChangePassword').modal('close');
            });
        }
    });
app.controller('widgetEstrelaCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    //Inicia Processo
    U2X_ConfiguraInterface();
    var oUsuario = U2X_ValidaLogin(dataservice.getUsuario());

    CarregaDados();
    $scope.estrelas = "?";
    function CarregaDados() {

        $http({
            method: 'POST',
            url: dataservice.url + '/api/Obtem_Estrela',
            data: oUsuario
        }).then(function sucess(response) {
            if (response) {
                if (response.data) {
                    $scope.estrelas = response.data;
                }
            }
        }, function errorCallback(response) {
        });
    }

    $scope.OpenAddEstrelas = function () {
        $('#mdlEstrela').modal('open');
    }

    $scope.CloseAddEstrela = function () {
        $('#mdlEstrela').modal('close');
    }

    $scope.AddEstrela = function () {


        if (!$scope.email || $scope.email == "") {
            Materialize.toast('Favor preencher [E-mail].', 4000);
            return;
        }

        if (!U2X_ValidateEmail($scope.email)) {
            Materialize.toast('O [e-mail] é inválido.', 4000);
            return;
        }

        if (!$scope.telefone || $scope.telefone == "") {
            Materialize.toast('Favor preencher [Telefone].', 4000);
            return;
        }

        U2X_AbreLoader();
        var estrela = {}
        estrela.id_usuario = oUsuario.id;
        estrela.telefone = $scope.telefone;
        estrela.email = $scope.email;

        $http({
            method: 'POST',
            url: dataservice.url + '/api/Adicionar_Estrela',
            data: estrela
        }).then(function sucess(response) {
            Materialize.toast('Vamos enviar um pedido para o seu amigo.', 4000);
            U2X_FechaLoader();
            CarregaDados();
            $('#mdlEstrela').modal('close');
        }, function errorCallback(response) {
            U2X_TrataErro(response);
            U2X_FechaLoader();
            return;
        });

    }
});
app.filter('NumberToStringFormat', function (
    valor,
    precision,
    prefix,
    sufix,
    decimalSeparator,
    millionSeparator) {


    try {
        //validate parameter
        if (!valor) valor = 0;
        if (!prefix) prefix = "";
        if (!sufix) sufix = "";
        if (!decimalSeparator) decimalSeparator = ",";
        if (!millionSeparator) millionSeparator = ".";

        //trasnform in string 
        var sValor = valor.toString();

        //split in decimal and int
        var sDecimal = "";
        var sInteger = "";

        sInteger = sValor.split(".")[0];
        if (precision > 0) {
            sDecimal = sValor.split(".")[1];
            if (!sDecimal) sDecimal = "";

            if (sDecimal.length > precision) {
                sDecimal = sDecimal.substring(0, precision);
            }
            while (sDecimal.length < precision) {
                sDecimal = sDecimal + "0";
            }
        }

        //split decimal in tri
        //let tempString: string
        var millionList = []
        while (sInteger.length != 0) {
            if (sInteger.length > 3) {
                millionList.push(sInteger.substring(sInteger.length - 3));
                sInteger = sInteger.substring(0, sInteger.length - 3)
            } else {
                millionList.push(sInteger);
                sInteger = "";
            }
        }
        //concat int with "point"
        millionList = millionList.reverse();
        sInteger = millionList.join(millionSeparator);

        //concat decimal with "comma"
        if (sDecimal.length == 0) {
            sValor = prefix + sInteger + sufix;
        } else {
            sValor = prefix + sInteger + decimalSeparator + sDecimal + sufix;
        }
        return sValor;
    }
    catch (error) {

    }
})
var app = angular.module('myApp', ["ngRoute"]);
app
    .directive('myRepeatDirective', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {

                $('.collapsible').collapsible();
                $('select').material_select();
            }
        };
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "controllers/login.html"
            })
            .when("/login", {
                templateUrl: "controllers/login.html"
            })
            .when("/dashboard", {
                templateUrl: "controllers/dashboard.html"
            })
            .when("/movimentacao", {
                templateUrl: "controllers/movimentacao.html"
            })
            .when("/pagamento", {
                templateUrl: "controllers/pagamento.html"
            })
            .when("/usuario", {
                templateUrl: "controllers/usuario.html"
            })
            .when("/addusuario", {
                templateUrl: "controllers/add_usuario.html"
            })
            .when("/addmovimentacao", {
                templateUrl: "controllers/add_movimentacao.html"
            })
            .when("/historico", {
                templateUrl: "controllers/historico.html"
            })
            .when("/cadastro", {
                templateUrl: "controllers/cadastro.html"
            });
    });


app.factory('dataservice', function () {

    var usuario;

    return {
        url: 'http://TheFlux.u2x.com.br',
        
        setUsuario: function (usuario) {
            if (!usuario || !usuario.login) {
                setCookie("usuario", "");
            }

            usuario = usuario;
            setCookie("usuario", JSON.stringify(usuario));
        },
        getUsuario: function () {
            try {
                var oUsuario = JSON.parse(getCookie("usuario"));
                if (oUsuario.login) {
                    return oUsuario;
                }
                return undefined;
            } catch (e) {
                return undefined;
            }

        }
    };


    function setCookie(cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
});


function U2X_ConfiguraInterface() {
    U2X_ConfigModal();
    $('.button-collapse').sideNav();
    $('select').material_select();
    $('.collapsible').collapsible();
}

function U2X_ValidaLogin(oUsuario) {
    if (!oUsuario) {
        $location.path("/login");
        U2X_FechaLoader();
    }
    return oUsuario;
}

function U2X_AbreLoader() {
    $('#modalLoader').modal('open');
}

function U2X_FechaLoader() {
    $('#modalLoader').modal('close');
}

function U2X_ConfigModal() {
    $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .8, // Opacity of modal background
    });
}
function U2X_TrataErro(error) {
    console.log(error);

    if (!error) {
        Materialize.toast('Não foi possível realizar a operação', 4000);
        return;
    }

    if (!error.data) {
        Materialize.toast('Não foi possível realizar a operação', 4000);
        return;
    }
    if (!error.data.ExceptionMessage) {
        Materialize.toast('Não foi possível realizar a operação', 4000);
        return;
    }

    var msg = error.data.ExceptionMessage;
    if (msg.indexOf("U2X_Message") > -1) {
        Materialize.toast(msg.replace("U2X_Message", ""), 4000);
        return;
    }

    Materialize.toast('Não foi possível realizar a operação', 4000);


}


function U2X_TrataValores(
    valor,
    precision,
    prefix,
    sufix,
    decimalSeparator,
    millionSeparator) {

    try {
        //validate parameter
        if (!valor) valor = 0;
        if (!prefix) prefix = "";
        if (!sufix) sufix = "";
        if (!decimalSeparator) decimalSeparator = ",";
        if (!millionSeparator) millionSeparator = ".";

        //trasnform in string 
        var sValor = valor.toString();

        //split in decimal and int
        var sDecimal = "";
        var sInteger = "";

        sInteger = sValor.split(".")[0];
        if (precision > 0) {
            sDecimal = sValor.split(".")[1];
            if (!sDecimal) sDecimal = "";

            if (sDecimal.length > precision) {
                sDecimal = sDecimal.substring(0, precision);
            }
            while (sDecimal.length < precision) {
                sDecimal = sDecimal + "0";
            }
        }

        //split decimal in tri
        //let tempString: string
        var millionList = []
        while (sInteger.length != 0) {
            if (sInteger.length > 3) {
                millionList.push(sInteger.substring(sInteger.length - 3));
                sInteger = sInteger.substring(0, sInteger.length - 3)
            } else {
                millionList.push(sInteger);
                sInteger = "";
            }
        }
        //concat int with "point"
        millionList = millionList.reverse();
        sInteger = millionList.join(millionSeparator);

        //verify is sInterger 
        if (sInteger.indexOf("-.") > -1) {
            sInteger = sInteger.replace("-.", "-");
        }

        //concat decimal with "comma"
        if (sDecimal.length == 0) {
            sValor = prefix + sInteger + sufix;
        } else {
            sValor = prefix + sInteger + decimalSeparator + sDecimal + sufix;
        }
        return sValor;
    }
    catch (error) {

    }
}

/*
 verifica_cpf_cnpj
 
 Verifica se é CPF ou CNPJ
 
 @see http://www.todoespacoonline.com/w/
*/
function verifica_cpf_cnpj(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Verifica CPF
    if (valor.length === 11) {
        return 'CPF';
    }

    // Verifica CNPJ
    else if (valor.length === 14) {
        return 'CNPJ';
    }

    // Não retorna nada
    else {
        return false;
    }

} // verifica_cpf_cnpj

/*
 calc_digitos_posicoes
 
 Multiplica dígitos vezes posições
 
 @param string digitos Os digitos desejados
 @param string posicoes A posição que vai iniciar a regressão
 @param string soma_digitos A soma das multiplicações entre posições e dígitos
 @return string Os dígitos enviados concatenados com o último dígito
*/
function calc_digitos_posicoes(digitos, posicoes = 10, soma_digitos = 0) {

    // Garante que o valor é uma string
    digitos = digitos.toString();

    // Faz a soma dos dígitos com a posição
    // Ex. para 10 posições:
    //   0    2    5    4    6    2    8    8   4
    // x10   x9   x8   x7   x6   x5   x4   x3  x2
    //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
    for (var i = 0; i < digitos.length; i++) {
        // Preenche a soma com o dígito vezes a posição
        soma_digitos = soma_digitos + (digitos[i] * posicoes);

        // Subtrai 1 da posição
        posicoes--;

        // Parte específica para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if (posicoes < 2) {
            // Retorno a posição para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divisão entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos é menor que 2
    if (soma_digitos < 2) {
        // soma_digitos agora será zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado é 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso dígito procurado é 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um dígito aos primeiro nove dígitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;

} // calc_digitos_posicoes

/*
 Valida CPF
 
 Valida se for CPF
 
 @param  string cpf O CPF com ou sem pontos e traço
 @return bool True para CPF correto - False para CPF incorreto
*/
function valida_cpf(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Captura os 9 primeiros dígitos do CPF
    // Ex.: 02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
    var novo_cpf = calc_digitos_posicoes(digitos);

    // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
    var novo_cpf = calc_digitos_posicoes(novo_cpf, 11);

    // Verifica se o novo CPF gerado é idêntico ao CPF enviado
    if (novo_cpf === valor) {
        // CPF válido
        return true;
    } else {
        // CPF inválido
        return false;
    }

} // valida_cpf

/*
 valida_cnpj
 
 Valida se for um CNPJ
 
 @param string cnpj
 @return bool true para CNPJ correto
*/
function valida_cnpj(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // O valor original
    var cnpj_original = valor;

    // Captura os primeiros 12 números do CNPJ
    var primeiros_numeros_cnpj = valor.substr(0, 12);

    // Faz o primeiro cálculo
    var primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);

    // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
    var segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);

    // Concatena o segundo dígito ao CNPJ
    var cnpj = segundo_calculo;

    // Verifica se o CNPJ gerado é idêntico ao enviado
    if (cnpj === cnpj_original) {
        return true;
    }

    // Retorna falso por padrão
    return false;

} // valida_cnpj

/*
 valida_cpf_cnpj
 
 Valida o CPF ou CNPJ
 
 @access public
 @return bool true para válido, false para inválido
*/
function U2X_ValidaCPFCNPJ(valor) {

    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if (valida === 'CPF') {
        // Retorna true para cpf válido
        return valida_cpf(valor);
    }

    // Valida CNPJ
    else if (valida === 'CNPJ') {
        // Retorna true para CNPJ válido
        return valida_cnpj(valor);
    }

    // Não retorna nada
    else {
        return false;
    }

} // valida_cpf_cnpj

/*
 formata_cpf_cnpj
 
 Formata um CPF ou CNPJ
 
 @access public
 @return string CPF ou CNPJ formatado
*/
function formata_cpf_cnpj(valor) {

    // O valor formatado
    var formatado = false;

    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj(valor);

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if (valida === 'CPF') {

        // Verifica se o CPF é válido
        if (valida_cpf(valor)) {

            // Formata o CPF ###.###.###-##
            formatado = valor.substr(0, 3) + '.';
            formatado += valor.substr(3, 3) + '.';
            formatado += valor.substr(6, 3) + '-';
            formatado += valor.substr(9, 2) + '';

        }

    }

    // Valida CNPJ
    else if (valida === 'CNPJ') {

        // Verifica se o CNPJ é válido
        if (valida_cnpj(valor)) {

            // Formata o CNPJ ##.###.###/####-##
            formatado = valor.substr(0, 2) + '.';
            formatado += valor.substr(2, 3) + '.';
            formatado += valor.substr(5, 3) + '/';
            formatado += valor.substr(8, 4) + '-';
            formatado += valor.substr(12, 14) + '';

        }

    }

    // Retorna o valor 
    return formatado;

} // formata_cpf_cnpj

function U2X_ValidateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}