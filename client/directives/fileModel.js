angular.module('MyApp')
.directive('fileModel', ['$parse', function($parse){
    
    return{
        
        restrict: 'A',
        link: function(scope, element, attrs){
            
            var model = $parse(attrs.fileModel);
            var modelSitter = model.assign;
            element.bind('change', function(){
            
                    scope.$apply(function(){
                        
                        modelSitter(scope, element[0].files[0]);
                    
                    })
            
            })
            
        }
    
    }

}]);
