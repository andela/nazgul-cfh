export default {
  name: 'nazgul-cfh',
  scripts: {
  },
  env: {
    MONGOHQ_URL: {
      required: true
    }
  },
  formation: {
    web: {
      quantity: 1
    }
  },
  addons: [

  ],
  buildpacks: [
    {
      url: 'heroku/nodejs'
    }
  ]
};
