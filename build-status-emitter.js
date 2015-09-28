'use strict';
var util = require('util');
var EventEmitter = require('events');
var request = require('request');

function checkStatus(jobUrl, callback) {
  request.get({url: jobUrl + '/lastBuild/api/json', json:true}, function(err, response, body){
    if(err) {
      return callback(err);
    }
    //console.log(response);
    if(response.statusCode !== 200) {
      return callback(new Error("Unable to retrieve status code: " + response.statusCode));
    }

    if(body.building) {
      return callback(null, {pending: true});
    }

    return callback(null, {success: body.result === 'SUCCESS'})
  });
}

function BuildStatusEmitter(jobUrl, interval) {
  // Initialize necessary properties from `EventEmitter` in this instance
  EventEmitter.call(this);

  if(!jobUrl) {
    throw Error("`jobUrl` most be specified");
  }
  this.jobUrl = jobUrl;
  this.interval = interval  || 5000;

  var self = this;

  this.intervalId = setInterval(function(){
    checkStatus(self.jobUrl, function(err, status){
      if(err) {
        self.emit('error', err);
        return;
      }
      self.emit('status', status);
    });
  }, this.interval);
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(BuildStatusEmitter, EventEmitter);


module.exports = BuildStatusEmitter
