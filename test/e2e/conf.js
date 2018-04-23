// An example configuration file.
exports.config = {
  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    browserName: 'chrome'
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  onPrepare: () => {
    /* eslint-disable */
    require('babel-register');
    require('babel-core/register')({ presets: ['es2015'] });
    /* eslint-enable */

    browser.driver.get('http://localhost:3000');

    browser.driver.findElement(by.id('signinBtn')).click();
    browser.driver.findElement(by.id('email')).sendKeys('taiwo@yahoo.com');
    browser.driver.findElement(by.id('password')).sendKeys('1234');
    browser.driver.findElement(by.id('user-sign-in')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(
      () =>
        browser.driver.getCurrentUrl().then(url => /localhost:3000/.test(url)),
      10000
    );
  },

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['onboarding.spec.js'],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
