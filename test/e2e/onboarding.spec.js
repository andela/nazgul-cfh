/* global browser, expect, element, by */


describe('Protractor test for onboarding user', () => {
  it('Bubble start when in gaming page', () => {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:3000/#!/app');
    browser.sleep(1000).then(() => {
      element(by.css('.hopscotch-content'))
        .getText()
        .then((text) => {
          expect(text).toEqual('Card for Humanity is a an online version of popular card game, Card Against Humanity. That gives you the opportunity to donate to children in need.');
        });
    });
  });

  it('Tour should be navigable', () => {
    // check the next page
    element(by.css('.hopscotch-next')).click();
    browser.sleep(1000).then(() => {
      element(by.css('.hopscotch-content'))
        .getText()
        .then((text) => {
          expect(text).toEqual('Each player begin with 10 white answer cards Everyone else answers the black question card by clicking on the answer.');
        });
    });

    // check the next page
    element(by.css('.hopscotch-next')).click();
    browser.sleep(1000).then(() => {
      element(by.css('.hopscotch-content'))
        .getText()
        .then((text) => {
          expect(text).toEqual('The players in the game and their scores appear here');
        });
    });
  });

  it('should not automatically show tour after user has taken initial test', () => {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:3000/#!/app');

    browser.sleep(1000).then(() => {
      expect(element(by.css('.hopscotch-content')).isPresent()).toBe(false);
    });
  });

  it('should show tour when user click tour button', () => {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:3000/#!/app');
    element(by.css('.taketour')).click();

    browser.sleep(1000).then(() => {
      expect(element(by.css('.hopscotch-content')).isPresent()).toBe(true);
    });
  });
});
