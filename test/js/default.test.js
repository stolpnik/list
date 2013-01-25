(function() {
  var expect, should;

  mocha.ui('bdd');

  mocha.reporter('html');

  mocha.ignoreLeaks(false);

  should = chai.should();

  expect = chai.expect;

}).call(this);
