const axios = require('axios');
var next = 'https://api.rawg.io/api/games?platforms=1,4,7,18,186,187&page_size=40&key=73a2409ef4e5484792d8f865458dbd02';

const setImage = async({ image, game, field = "cover" }) => {
  try {
    const url = image;
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");

    const FormData = require("form-data");
    const formData = new FormData();

    formData.append("refId", game.id);
    formData.append("ref", "game");
    formData.append("field", field);
    formData.append("files", buffer, { filename: `${game.slug}.jpg` });

    console.info(`Uploading ${field} image: ${game.slug}.jpg`);

    const img_data = await axios({
      method: "POST",
      url: `http://${strapi.config.host}:${strapi.config.port}/api/upload`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });

    return img_data.data[0];

  } catch (e) {
    console.log("setImage", e);
  }
};

module.exports = {
  '1 43 06 * * *': async () => {
    try {
      // do {
        const { data } = await axios('https://api.rawg.io/api/games?platforms=7&page_size=1&key=73a2409ef4e5484792d8f865458dbd02');
        
        data.results.forEach(async (game) => {
  
          let existingGame = await strapi.db.query('api::game.game').findOne({
            where: { gameId: game.id},
          });
  
          if (existingGame) return;

          const genres = [];
  
          game.genres.forEach(async (p) => {
            let genre = await strapi.db.query('api::genre.genre').findOne({
              where: { 
                genreId: p.id
              }
            });
  
            if (genre !== null) genres.push(genre);
          });
  
          const platforms = [];
  
          game.platforms.forEach(async (p) => {
            let platform = await strapi.db.query('api::platform.platform').findOne({
              where: { 
                platformId: p.platform.id
              }
            });

            if (platform !== null) platforms.push(platform);
            
          });

          const cover = await setImage({ image: game.background_image, game });

          const gallery = await Promise.all(
            game.short_screenshots.map(img => setImage({ image: img.image, game, field: "gallery" }))
          );

          platforms.forEach(async (platform) => {
            await strapi.db.query('api::game.game').create({
              data: {
                gameId: game.id,
                slug: `${game.slug}-${platform.slug}`,
                title: game.name,
                released: game.released,
                platform: platform,
                platforms: platforms,
                genres: genres,
                cover: [cover],
                gallery: gallery,
              },
            });
          });

        });
        // next = await data.next;
      // } while (next);
    } catch(error) {
      console.log(error)
    }
  },
};