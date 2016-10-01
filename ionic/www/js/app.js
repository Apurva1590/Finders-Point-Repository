// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('FP', ['ionic', 'ui.router', 'FP.controllers', 'FP.routes', 'FP.directives','FP.services', 'FP.constants'])

//  .config(function ($stateProvider, $urlRouterProvider) {
//    $stateProvider
//      .state('app', {       
//        abstract: true,
//        templateUrl: 'templates/menu.html',
//        controller: 'AppCtrl'
//      })
//    .state('app.home', {
//        url: '/',
//        views: {
//            menuContent: {    
//            templateUrl: 'templates/home.html',
//            controller: 'HomeCtrl'
//            }
//        }
//      })
//      .state('app.login', {
//        url: '/login',
//        views: {
//          'menuContent': {
//            templateUrl: 'templates/login.html',
//            controller: 'LoginCtrl'
//          }
//        }
//      })
//    .state('app.register', {
//    url: '/register',
//        views: {
//            'menuContent': {
//                templateUrl: 'templates/register.html',
//                controller: 'RegisterCtrl'
//                            }
//                }
//  })
//  .state('profile', {
//    url: '/profile',         
//    templateUrl: 'templates/profile.html',
//    controller: 'ProfileCtrl'                     
//    })
//    .state('contactlist', {
//    url: '/contactlist',          
//    templateUrl: 'templates/contactlist.html',
//    controller: 'ContactCtrl'
//    })
//    .state('professional', {
//    url: '/professional',          
//    templateUrl: 'templates/professional.html',
//    controller: 'ProfessionalCtrl'
//    })
//     .state('professionalslist', {
//    url: '/professionalslist',          
//    templateUrl: 'templates/professionalslist.html',
//    controller: 'ProfessionalCtrl'
//  })
//.state('details', {
//    url: '/professionalslist/:id',          
//    templateUrl: 'templates/details.html',
//    controller: 'DetailCtrl'
//  });
//
//    $urlRouterProvider.otherwise('/');
//    
//    
//    
//    function skipIfLoggedIn($q, $auth) {
//      var deferred = $q.defer();
//      if ($auth.isAuthenticated()) {
//        deferred.reject();
//      } else {
//        deferred.resolve();
//      }
//      return deferred.promise;
//    }
//
//    function loginRequired($q, $location, $auth) {
//      var deferred = $q.defer();
//      if ($auth.isAuthenticated()) {
//        deferred.resolve();
//      } else {
//        $location.path('/login');
//      }
//      return deferred.promise;
//    }
//    
//    
//  })






//  .config(function($authProvider) {
//    var commonConfig = {
//      popupOptions: {
//        location: 'no',
//        toolbar: 'yes',
//        width: window.screen.width,
//        height: window.screen.height
//      }
//    };
//
//    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
//      commonConfig.redirectUri = 'http://localhost/';
//    }
//
//    $authProvider.facebook(angular.extend({}, commonConfig, {
//      clientId: '603122136500203',
//      url: 'http://localhost:3000/auth/facebook'
//    }));
//
//    $authProvider.twitter(angular.extend({}, commonConfig, {
//      url: 'http://localhost:3000/auth/twitter'
//    }));
//
//    $authProvider.google(angular.extend({}, commonConfig, {
//      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com',
//      url: 'http://localhost:3000/auth/google'
//    }));
//  })
  .run(function ($ionicPlatform, $rootScope, $state, AuthService, AUTH_EVENTS) {
    $ionicPlatform.ready(function () {
     if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
    
    
//    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
//    if (!AuthService.isAuthenticated()) {
//         console.log("in app run function");
//      console.log(next.name);
//      if (next.name !== 'app.login' && next.name !== 'app.register') {
//        event.preventDefault();
//        $state.go('app.login');
//      }
//    }
//  });
    
    
  })
