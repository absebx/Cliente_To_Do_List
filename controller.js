angular.module("indexApp",[])
  //index controller
  .controller("indexController",function($scope,$http,$location){
    //datos seleccionados
    $scope.selectedUser={};
    $scope.selectedBoard={};
    //obtener usuarios de la base de datos
    $http.get("http://localhost:27697/api/users")
      .then(function(data){
        $scope.users=data.data;
      },function(err){
        console.log(err);
      });

    //obtener board del usuario
    $scope.getBoard = function(user){
      $scope.selectedUser = user;
      //llamar a api por el board
      $http.get("http://localhost:27697/api/boards/"+user.Id)
        .then(function(data){
          //seleccionar board
          $scope.selectedBoard=data.data;
        },function(err){
          console.log(err);
        });
    }
  });
