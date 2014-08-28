/**
 * Module dependencies.
 */

var stylus = require('stylus');
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var glob = require('glob');
var CSScomb = require('csscomb');
var JoinSimilarRules = require('csscomb-join-similar-rules');
var whatToTest = process.env.npm_package_config_whatToTest || '**';
var comb = new CSScomb().use(JoinSimilarRules);
comb.configure(require('./.csscomb.json'));

// test cases

var Testyle = function(config) {
  var prefix = config && config.prefix || ''; // like `lib/*/`
  var postfix = config && config.postfix || ''; // like `tests/`
  var stylusBefore = config && config.stylusBefore || ''; // like `@require "index.styl";`
  
  var require = config && config.require || ''; // like `'./lib/index.styl'`
  if (require instanceof Array) {
    require = require.join('"\n@require "');
  }
  if (require !== '') {
    require = '\n@require "' + require + '"\n';
  }

  glob.sync(prefix + whatToTest + postfix + "*.styl").forEach(function(test){
    var name = test.replace(/\.?[\/]/g, ' ').replace(' tests',':').replace('.styl','');

    it(name, function(){
      var css = fs.readFileSync(test.replace('.styl', '.css'), 'utf8').replace(/\r/g, '').trim();
      var style = stylus(stylusBefore + require + '@require "' + test + '"');

      style.render(function(err, actual){
        if (err) throw err;
        actual = autoprefixer.process(actual).css;
        actual = comb.processString(actual);

        actual.trim().should.equal(css);
      });
    })
  });

};

module.exports = Testyle;
