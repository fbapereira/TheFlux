﻿app.controller('mensalidadeCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    $scope.loggedUsuario = dataservice.getUsuario();
    $scope.plano = {};


    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();
    ObtemMensalidades();


    $scope.btnAdicionarMensalidade = function () {
        if ($scope.plano.parcelas < 1) {
            Materialize.toast('Adicionar ao menos uma [parcela]..', 4000);
            return;
        }

        if ($scope.plano.valor < 1) {
            Materialize.toast('A [parcela] deve ter mais de um real.', 4000);
            return;
        }

        if (!$scope.plano.data || $scope.plano.data == '') {
            Materialize.toast('Digite o [Data].', 4000);
            return;
        }

        U2X_AbreLoader();
        $scope.plano.id_aluno = dataservice.getAluno().id;
        $http({
            method: 'POST',
            url: dataservice.url + "/api/Plano_Adicionar",
            data: $scope.plano
        }).then(function sucess(response) {
            U2X_FechaLoader();
            ObtemMensalidades();
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            U2X_FechaLoader();

        });
    }

    $scope.trataValores = U2X_TrataValores;

    $scope.getStyle = function (nNumber) {
        return nNumber > 0 ? "green" : "red";
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

    $scope.dataFormat = function (data) {

        return moment(data).format("DD/MM/YYYY");
    }

    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }

        oAluno = dataservice.getAluno();
        if (!oAluno) {
            $location.path("/alunos");
            U2X_FechaLoader();
        }
        $scope.loggedUsuario = oUsuario;
    }

    //$scope.changeBusca = function (busca) {
    //    $scope.alunosFiltered = $scope.alunos.filter(function (a) {
    //        //valida nome
    //        if ((busca && busca.length == 0) ||
    //            (a.nome.toUpperCase().indexOf(busca.toUpperCase()) > -1 ||
    //                a.cpf.toUpperCase().indexOf(busca.toUpperCase()) > -1 ||
    //                a.email.toUpperCase().indexOf(busca.toUpperCase()) > -1)

    //        ) {
    //            return true;
    //        }
    //        return false;
    //    });
    //}

    //$scope.btnAdd = function () {
    //    if (!$scope.aluno.nome || $scope.aluno.nome == '') {
    //        Materialize.toast('Digite o [Nome].', 4000);
    //        return;
    //    }

    //    if (!$scope.aluno.cpf || $scope.aluno.cpf == '') {
    //        Materialize.toast('Digite o [cpf].', 4000);
    //        return;
    //    }

    //    if (!U2X_ValidaCPFCNPJ($scope.aluno.cpf)) {
    //        Materialize.toast('O [cpf] é inválido.', 4000);
    //        return;
    //    }

    //    if (!$scope.aluno.email || $scope.aluno.email == '') {
    //        Materialize.toast('Digite o [e-mail].', 4000);
    //        return;
    //    }

    //    if (!U2X_ValidateEmail($scope.aluno.email)) {
    //        Materialize.toast('O [e-mail] é inválido.', 4000);
    //        return;
    //    }


    //    $scope.aluno.id_instituicao = dataservice.getUsuario().id_instituicao;
    //    U2X_AbreLoader();
    //    var sUrl = '';

    //    if ($scope.isEditing) {
    //        sUrl = "/api/Aluno_Editar";
    //    } else {
    //        sUrl = "/api/Aluno_Adicionar";
    //    }

    //    $http({
    //        method: 'POST',
    //        url: dataservice.url + sUrl,
    //        data: $scope.aluno
    //    }).then(function sucess(response) {
    //        $("#mdlNovoAluno").modal("close");
    //        ObtemAlunos();
    //        Materialize.toast('Aluno cadastrado com sucesso.', 4000);
    //        U2X_FechaLoader();

    //    }, function errorCallback(response) {
    //        console.log(response);
    //        U2X_FechaLoader();
    //        Materialize.toast('Não foi possível realizar a operação', 4000);
    //    });

    //}

    //$scope.AbreModalCriaAluno = function (aluno) {
    //    $scope.isEditing = Boolean(aluno);
    //    $scope.aluno = aluno;
    //    $("#mdlNovoAluno").modal("open");
    //}

    //$scope.AddMensalidades = function (aluno) {
    //    $location.path("/mensalidade");
    //}

    //$scope.FechaModal = function () {
    //    ObtemAlunos();
    //    $("#mdlNovoAluno").modal("close");
    //}

});