module.exports = {
  routes: [
    {
      method: 'GET',
      path: 'games/:slug',
      handler: 'game.findOne',
      config: {
        auth: false,
      }
    }
  ]
}