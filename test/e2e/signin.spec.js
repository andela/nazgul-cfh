/* global browser, expect, by */
describe('Nazgul front-end UI', () => {
  // Initialize required variables
  let authForm, socialFacebook, socialTwitter, socialGoogle, socialGithub,
    emailField, passwordField;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  afterAll(() => {
    browser.get('http://localhost:3001/#!/signup');
  });

  describe('sign in page', () => {
    it('should have a title of "Cards for Humanity - Development"', () => {
      expect(browser.getCurrentUrl()).
      toEqual('http://localhost:3001/#!/signin');
    });

    it('should see social media icons', () => {
      socialFacebook = browser
        .findElement(by.css('.social-btn.facebook-color'));
      socialTwitter = browser.findElement(by.css('.social-btn.twitter-color'));
      socialGoogle = browser.findElement(by.css('.social-btn.google-color'));
      socialGithub = browser.findElement(by.css('.social-btn.github-color'));
      expect(browser.isElementPresent(socialFacebook)).toBe(true);
      expect(browser.isElementPresent(socialTwitter)).toBe(true);
      expect(browser.isElementPresent(socialGoogle)).toBe(true);
      expect(browser.isElementPresent(socialGithub)).toBe(true);
    });

    it('should see a sign in form', () => {
      authForm = browser.findElement(by.css('form.col.s12.animated.fadeIn'));
      emailField = browser.findElement(by.id('email'));
      passwordField = browser.findElement(by.id('password'));
      expect(browser.isElementPresent(authForm));
      expect(browser.isElementPresent(emailField));
      expect(browser.isElementPresent(passwordField));
    });
  });
});
