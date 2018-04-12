describe('Nazgul front-end UI', () => {
  // Initialize required variables
  let authForm, socialFacebook, socialTwitter, socialGoogle, socialGithub,
    fullname, username, email, password;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  describe('sign up page', () => {
    it('should have a title of "Cards for Humanity - Development"', () => {
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/#!/signup');
    });

    it('should see social media icons', () => {
      socialFacebook = browser.findElement(by.css('.social-btn.facebook-color'));
      socialTwitter = browser.findElement(by.css('.social-btn.twitter-color'));
      socialGoogle = browser.findElement(by.css('.social-btn.google-color'));
      socialGithub = browser.findElement(by.css('.social-btn.github-color'));
      expect(browser.isElementPresent(socialFacebook)).toBe(true);
      expect(browser.isElementPresent(socialTwitter)).toBe(true);
      expect(browser.isElementPresent(socialGoogle)).toBe(true);
      expect(browser.isElementPresent(socialGithub)).toBe(true);
    });

    it('should see a sign up form', () => {
      authForm = browser.findElement(by.css('form.col.s12.animated.fadeIn'));
      fullname = browser.findElement(by.id('fullname'));
      username = browser.findElement(by.id('username'));
      email = browser.findElement(by.id('email'));
      password = browser.findElement(by.id('password'));
      expect(browser.isElementPresent(authForm));
      expect(browser.isElementPresent(fullname));
      expect(browser.isElementPresent(email));
      expect(browser.isElementPresent(authForm));
      expect(browser.isElementPresent(password));
    });
  });
});
