var slackClient =  require('@slack/client');
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var slackEvents = slackClient.CLIENT_EVENTS.RTM;
var rtmEvents = slackClient.RTM_EVENTS;
var util = require('./../util.js');
var config = require('./../config/config.js');
var request = require('request');
var rtmClient='';
var webClient = '';


function getApiToken(code){
    request.get(config.base_url+'/api/oauth.access?'+'code='+code +'&client_secret='+config.client_secret,
        function(err,response){
           if(!err && response){
               process.env.SLACK_TOKEN = reponse.access_token;
           } else {
               console.log("Error accessing token:" + error);
           }
        });
}
function connectClient() {
    rtmClient = new slackClient.RtmClient(process.env.SLACK_TOKEN, {
        autoReconnect: true,
        autoMark: true,
        dataStore: new MemoryDataStore()
    });
    webClient = new slackClient.WebClient(process.env.SLACK_TOKEN);
    rtmClient.start();
    if (!getChannelByName)
        webClient.channels.create(config.channel_name);
    rtmClient.on(slackEvents.RTM_CONNECTION_OPENED, function slackClientOpened() {
        rtmClient.on(rtmEvents.MESSAGE, function (message) {
            if (message.text === config.message_text && message.channel.indexOf(config.channel_name)) {
                webClient.channels.invite(getChannelByName(), message.user);
            }
        });
    });
}
/**
 * 
 * This method is responsible for getting user info
 * @param   {function}    callback    result from endpoint processing if any
 * @param   {function}    calback     http response object
 */
function getUsers(callback)
{
     webClient.users.list({}, function getUsersList(err, response) {
            response.members.splice(response.members.length - 1);
         return   callback( util.processResponse(err,response.members));
    });
}

function createChannel(userID,callback) {
    webClient.groups.create(userID+config.channel_name, function onCreateGroup(err, response) {
        if(response.group)
            response=response.group.id;
        return callback(util.processResponse(err,response));
    });
}

function inviteUser(groupID, userID, callback) {
    webClient.groups.invite(groupID, userID, function onInviteUser(err, response)
    {
        return callback(util.processResponse(err,response));
    });
}

function postMessage(groupID, imageno, callback){
    var data = {
        as_user: true,
        attachments: '[{\"title\": \"'+config.conversation_text+'\", \"image_url\": \"'+config.s3_image_url+imageno+'.png\"}]'
    };
    webClient.chat.postMessage(groupID,config.conversation_text+imageno+':',data , function onMessagePosted(err, response)
    {
        return callback(util.processResponse(err,response));
    });

}

function getAdminUserId(users)
{
    array.forEach(function(item){
        if(item.is_admin==true)
            return item.id;
    })
}

function getChannelByName(){
    return rtmClient.dataStore.getChannelByName(config.channel_name)
}

module.exports = {
    getApiToken:getApiToken,
    connectClient:connectClient,
    getUsers:getUsers,
    createChannel:createChannel,
    inviteUser:inviteUser,
    getAdminUserId:getAdminUserId,
    postMessage:postMessage,
    getChannelByName:getChannelByName
};