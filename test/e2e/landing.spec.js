describe('Nazgul front-end UI', () => {
  // Initialize required variables
  let root = 'http://localhost:3001/#!/',
    nav, landing, headerBanner, signinBtn, howToPlay,
    menuList, headerDescription, signupBtn, donate,
    section, about, aboutDescription, donateBtn;

  browser.get(root);

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  describe('Landing page call to actions', () => {
    it('should have a title of "Cards for Humanity - Development"', () => {
      expect(browser.getTitle()).toEqual('Cards for Humanity - Development');
    });

    it('should have a navbar with menu list and application name', () => {
      element.all(by.css('.right.hide-on-med-and-down li')).then((items) => {
        expect(items.length - 1).toBe(6);
      });
      nav = browser.findElement(by.id('logo-container'));
      expect(nav.getText()).toContain('CFH');
    });

    it('should be able to see an overview of what the game is about', () => {
      headerBanner = browser.findElement(by.id('index-banner'));
      expect(browser.isElementPresent(headerBanner)).toBe(true);

      headerText = browser.findElement(by.css('.center.header.bottom.white-text.wow.fadeInLeft'));
      headerDescription = browser.findElement(by.css('.header.col.s12.light.white-text.wow.fadeInLeft.center'));
      expect(headerText.getText()).toEqual('Cards for Humanity');
      expect(headerDescription.getText()).toEqual('A game for horrible people desperately trying to do good');
      about = browser.findElement(by.css('h3.center.lighter-pink-text'));
      aboutDescription = browser.findElement(by.css('p.lighter-pink-text'));

      expect(about.getText()).toBe('What is Cards for Humanity?');
      expect(aboutDescription.getText()).toContain('children in need');
    });

    it('should be able to see how it\'s played', () => {
      howToPlay = element.all(by.id('how-to-play')).all(by.tagName('div'));
      howToPlay.then((items) => {
        expect(items.length).toBe(12);
      });
    });

    it('should be able to see how it can be used to donate to charity', () => {
      donate = browser.findElement(by.id('dtc'));
      expect(browser.isElementPresent(donate)).toBe(true);

      donateBtn = element(by.css('a.width50.center.btn-large.custom-btn.dark-pink.darken-1.hvr-pulse-shrink'));
      expect(browser.isElementPresent(donateBtn)).toBe(true);
    });

    it('should be able to see call to action buttons that leads to signup or signin', () => {
      signinBtn = browser.findElement(by.id('signinBtn'));
      signinBtn.click();
      expect(browser.getCurrentUrl()).toBe("http://localhost:3001/#!/signin");
      // browser.get(root);
      // signupBtn = browser.findElement(by.id('signupBtn'));
      // signupBtn.click();
      // expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/signup');
    });
  });
});
