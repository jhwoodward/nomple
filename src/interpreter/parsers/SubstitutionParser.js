var _ = require('lodash');
var parser = require('./_parser');
var macroType = require('../constants').macroType;

function SubstitutionParser(macros) {
  this.type = 'Substitution';
  this.test = /^\(\w+\)/;
  this.substitutions = {};
  if (macros) {
    this.substitutions = macros.reduce(function (acc, item) {
      if (item.type === macroType.substitution) { 
        acc[item.key] = item; 
      }
      return acc;
    }, {});
  }
}

var prototype = {
  parse: function (s) {
    var key = /\w+/.exec(s)[0];
    if (this.substitutions[key]) {
      return key;
    }
  },
  mutateState: function (state, interpreter) {
    var part = this.substitutions[this.parsed];
    interpreter.generateState(part.parsed);
  },
  continue: true
}

SubstitutionParser.prototype = _.extend({}, parser, prototype);
module.exports = SubstitutionParser;