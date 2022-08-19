'use strict';

/**
 *  game controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::game.game", ({ strapi }) => ({
  async findOne(ctx) {
    const slug = ctx.params.id;

    const entity = await strapi.db.query('api::game.game').findOne({
      where: { slug },
      populate: { 
        platform: true, 
        platforms: true, 
        cover: true, 
        genres: true, 
        post: { populate: { cover: true } }, 
        gallery: true 
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));