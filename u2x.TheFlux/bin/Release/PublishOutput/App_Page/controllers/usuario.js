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