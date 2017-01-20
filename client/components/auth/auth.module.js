'use strict';

angular.module('fmBotApp.auth', ['fmBotApp.constants', 'fmBotApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
