angular.module("indexApp",[])
  //directiva para color del status
  .directive('colorStatus',function(){
    return function(scope,element,attrs){
      //obtener atributos del objetos
      attrs.$observe('colorStatus',function(value){
        element.css({
          //se establece el color de fondo del ststus
          'background-color': value
        });
      })
    }
  })
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
      $http.get("http://localhost:27697/api/boards/byuser/"+user.Id)
        .then(function(data){
          //seleccionar board
          $scope.selectedBoard=data.data;
          //obtener tickets
          $scope.getTicketByBoard();
        },function(err){
          console.log(err);
        });
    }

    //funcion para obtener los tickets de un board
    $scope.getTicketByBoard = function(){
      $http.get("http://localhost:27697/api/tickets/byBoard/"+$scope.selectedBoard.Id)
        .then(function(data){
          $scope.tickets = data.data;
        },function(err){
          console.log(err);
        });
    }

    //funcion para obtener relaciones por tickets
    //funcion no utilizada
    $scope.getTicketRelations = function(){
      console.log($scope.tickets);
      for(var key in $scope.tickets){
        var obj = $scope.tickets[key];
        for (var prop in obj){
          if(obj.hasOwnProperty(prop)){
            console.log(prop + "="+obj[prop]);
          }
        }
      }
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
          //dejar ticket en blanco
          $scope.newTicket={};
          //Cargar otra vez el board
          $scope.getBoard($scope.selectedUser);
        },function(err){
          console.log(err);
        });
    }

    $scope.deleteTicket = function(id){
      $http.delete("http://localhost:27697/api/tickets/"+id)
        .then(function(data){
          //cuando se ejecute actualizar
          $scope.getBoard($scope.selectedUser);
        },function(err){
          console.log(err);
        });
    }
  });
