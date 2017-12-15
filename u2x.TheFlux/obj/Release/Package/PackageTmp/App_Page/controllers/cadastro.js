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