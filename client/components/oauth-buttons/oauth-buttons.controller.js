'use strict';

angular.module('fmBotApp')
  .controller('OauthButtonsCtrl', function($window) {
    this.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
