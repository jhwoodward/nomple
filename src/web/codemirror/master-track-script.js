var CodeMirror = require('./lib/codemirror');
require('./simple.js');
var parsers = require('../../interpreter/parsers');

var parsers = [].concat(parsers.setter).concat(parsers.master);
var trackRegex = parsers.map(p => {
  var parser = new p();
  if (!parser.test) return null;
  return {
    regex: parser.test,
    token: parser.type.toLowerCase(),
    sub: parser.sub,
    subset: parser.subset,
  };
}).filter(p => p !== null)


trackRegex.push({regex: /\(|\)/, token: 'bracket',push:'start'});
trackRegex.push({regex: /\{|\}/, token: 'brace',push:'start'});
trackRegex.push({regex: /( ?)\*( ?)[\d]+/, token: 'loop',push:'start'});

CodeMirror.defineSimpleMode('master-track-script', {
  start: trackRegex,
  // The multi-line comment state.
  comment: [
    {regex: /.*?\*\//, token: "comment", next: "start"},
    {regex: /.*/, token: "comment"}
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "rem"
  }
});
