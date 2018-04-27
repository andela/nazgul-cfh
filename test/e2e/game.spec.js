/* global browser, expect, element, by, before, */

let timerCount,
  timerdesc,
  questSect,
  startGameBtn,
  endGameInfo,
  showAnsCards,
  showHowToPlay,
  showCzar,
  showCharityWidget,
  gameEndInfo,
  showScoreboard,
  showCurrentPlayer,
  showCzarMarker;

describe('Gaming Screen Page', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:3001/#!/app');
  });

  it('should have a title of "Cards for Humanity - Development"', () => {
    expect(browser.getCurrentUrl())
      .toEqual('http://localhost:3001/#!/app');
  });

  it('should have a game section"', () => {
    browser.sleep(10).then(() => {
      expect(browser.isElementPresent(by.id('gameplay-container'))).toBe(true);
    });
  });

  it('should have a timer countdown"', () => {
    browser.sleep(10).then(() => {
      timerCount = element(by.id('time'));
      expect(browser.isElementPresent(timerCount)).toBe(true);
    });
  });

  it('should have a timer description"', () => {
    browser.sleep(10).then(() => {
      timerdesc = element(by.css('.timedesc'));
      expect(browser.isElementPresent(timerdesc))
        .toBe(true);
    });
  });

  it('should have question section"', () => {
    browser.sleep(10).then(() => {
      questSect = element(by.id('quest-ion'));
      expect(browser.isElementPresent(questSect)).toBe(true);
    });
  });

  it('should have a section that shows start game button"', () => {
    browser.sleep(10).then(() => {
      startGameBtn = element(by.css('[ng-click="startGame()"]'));
      expect(browser.isElementPresent(startGameBtn))
        .toBe(true);
    });
  });

  it('should have an information section when a game ends"', () => {
    browser.sleep(10).then(() => {
      endGameInfo = element(by.id('game-end-info'));
      expect(browser.isElementPresent(endGameInfo))
        .toBe(true);
    });
  });

  it('should have an information section when a game ends"', () => {
    browser.sleep(10).then(() => {
      endGameInfo = element(by.id('game-end-info'));
      expect(browser.isElementPresent(endGameInfo))
        .toBe(true);
    });
  });

  it('should show the Czar"', () => {
    browser.sleep(10).then(() => {
      showCzar = element(by.id('czar-blank-container'));
      expect(browser.isElementPresent(showCzar))
        .toBe(true);
    });
  });

  it('should show "How To Play" section"', () => {
    browser.sleep(10).then(() => {
      showHowToPlay = element(by.id('info-container'));
      expect(browser.isElementPresent(showHowToPlay))
        .toBe(true);
    });
  });

  it('should show "" section"', () => {
    browser.sleep(10).then(() => {
      gameEndInfo = element(by.id('game-end-container'));
      expect(browser.isElementPresent(gameEndInfo))
        .toBe(true);
    });
  });

  it('should show charity widget"', () => {
    browser.sleep(10).then(() => {
      showCharityWidget = element(by.id('charity-widget-container'));
      expect(browser.isElementPresent(showCharityWidget))
        .toBe(true);
    });
  });

  it('should have a section that shows the answers"', () => {
    browser.sleep(10).then(() => {
      showAnsCards = element(by.css('.row.par.hand'));
      expect(browser.isElementPresent(showAnsCards))
        .toBe(true);
    });
  });

  it('should show the scoreboard for all players"', () => {
    browser.sleep(10).then(() => {
      showScoreboard = element(by.id('social-bar-container'));
      expect(browser.isElementPresent(showScoreboard))
        .toBe(true);
    });
  });

  it('should put a marker on the current player"', () => {
    browser.sleep(10).then(() => {
      showCurrentPlayer = element(by.css('.avatar-name'));
      expect(browser.isElementPresent(showCurrentPlayer))
        .toBe(true);
    });
  });

  it('should put czar-marker on the czar player"', () => {
    browser.sleep(10).then(() => {
      showCzarMarker = element(by.css('.avatar-name'));
      expect(browser.isElementPresent(showCzarMarker))
        .toBe(true);
    });
  });
});
