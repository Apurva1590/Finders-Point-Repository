angular.module('MyApp', ['ngResource', 'ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'satellizer'])
  .config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'partials/home.html'
      })
    .state('trail', {
        url: '/trail',
       // controller: 'HomeCtrl',
        templateUrl: 'partials/trail.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
    .state('contactlist', {
        url: '/contactlist',
        templateUrl: 'partials/contactlist.html',
        controller: 'ContactlistCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
    .state('details', {
        url: '/details/:id',
        templateUrl: 'partials/details.html',
        controller: 'DetailCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
     .state('professional', {
        url: '/professional',
        templateUrl: 'partials/professional.html',
        controller: 'ProfessionalCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
    .state('imagesubmit', {
        url: '/imagesubmit',
        templateUrl: 'partials/imagesubmit.html',
        controller: 'ImageSubmitCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
    .state('professionalslist', {
        url: '/professionalslist',
        templateUrl: 'partials/professionalslist.html',
        
        resolve: {
          loginRequired: loginRequired
        }
      })
     .state('about-us', {
        url: '/about-us',
        templateUrl: 'partials/about-us.html',
        
        resolve: {
          loginRequired: loginRequired
        }
      })
     .state('contact-us', {
        url: '/contact-us',
        templateUrl: 'partials/contact-us.html',
        
        resolve: {
          loginRequired: loginRequired
        }
      });
   

    
    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '657854390977827'
    });

    $authProvider.google({
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });

    $authProvider.github({
      clientId: '0ba2600b1dbdb756688b'
    });

    $authProvider.linkedin({
      clientId: '77cw786yignpzj'
    });

    $authProvider.instagram({
      clientId: '799d1f8ea0e44ac8b70e7f18fcacedd1'
    });

    $authProvider.yahoo({
      clientId: 'dj0yJmk9SDVkM2RhNWJSc2ZBJmQ9WVdrOWIzVlFRMWxzTXpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yYw--'
    });

    $authProvider.twitter({
      url: '/auth/twitter'
    });

    $authProvider.live({
      clientId: '000000004C12E68D'
    });

    $authProvider.twitch({
      clientId: 'qhc3lft06xipnmndydcr3wau939a20z'
    });

    $authProvider.bitbucket({
      clientId: '48UepjQDYaZFuMWaDj'
    });

    $authProvider.oauth2({
      name: 'foursquare',
      url: '/auth/foursquare',
      clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
      authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
    });

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
  });


