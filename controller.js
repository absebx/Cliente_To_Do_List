angular.module("indexApp",[])
  //index controller
  .controller("indexController",function($scope,$http,$location){
    //datos seleccionados
    $scope.selectedUser={};
    $scope.selectedBoard={};
    $scope.tickets={};
    //obtener usuarios de la base de datos
    $http.get("http://localhost:27697/api/users")
      .then(function(data){
        $scope.users=data.data;
      },function(err){
        console.log(err);
      });

    //funcion para obtener board y tickets del usuario
    $scope.getBoard = function(user){
      $scope.selectedUser = user;
      //llamar a api por el board
      $http.get("http://localhost:27697/api/boards/"+user.Id)
        .then(function(data){
          //seleccionar board
          $scope.selectedBoard=data.data;
          //obtener tickets del board
          $http.get("http://localhost:27697/api/tickets/"+0/*$scope.selectedBoard.Id*/)
            .then(function(data){
              console.log(data.data);
            },function(err){
              console.log(err);
            });
        },function(err){
          console.log(err);
        });
    }

  });
