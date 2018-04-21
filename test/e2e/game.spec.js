/* global browser, expect, element, by */

describe('UI Test:', () => {
  const appRoot = 'http://localhost:3001/#!/app'
  || 'http://localhost:3000/#!/app';

  let nav,timer;

  browser.get(appRoot);
  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  describe('Gaming Screen Page', () => {
    it('should have a title of "Cards for Humanity - Development"', () => {
      expect(browser.getCurrentUrl())
        .toEqual('http://localhost:3001/#!/app');
    });

    it('should have a navbar with menu list and application name', () => {
      element.all(by.css('.right.hide-on-med-and-down li'))
        .then((items) => {
          expect(items.length - 1)
            .toBe(2);
        });

      nav = browser.findElement(by.id('logo-container'));
      expect(nav.getText())
        .toContain('CFH');
    });

    it('should have timer component', () => {
      timer = element(by.css('card-panel')).element(by.id('time'));
      console.log('time', timer);
      expect(browser.isElementPresent(timer)).toBe(true);
    });
  });
});
