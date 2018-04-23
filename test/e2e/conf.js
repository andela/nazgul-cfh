/* global */
exports.config = {
  directConnect: true,
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
  },
  framework: 'jasmine',
  // seleniumAddress: 'http://localhost:4444/wd/hub',

  onPrepare: () => {
    /* eslint-disable */
    require('babel-register');
    require('babel-core/register')({ presets: ['es2015'] });
    /* eslint-enable */

    browser.driver.get('http://localhost:3001');

    browser.driver.findElement(by.id('signinBtn')).click();
    browser.driver.findElement(by.id('email')).sendKeys('idrees.ibraheem@andela.com');
    browser.driver.findElement(by.id('password')).sendKeys('11111111');
    browser.driver.findElement(by.id('sign-up-btn-other')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(
      () =>
        browser.driver.getCurrentUrl().then(url => /localhost:3001/.test(url)),
      10000
    );
  },

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

// /* global browser by */
// exports.config = {
//   // directConnect: true,
//   capabilities: {
//     browserName: 'chrome'
//   },
//   framework: 'jasmine',
//   seleniumAddress: 'http://localhost:4444/wd/hub',
//   specs: [
//     'testfile.spec.js',
//     'signin.spec.js',
//     'signup.spec.js'
//   ],

//   // Options to be passed to Jasmine.
//   jasmineNodeOpts: {
//     defaultTimeoutInterval: 30000
//   }
// };
