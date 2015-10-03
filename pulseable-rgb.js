'use strict';

var five  = require('johnny-five');
var _ = require("lodash");

function PulseableRGB(opts) {
  if (!(this instanceof PulseableRGB)) {
    return new PulseableRGB(opts);
  }

  five.Led.RGB.call(this, opts);
}

PulseableRGB.prototype = _.create(five.Led.RGB.prototype, {
  'constructor': PulseableRGB
});

PulseableRGB.prototype[five.Animation.normalize] = function(keyFrames) {
  var last = this.intensity() || 0;

  // If user passes null as the first element in keyFrames use current value
  if (keyFrames[0] === null) {
    keyFrames[0] = {
      value: last
    };
  }

  keyFrames.forEach(function(keyFrame, i) {

    if (keyFrame !== null) {
      // keyFrames that are just numbers represent values
      if (typeof keyFrame === "number") {
        keyFrames[i] = {
          value: keyFrame,
          easing: "linear"
        };
      }
    }

  });

  return keyFrames;

};

PulseableRGB.prototype[five.Animation.render] = function(position) {
  this.intensity(position[0]);
};

PulseableRGB.prototype.pulse = function(rate, max) {
  var options = {
    duration: typeof rate === "number" ? rate : 1000,
    keyFrames: [0, max || 100],
    metronomic: true,
    loop: true,
    easing: "inOutSine"
  };

  if (typeof rate === "object") {
    _.extend(options, rate);
  }

  this.animation = this.animation || new five.Animation(this);
  this.animation.enqueue(options);
  return this;
};

PulseableRGB.prototype.stop = function() {
  if (this.animation) {
    this.animation.stop();
  }

  return this;
};

module.exports = PulseableRGB;
