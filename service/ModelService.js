/**
 * @author Nivedha
 *
 */
var mongoose = require('mongoose');
var util = require('../util');
var Schema = mongoose.Schema;

var db = mongoose.connection;

var activitySchema = new Schema({
    episodeID:  String,
    botID: String,
    userID: String
});

var Activity = mongoose.model('Activity', activitySchema);

function addActivity(callback) {
    var activity = new Activity({episodeID: 'Rover', botID: 'dog' ,userID : ''});
    activity.save(function (err,response) {
        callback(util.processResponse(err,response));
    });
}

module.exports = {
    addActivity:addActivity
};