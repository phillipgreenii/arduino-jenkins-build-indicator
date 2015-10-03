'use strict';

var five  = require('johnny-five'),
    board = new five.Board({repl: false});

process.on('message', update);

var black = "000000";
var red = "FF0000";
var yellow = "FFCC00";
var green = "00FF00";

var rgb, piezo, previousState;

var BUILD_STATE_SUCCESS = "SUCCESS";
var BUILD_STATE_FAILURE = "FAILURE";

function update(status) {
  if(rgb) {
    if(!status) {
      rgb.color(black);
      return;
    }

    if(status.pending) {
      rgb.color(yellow);
      rgb.pulse(3000);
    } else if(status.success) {
      rgb.stop().intensity(25).on();
      rgb.color(green);
      if(previousState !== BUILD_STATE_SUCCESS) {
        previousState = BUILD_STATE_SUCCESS;
        piezo.play({song: " - - C4 C4 - - C4 - C4 - G4 G4 G4 G4 ", beats: 1 / 8,tempo: 100});
      }
    } else {
      rgb.stop().intensity(25).on();
      rgb.color(red);
      if(previousState !== BUILD_STATE_FAILURE) {
        previousState = BUILD_STATE_FAILURE;
        piezo.play({song: " - - E5 - C5 - C5 C5 C5 C5 - - A4 - A4 A4 A4 A4 A4 A4 - - ", beats: 1 / 8,tempo: 60});
      }
    }
  }
}

board.on('ready', function(){
  piezo = new five.Piezo(9);

  rgb = new require('./pulseable-rgb')({
    pins: {
      red: 3,
      green: 5,
      blue: 6
    },
    isAnode: true
  })

  rgb.off();
  rgb.color(black);
  rgb.intensity(25);

  process.send('initialize');

  if(this.repl) {
    this.repl.inject({
      rgb:rgb,
      buzzer: piezo
    });
  }
});

module.exports = update;
