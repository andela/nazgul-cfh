exports.config = {
  directConnect: true,
  capabilities: {
    browserName: 'chrome'
  },
  framework: 'jasmine',
  specs: ['onboarding.spec.js'],

  onPrepare: () => {
    require('babel-register');
    require('babel-core/register')({ presets: ['es2015'] });

    browser.driver.get('http://localhost:3000');
    /* Sign up
    browser.driver.findElement(by.id('sign-up-btn-landing')).click();
    browser.driver.findElement(by.id('name')).sendKeys('Taiwo');
    browser.driver.findElement(by.id('email')).sendKeys('taiwo@yahoo.com');
    browser.driver.findElement(by.id('password')).sendKeys('1234');
    browser.driver.findElement(by.id('sign-up-btn-other')).click();
    */

    browser.driver.findElement(by.id('signin')).click();
    browser.driver.findElement(by.id('email')).sendKeys('taiwo@yahoo.com');
    browser.driver.findElement(by.id('password')).sendKeys('1234');
    browser.driver.findElement(by.id('sign-up-btn-other')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(
      () =>
        browser.driver.getCurrentUrl().then(url => /localhost:3000/.test(url)),
      10000
    );
  },

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
