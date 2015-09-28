var BuildStatusEmitter = require('./build-status-emitter');
var arduinoStatusIndicator = require('./arduino-status-indicator');

var buildStatusEmitter = new BuildStatusEmitter('http://localhost/jenkins/job/BuildProj/', 5000);

buildStatusEmitter.on('error', function(error){
  console.error("Unable to determine build status", error);
  arduinoStatusIndicator.handleError(error);
});

buildStatusEmitter.on('status', function(status){
  arduinoStatusIndicator.displayStatus(status);
});
