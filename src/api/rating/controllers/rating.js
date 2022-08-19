'use strict';

/**
 *  rating controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::rating.rating", ({ strapi }) => ({
  async create(ctx) {

    console.log('CTX')
    console.log(ctx.state)

    const user = ctx.state.user;

      const data = ctx.request.body.data
      console.log(data);
      const order = await strapi.entityService.create("api::rating.rating", {
        data: {
          products,
          user: user.id
        }
      })

    const game = await strapi.db.query('api::game.game').findOne({
      where: { id: response.data.attributes.gameId },
      populate: { ratings: true },
    });

    const value = game.ratingValue ? (game.ratingValue + response.data.attributes.value) : response.data.attributes.value;

    const rating = game.ratings?.length ? (value / game.ratings?.length) : value;

    const sanitized = await strapi.db.query('api::game.game').update({
      where: { id: response.data.attributes.gameId },
      data: {
        ratingValue: rating,
        ratingQuantity: game.ratings.length,
      }
    });

    return { order }
  },
}));