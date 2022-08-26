'use strict';

/**
 *  review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
    async create(ctx) {
  
      const user = ctx.state.user;
      const data = ctx.request.body.data;
  
      const response = await strapi.entityService.create("api::review.review", {
        data: {
          ...data,
          user: user.id
        }
      });
  
      return response;
    },
}));
