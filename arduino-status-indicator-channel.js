'use strict';

var five  = require('johnny-five'),
    board = new five.Board({repl: false});

process.on('message', update);

var black = "000000";
var red = "FF0000";
var yellow = "FF6600";
var green = "00FF00";

var rgb;

function update(status) {
  if(rgb) {
    if(!status) {
      rgb.color(black);
      return;
    }

    if(status.pending) {
      rgb.color(yellow);
    } else if(status.success) {
      rgb.color(green);
    } else {
      rgb.color(red);
    }
  }
}

board.on('ready', function(){

  rgb = new five.Led.RGB({
    pins: {
      red: 3,
      green: 5,
      blue: 6
    },
    isAnode: true
  })

  // this.repl.inject({
  //   rgb:rgb
  // });
  rgb.off();
  rgb.color(black);
  rgb.intensity(25);

});

module.exports = update;
