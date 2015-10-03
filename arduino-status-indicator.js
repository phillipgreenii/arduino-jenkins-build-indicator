'use strict';

var cp = require('child_process');
var usbDetect = require('usb-detection');

var WCH_CN_VENDOR_ID = 6790;
var WCH_CN_PRODUCT_ID = 29987;


usbDetect.on(['add',WCH_CN_VENDOR_ID, WCH_CN_PRODUCT_ID].join(":"), function(device) { startArduinoCommunication(); });
usbDetect.on(['remove',WCH_CN_VENDOR_ID, WCH_CN_PRODUCT_ID].join(":"), function(device) { stopArduinoCommunication(); });
usbDetect.find(WCH_CN_VENDOR_ID, WCH_CN_PRODUCT_ID, function(err, devices) { if(devices.length > 0){startArduinoCommunication();} });


var arduinoCommunicationChannel;
function startArduinoCommunication() {
  arduinoCommunicationChannel = cp.fork(__dirname + '/arduino-status-indicator-channel');
  arduinoCommunicationChannel.once('exit', function(){
    arduinoCommunicationChannel = null;
  });
  //this is emitted as soon as the child is up and running to initialize the arduino
  arduinoCommunicationChannel.once('message', function(){
    if(lastStatus) {
      displayStatus(lastStatus);
    }
  });
}

function stopArduinoCommunication() {
  if(arduinoCommunicationChannel) {
    arduinoCommunicationChannel.kill();
  }
}

var lastStatus = null;

function handleError(error) {
  lastStatus = null;
  if(arduinoCommunicationChannel) {
    arduinoCommunicationChannel.send(null);
  }
}

function displayStatus(status) {
  lastStatus = status;
  if(arduinoCommunicationChannel) {
    arduinoCommunicationChannel.send(status);
  }
}

module.exports = {handleError: handleError, displayStatus: displayStatus};
