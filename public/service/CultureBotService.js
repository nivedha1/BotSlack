/**
 * Created by nivedharajaram on 5/13/16.
 */




var cultureBot = angular.module('cultureBot');

cultureBot.service('CultureBotService', function CultureBotService($http) {
   
    var vm = this;
   
    vm.getUsersHelper = getUsersHelper;
    vm.createChannelHelper = createChannelHelper;
    function getUsersHelper() {
        return $http.get('/users').then(function (response) {
            return response.data;
        });
    }
    
    function createChannelHelper(userID) {
        return $http.get('/createChannel?id=' + userID).then(function (response) {
            $http.get('/postMessage?id=' + userID +'&groupID'+ response.message.groupID).then(function (response) {
                
            });
        });
    }
});
