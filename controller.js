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
    //IMPORTANTE: Cambiar servidor en caso de cambio
    $scope.server="http://localhost:27697/api";
    //datos seleccionados
    $scope.selectedUser={};
    $scope.selectedBoard={};
    $scope.selectedTicket={};
    $scope.selectedTicketRelation={};
    $scope.tickets={};
    $scope.newTicket={};
    $scope.date=new Date();
    $scope.allStatus={};
    //datos de Utilidades
    $scope.showIngresar = false;
    $scope.showControllers = false;
    $scope.showModificar = false;
    //datos de filtros
    $scope.filterSelectedStatus = "todos";
    $scope.filterSelectedDate = new Date();

    //obtener usuarios de la base de datos
    $http.get($scope.server+"/users")
      .then(function(data){
        $scope.users=data.data;
      },function(err){
        console.log(err);
      });

    //obtener estados de la base de datos
    $http.get($scope.server+"/status")
      .then(function(data){
        $scope.allStatus=data.data;
      },function(err){
        console.log(err);
      });

    //funcion para obtener board y tickets del usuario
    $scope.getBoard = function(user){
      if(!$scope.showControllers){
        $scope.showControllers=true;
      }
      //resetar filtros
      $scope.resetFilters();
      //Dejar usuario seleccionado
      $scope.selectedUser = user;
      //llamar a api por el board
      $http.get($scope.server+"/boards/byuser/"+user.Id)
        .then(function(data){
          //seleccionar board
          $scope.selectedBoard=data.data;
          //obtener tickets
          let prom =$scope.getTicketByBoard();
          prom.then((tickets) => {
            //se usa $apply para que estos datos estén dentro del contexto de angularjs
            $scope.$apply(function(){
              $scope.tickets = tickets;
            });
          })
        },function(err){
          console.log(err);
        });
    }
    //promesa para obtener tickets
    $scope.getTicketByBoard = function(){
      return new Promise((resolve, reject) => {
        $http.get($scope.server+"/tickets/byBoard/"+$scope.selectedBoard.Id)
          .then(function(data){
            //$scope.tickets = data.data;
            resolve(data.data);
          },function(err){
            console.log(err);
          });
      });
    }

    //funcion para agregar tickets en base al usuario y board seleccionado
    $scope.addTicket = function(){
      $scope.date=new Date();
      $http.post($scope.server+"/tickets",{
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
          //ocultar formulario ingreso
          $scope.showIngresar = false;
        },function(err){
          console.log(err);
        });
    }

    //funcion para eliminar ticket
    $scope.deleteTicket = function(id){
      $http.delete($scope.server+"/tickets/"+id)
        .then(function(data){
          //cuando se ejecute actualizar
          $scope.getBoard($scope.selectedUser);
        },function(err){
          console.log(err);
        });
    }

    //funcion para seleccionar ticket y moficarlo
    $scope.modify = function(ticket){
      //seleccionar ticket
      $scope.selectedTicket = ticket;
      //mostrar formulario modificar
      $scope.showModificar = true;
      //obtener relacion con el ticket
      $scope.getTicketRelation(ticket.Id);
    }

    //funcion para modificar ticket seleccionado
    $scope.editTicket = function(){
      //enviar por put los datos del ticket
      $http.put($scope.server+"/tickets/"+$scope.selectedTicket.Id,{
        //ingresar los datos del ticket
        Id: $scope.selectedTicket.Id,
        Title: $scope.selectedTicket.Title,
        Description: $scope.selectedTicket.Description,
        Date: $scope.selectedTicket.Date,
        EstimatedTime: $scope.selectedTicket.EstimatedTime,
        BoardID: $scope.selectedTicket.BoardID,
        StatusName: $scope.selectedTicket.StatusName,
        ColorStatus: $scope.ColorStatus
      })
        .then(function(data){
          //modificar relacion
          $scope.editRelation($scope.selectedTicketRelation);
          //cargar board otra vez
          $scope.getBoard($scope.selectedUser);
          //resetear ticketSeleccionado
          $scope.selectedTicket={};
          //ocultar formulario modificar
          $scope.showModificar = false;
        },function(err){
          console.log(err);
        });
    }

    //obtener relacion por id del ticket
    $scope.getTicketRelation=function(id){
      //llamar api para obtener relacion por id del ticket
      $http.get($scope.server+"/ticketstatus/byticket/"+id)
        .then(function(data){
          $scope.selectedTicketRelation = data.data;
        },function(err){
          console.log(err);
        });
    }

    //guardar relaciones cuando se actualizan
    $scope.editRelation=function(relation){
      relation.Date = new Date();
      $http.put($scope.server+"/ticketstatus/"+relation.Id,{
        Id: relation.Id,
        Date: relation.Date,
        IdTicket : relation.IdTicket,
        idStatus : relation.idStatus
      })
        .then(function(data){
          //cargar board otra vez
          $scope.getBoard($scope.selectedUser);
        },function(err){
          console.log(err);
        });
    }

    //funciones para los filtros
    $scope.filterForStatus = function(){
      //cargar tickets otra vez
      let prom = $scope.getTicketByBoard();
      prom.then(data => {
        $scope.$apply(function(){
          //si es todos simplemente cargarlos todos
          if($scope.filterSelectedStatus == "todos"){
            $scope.tickets = data;
          }else{
            //filtrar tickets por nombre del tipo
            $scope.tickets = data.filter(function(item){
              if (item.StatusName == $scope.filterSelectedStatus){
                return true;
              }
            });
          }

        });
      });
    }

    $scope.filterForDate = function(){
      console.log($scope.filterSelectedDate);
    }

    $scope.resetFilters=function(){
      $scope.filterSelectedStatus = "todos";
    }




  });
