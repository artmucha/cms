'use strict';

/**
 *  rating controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::rating.rating", ({ strapi }) => ({
  async create(ctx) {

    const user = ctx.state.user;
    const data = ctx.request.body.data;

    const response = await strapi.entityService.create("api::rating.rating", {
      data: {
        ...data,
        user: user.id
      }
    });

    const game = await strapi.db.query('api::game.game').findOne({
      where: { id: response.gameId },
      populate: { ratings: true },
    });

    const value = game.ratingValue ? (game.ratingValue + response.value) : response.value;

    const rating = game.ratings?.length ? (value / game.ratings?.length) : value;

    await strapi.db.query('api::game.game').update({
      where: { id: response.gameId },
      data: {
        ratingValue: rating,
        ratingQuantity: game.ratings.length,
      }
    });

    return response;
  },

  async update(ctx) {

    const response = await super.update(ctx);

    const game = await strapi.db.query('api::game.game').findOne({
      where: { id: response.data.attributes.gameId },
      populate: { ratings: true },
    });

    let value = 0;

    game.ratings.forEach(item => {
      value = value + item.value;
    });

    const rating = value / game.ratings.length;

    await strapi.db.query('api::game.game').update({
      where: { id: response.data.attributes.gameId },
      data: {
        ratingValue: rating,
        ratingQuantity: game.ratings.length,
      }
    });

    return response;
  },
}));