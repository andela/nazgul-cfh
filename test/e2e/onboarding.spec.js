/* global expect */

import { browser, element, by } from 'protractor';

describe('Protractor test for onboarding user', () => {
  it('Bubble start when in gaming page', () => {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:3000/#!/app');
    browser.sleep(3000).then(() => {
      element(by.css('.hopscotch-content'))
        .getText()
        .then((text) => {
          expect(text).toEqual('Welcome to Card for Humanity Game Screen!\nHere is a quick tour to get you started.');
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
          expect(text).toEqual('This is the user’s pane. It contains the player’s name and score for this gaming session.');
        });
    });

    // check the next page
    element(by.css('.hopscotch-next')).click();
    browser.sleep(1000).then(() => {
      element(by.css('.hopscotch-content'))
        .getText()
        .then((text) => {
          expect(text).toEqual('You can click on Start Game here when more than two players have joined the game.');
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
