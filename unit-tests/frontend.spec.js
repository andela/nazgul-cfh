/* A dummy test suit to test the functionality of the Karma test set-up */
/* eslint-disable */
describe('A TESTING OF THE KARMA FRONTEND TEST SET-UP', () => {
  it('should return 5 for a test of 2 + 3', () => {
    expect(2 + 3).toEqual(5);
  });

  it('should return undefined for no argument/value passed', () => {
    expect().toEqual(undefined);
  })
});
