var _ = require('lodash');
var eventType = require('./constants').eventType;
var stateUtils = require('./stateUtils');

function State(defaultPhraseParser) {

  var state = {
    modifiers: [],
    key: {
      flats: [],
      sharps: []
    },
    scale: {
      name: '',
      chordConstraint: [],
      scaleConstraint: [],
      scalePitches: []
    },
    pitch: {
      octave: 5,
      relativeStep: 1,
      transpose: 0
    },
    on: {},
    off: {},
    controller: {},
    pitchbend: undefined,
    velocity: 85,
    keyswitch: undefined,
    articulations: [],
    animation: undefined,
    time: {
      tempo: 120,
      tick: 48, //start at beat 1 (also enables keyswitch events to kick in prior to first beat)
      step: 48
    }
  };

  _.merge(this, state);
  this.mutate(defaultPhraseParser || stateUtils.getDefaultPhraseParser()); 

}

State.prototype.clone = function () {
  var clone = _.cloneDeep(this);
  clone.mutater = undefined;
  clone.articulations = [];
  delete clone.articulation;
  delete clone.animation;
  delete clone.marker;
  delete clone.bassline;
  return clone;
}

State.prototype.mutate = function (parser, interpreter) {

  if (interpreter) {
    interpreter.master.states.forEach(function (s) {
      if (s.tick <= this.time.tick && !s.applied) {
        _.merge(this, s.state);
        s.applied = true;
      }
    }.bind(this));
  }

  this.parser = parser;
  parser.mutateState(this, interpreter);
  this.mutater = parser.type + ' (' + parser.string + ')';
}

module.exports = State;
