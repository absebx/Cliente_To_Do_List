angular.module("indexApp",[])
  //index controller
  .controller("indexController",function($scope,$http,$location){
    //datos seleccionados
    $scope.selectedUser={};
    $scope.selectedBoard={};
    $scope.tickets={};
    $scope.newTicket={};
    $scope.date=new Date();
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
          //obtener tickets
          $scope.tickets = $scope.addTicket();
        },function(err){
          console.log(err);
        });
    }

    //funcion para obtener los tickets de un board
    $scope.getTicketByBoard = function(){
      $http.get("http://localhost:27697/api/tickets/byBoard/"+$scope.selectedBoard.Id)
        .then(function(data){
          return data.data;
        },function(err){
          console.log(err);
        });
    }
    
    //funcion para agregar tickets en base al usuario y board seleccionado
    $scope.addTicket = function(){
      $scope.date=new Date();
      $http.post("http://localhost:27697/api/tickets",{
        Id: 1,
        Title: $scope.newTicket.Title,
        Description: $scope.newTicket.Description,
        Date: $scope.date,
        EstimatedTime: $scope.newTicket.EstimatedTime,
        BoardID: $scope.selectedBoard.Id
      })
        .then(function(data){
          $scope.newTicket={};
          console.log(data)
        },function(err){
          console.log(err);
        });
    }



  });
