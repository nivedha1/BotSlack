/**
 * @author Nivedha
 *
 */
var cultureBot = angular.module("cultureBot", []);

cultureBot.controller("CultureBotController", function(
  $window,
  CultureBotService
) {
  var vm = this;
  vm.init = init;
  vm.createChannel = createChannel;
  vm.newState = true;
  var client_id = "43312503717.43263993571";
  var scopes =
    "users:read,groups:read,groups:write,chat:write:bot,channels:write,channels:read,bot,admin";
  var base_url = "https://slack.com";
  vm.hrefInit =
    base_url + "/oauth/authorize?scope=" + scopes + "&client_id=" + client_id;
  function init() {
    vm.newState = false;
    $window.open("index.html", "_blank");
    CultureBotService.getUsersHelper().then(function(data) {
      vm.users = data;
    });
  }

  function createChannel(userID) {
    CultureBotService.createChannelHelper(userID).then(function(data) {
      console.log(data);
    });
  }
});
