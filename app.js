/**
 * @author Nivedha
 *
 */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config/config.js');

var mongoose = require('mongoose');
mongoose.connect(config.mongo_uri);

var appService = require('./service/Appservice.js');
var modelService = require('./service/ModelService.js');

var app = express();

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
   res.sendFile("index.html", {"root": "public"});
});



app.get('/oauth', function (req, res) {
   console.log("*******"+req.query.code);
   appService.getApiToken(req.query.code);
});

app.listen(process.env.PORT);



app.get('/users', function(req, res){
   appService.getUsers(function(results){
      res.status(results.code).json(results.message);
   });
});

app.get('/createChannel', function(req, res){
   var userID=req.query.id;
   appService.createChannel(userID,function(results) {
      if (results.code == 200) {
         var groupID = results.message;
          appService.inviteUser(groupID, userID, function (results) {
             results.message.groupID=groupID;
             modelService.addActivity(userID+config.channel_name,userID)
             res.status(results.code).json(results.message);
         });
      }
      else {
         res.status(results.code).json(results.message);
      }
   });
   
});

app.get('/postMessage', function(req, res) {
   var userID = req.query.id;
   appService.postMessage(groupID,1,function(results) {
      if (results.code == 200) {
         appService.postMessage(groupID,2,function(results) {
            if (results.code == 200) {
               appService.postMessage(groupID,3,function(results) {
                  res.status(results.code).json(results.message);
               });
            }else {
               res.status(results.code).json(results.message);
            }
         });
      } else {
         res.status(results.code).json(results.message);
      }
   });
});







