angular.module("indexApp",[])
  //index controller
  .controller("indexController",function($scope,$http,$location){
    $scope.name="Abner";
    $scope.selectedUser={};
    //obtener usuarios de la base de datos
    $http.get("http://localhost:27697/api/users")
      .then(function(data){
        $scope.users=data.data;
      },function(err){
        console.log(err);
      });
