app.controller('mensalidadeAlunoCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    $scope.loggedUsuario = dataservice.getUsuario();
    $scope.plano = {};
    $scope.mensalidade = {};


    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();

    ObtemAluno();
    ObtemMensalidades();
    function ObtemAluno() {
        $scope.aluno = dataservice.getAluno();

    }


    function ObtemMensalidades() {
        U2X_AbreLoader();

        $scope.aluno = dataservice.getAluno();
        $http({
            method: 'POST',
            url: dataservice.url + "/api/Mensalidade_Obtem",
            data: $scope.aluno
        }).then(function sucess(response) {
            $scope.mensalidades = response.data;
            U2X_FechaLoader();
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            U2X_FechaLoader();

        });
    }

    $scope.getStatus = function (mensalidade) {

        if (mensalidade.dt_pagamento) { return "Pago"; }

        var d = new Date();
        var todayYear = d.getFullYear();
        var todayMonth = d.getMonth() + 1;

        if (mensalidade.ano < todayYear || (mensalidade.ano == todayYear && mensalidade.mes < todayMonth))
        { return "Atrasado"; }

        return "Aguardando";

    }

    $scope.getStyle = function (mensalidade) {

        if (mensalidade.dt_pagamento) { return "grey"; }
        var d = new Date();
        var todayYear = d.getFullYear();
        var todayMonth = d.getMonth() + 1;

        if (mensalidade.ano < todayYear || (mensalidade.ano == todayYear && mensalidade.mes < todayMonth))
        { return "red"; }
        return "black";

    }

    $scope.trataValores = U2X_TrataValores;

    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }

    $scope.OpenPagamento = function (mensalidade) {
        debugger;
        CheckOut($http, "fba_pereira@hotmail.com", "4A82A4D0DCDF4D6D8140508ADE3EFC17", $scope.aluno.nome, $scope.aluno.email, [{ "nome": "Mensalidade de" + mensalidade.mes + "/" + mensalidade.ano, "valor": mensalidade.valor }])
    }
});