/* global */
exports.config = {
  directConnect: true,
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
  },
  framework: 'jasmine',
  // onPrepare: () => {
  //   /* eslint-disable */
  //   require('babel-register');
  //   require('babel-core/register')({ presets: ['es2015'] });
  //   /* eslint-enable */

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: [
    'landing.spec.js',
    'signin.spec.js',
    'signup.spec.js',
    'game.spec.js',
    'onboarding.spec.js'
  ],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
