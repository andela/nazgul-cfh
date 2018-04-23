/* global browser, expect, element, by, before, */

let chatButton, chatBox, chatInput;

describe('chat layout window', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:3001/#!/app');
  });

  it('should be on the game page', () => {
    expect(browser.getCurrentUrl())
      .toEqual('http://localhost:3001/#!/app');
  });

  it('should have a chat button', () => {
    browser.sleep(10).then(() => {
      chatButton = element(by.id('openChatbox'));
      expect(browser.isElementPresent(chatButton))
        .toBe(true);
    });
  });

  it('should have a chat window', () => {
    browser.sleep(10).then(() => {
      chatBox = element(by.id('chatbox'));
      expect(browser.isElementPresent(chatBox))
        .toBe(true);
    });
  });

  it('should initially be closed', () => {
    browser.sleep(10).then(() => {
      chatBox = element(by.id('chatbox'));
      expect(chatBox.isDisplayed())
        .toBe(false);
    });
  });

  it('should open on click of chat button', () => {
    browser.sleep(10).then(() => {
      chatButton = element(by.id('openChatbox'));
      chatButton.click();
      chatBox = element(by.id('chatbox'));
      expect(chatBox.isDisplayed())
        .toBe(true);
    });
  });

  it('should have input field', () => {
    browser.sleep(100).then(() => {
      chatInput = element(by.id('chat-input'));
      expect(browser.isElementPresent(chatInput))
        .toBe(true);
    });
  });

  it('should be able to see message input div created by emojiarea', () => {
    browser.sleep(100).then(() => {
      chatButton = element(by.id('openChatbox'));
      chatButton.click();
      chatBox = element(by.id('chatbox'));
      expect(chatBox.isDisplayed())
        .toBe(true);
      chatInput = element(by.css('.emojionearea-editor'));
      expect(chatInput.isDisplayed())
        .toBe(true);
    });
  });
});
