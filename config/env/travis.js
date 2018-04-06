export default {
  port: 3001,
  app: {
    name: 'Cards for Humanity - Test on Travis'
  },

  twitter: {
    clientID: process.env.TWITTER_CONSUMER_KEY,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'https://localhost:3000/auth/twitter/callback'
  },

  facebook: {
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/facebook/callback'
  },

  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/google/callback'
  },

  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/facebook/callback'
  },
};
