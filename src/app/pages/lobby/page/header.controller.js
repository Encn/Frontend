(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageHeaderController', LobbyPageHeaderController);

  /** @ngInject */
  function LobbyPageHeaderController($scope, LobbyService) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getLobbySpectated();

    LobbyService.subscribeLobbySpectated($scope, function(){
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });
  }

})();