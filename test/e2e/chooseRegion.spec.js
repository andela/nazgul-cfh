/* global element browser, expect, by */

describe('Choose Region before playing', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false);
  });

  let chooseRegion,
    playGameWithFriends,
    playGameWithStrangers,
    email,
    submit,
    goToGame,
    regionId,
    africa,
    asia,
    password;

  describe('SignIn to play with friends or strangers', () => {
    it('should display buttons to play with friends or strangers', () => {
      const root = 'http://localhost:3001/#!/signin';
      browser.get(root);
      browser.sleep(1000).then(() => {
        email = browser.findElement(by.id('email'));
        password = element(by.id('password'));
        submit = element(by.id('sign-up-btn-other'));
        email.sendKeys('user@user.com');
        password.sendKeys('userpassword');
        submit.click();
        browser.sleep(2000).then(() => {
          playGameWithFriends = element(by.id('play-game-with-friends'));
          playGameWithStrangers = element(by.id('play-game-with-strangers'));
          expect(browser.isElementPresent(playGameWithFriends)).toBe(true);
          expect(playGameWithFriends.isDisplayed()).toBe(true);
          expect(browser.isElementPresent(playGameWithStrangers)).toBe(true);
          expect(playGameWithStrangers.isDisplayed()).toBe(true);
        });
      });
    });

    it('should display modal to choose region', () => {
      playGameWithStrangers.click();
      browser.sleep(1000).then(() => {
        chooseRegion = element(by.id('region'));
        expect(browser.isElementPresent(chooseRegion)).toBe(true);
        expect(chooseRegion.isDisplayed()).toBe(true);
      });
    });

    it('should have select fields for regions asia and africa', () => {
      regionId = element(by.id('regionId'));
      africa = element(by.id('africa'));
      asia = element(by.id('asia'));
      expect(browser.isElementPresent(regionId)).toBe(true);
      expect(browser.isElementPresent(africa)).toBe(true);
      expect(africa.isDisplayed()).toBe(false);
      expect(browser.isElementPresent(asia)).toBe(true);
      expect(asia.isDisplayed()).toBe(false);
      goToGame = element(by.id('go-to-game'));
      expect(goToGame.isDisplayed()).toBe(true);
      goToGame.click();
    });

    it('should start game with region africa', () => {
      browser.sleep(1000).then(() => {
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/#!/app?custom=false&region=africa');
      });
    });
  });
});
