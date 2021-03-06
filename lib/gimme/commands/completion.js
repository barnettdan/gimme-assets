
var tabtab = require('tabtab'),
  commands = require('../../../').commands,
  known = Object.keys(commands);

module.exports = completion;

completion.usage = 'gimme completion';
completion.description = ['completion', 'Setup tab completion'];

completion.complete = function(o, cb) {
  if(+o.words !== 2) return cb(null, []);

  cb(null, ['install', 'uninstall']);
};

function completion(opts, cb) {
  var app = this;

  if(process.platform === 'win32') return cb(new Error('Too bad.. completion not supported on windows'));

  tabtab.complete('gimme', function(err, o) {
    if(err) return cb(err);
    if(!o) return;

    var words = +o.words,
      hits = o.line.split(' ').slice(1),
      command = hits[0],
      rOption = /^--?/;

    // todo: tabtab should return numbers, tweak this once done
    if(words === 1) return tabtab.log(known, o);

    if(words >= 2 && commands[command]) {
      commands[command].complete.call(app, o, function(err, results) {
        if(err) return cb(err);

        results = Array.isArray(results) ? results : [results];

        results.forEach(function(res) {
          var option = (res.match(rOption) || [])[0],
            val = res.replace(rOption, '');
          tabtab.log([val], o, option);
        });
        return cb();
      });
   }
  });
}


