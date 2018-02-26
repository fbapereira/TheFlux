app.controller('alunosCtrl', function ($scope, $rootScope, $http, $location, dataservice) {
    $scope.loggedUsuario = dataservice.getUsuario();
    $scope.aluno = {};
    $scope.alunos = [];
    $scope.loggedUsuario = {};
    $scope.isEditing = false;

    //Inicia Processo
    U2X_ConfiguraInterface();
    U2X_AbreLoader();
    ObtemAlunos();


    function ObtemAlunos() {
        U2X_AbreLoader();

        $scope.aluno.id_instituicao = dataservice.getUsuario().id_instituicao;
        $http({
            method: 'POST',
            url: dataservice.url + "/api/Aluno_Obtem",
            data: $scope.aluno
        }).then(function sucess(response) {
            $scope.alunos = response.data;
            $scope.alunosFiltered = $scope.alunos;
            if ($scope.sBusca) {
                $scope.changeBusca($scope.sBusca)
            }
            U2X_FechaLoader();

            $("#mdlNovoAluno").modal("close");
        }, function errorCallback(response) {
            console.log(response);
            Materialize.toast('Não foi possível realizar a operação', 4000);
            U2X_FechaLoader();

        });
    }

    function validaLogin() {
        oUsuario = dataservice.getUsuario();
        if (!oUsuario) {
            $location.path("/login");
            U2X_FechaLoader();
        }
        $scope.loggedUsuario = oUsuario;
    }

    $scope.changeBusca = function (busca) {
        $scope.alunosFiltered = $scope.alunos.filter(function (a) {
            //valida nome
            if ((busca && busca.length == 0) ||
                (a.nome.toUpperCase().indexOf(busca.toUpperCase()) > -1 ||
                    a.cpf.toUpperCase().indexOf(busca.toUpperCase()) > -1 ||
                    a.email.toUpperCase().indexOf(busca.toUpperCase()) > -1)

            ) {
                return true;
            }
            return false;
        });
    }

    $scope.btnAdd = function () {
        if (!$scope.aluno.nome || $scope.aluno.nome == '') {
            Materialize.toast('Digite o [Nome].', 4000);
            return;
        }

        if (!$scope.aluno.cpf || $scope.aluno.cpf == '') {
            Materialize.toast('Digite o [cpf].', 4000);
            return;
        }

        if (!U2X_ValidaCPFCNPJ($scope.aluno.cpf)) {
            Materialize.toast('O [cpf] é inválido.', 4000);
            return;
        }

        if (!$scope.aluno.email || $scope.aluno.email == '') {
            Materialize.toast('Digite o [e-mail].', 4000);
            return;
        }

        if (!U2X_ValidateEmail($scope.aluno.email)) {
            Materialize.toast('O [e-mail] é inválido.', 4000);
            return;
        }


        $scope.aluno.id_instituicao = dataservice.getUsuario().id_instituicao;
        U2X_AbreLoader();
        var sUrl = '';

        if ($scope.isEditing) {
            sUrl = "/api/Aluno_Editar";
        } else {
            sUrl = "/api/Aluno_Adicionar";
        }

        $http({
            method: 'POST',
            url: dataservice.url + sUrl,
            data: $scope.aluno
        }).then(function sucess(response) {
            $("#mdlNovoAluno").modal("close");
            ObtemAlunos();
            if ($scope.isEditing) {
                Materialize.toast('Aluno editado com sucesso.', 4000);
            } else {
                Materialize.toast('Aluno cadastrado com sucesso.', 4000);

            }
            U2X_FechaLoader();

        }, function errorCallback(response) {
            console.log(response);
            U2X_FechaLoader();
            Materialize.toast('Não foi possível realizar a operação', 4000);
        });

    }

    $scope.AbreModalCriaAluno = function (aluno) {
        $scope.isEditing = Boolean(aluno);
        $scope.aluno = aluno;
        $("#mdlNovoAluno").modal("open");
    }

    $scope.AddMensalidades = function (aluno) {
        dataservice.setAluno(aluno);
        $location.path("/mensalidade");
    }


    $scope.FechaModal = function () {
        if ($scope.aluno) {
            ObtemAlunos();
        } else {
            $("#mdlNovoAluno").modal("close");
        }
    }


});