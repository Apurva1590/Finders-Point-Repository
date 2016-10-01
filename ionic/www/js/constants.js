angular.module('FP.constants', [])
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
    url: 'http://localhost:3000'
 // old  url: 'http://127.0.0.1:8100'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
  // use this to run on mobile, check your ip-addressand update it  url: 'http://192.168.0.55:8080/api'
});