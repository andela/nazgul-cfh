export default {
  app: {
    name: 'Cards for Humanity'
  },

  twitter: {
    clientID: process.env.TWITTER_CONSUMER_KEY_PROD,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL_PROD
  },

  facebook: {
    clientID: process.env.FB_CLIENT_ID_PROD,
    clientSecret: process.env.FB_CLIENT_SECRET_PROD,
    callbackURL: process.env.FB_CALLBACK_URL_PROD

  },

  google: {
    clientID: process.env.GOOGLE_CLIENT_ID_PROD,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_PROD,
    callbackURL: process.env.GOOGLE_CALLBACK_URL_PROD
  },

  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL_PROD
  },
};
