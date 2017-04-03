import cron from 'node-cron';
import fs from 'fs';
import { Movie, Serie } from './src/Schema';
import _ from 'lodash';
import rimraf from 'rimraf';

export const deleteOldMedia = () => {
  cron.schedule('00 30 11 * * 1-7', () => {
    console.log('cron goooooo');
    Movie.find({})
      .then((results) => {
        results.map((movie) => {
          console.log('res', movie.lastSeenDate);
          if (movie.lastSeenDate && movie.path) {
            const todaysDate = new Date();
            console.log('today date', todaysDate);
            const checkDate = todaysDate - movie.lastSeenDate;
            if (checkDate >= 2592000000) {
              console.log('path', movie.path);
              _.map(movie.path, (data) => {
                console.log('data', data);
                rimraf(`./public/Media/${data}`, () => {
                  console.log('done');
                });
              });
              movie.path = {};
              movie.save();
            }
          }
        });
      });
    Serie.find({})
      .then((results) => {
        results.map((series) => {
          series.content.map((serie) => {
            if (serie.path && serie.lastSeenDate) {
              const todaysDate = new Date();
              const checkDate = todaysDate - serie.lastSeenDate;
              if (checkDate >= 2592000000) {
                _.map(serie.path, (data) => {
                  console.log('data', data.path);
                  fs.unlink(`./public/Media/${data.path}`, () => {
                    console.log('done');
                  });
                });
                const index = _.indexOf(series.content, _.find(series.content, { tvdb_id: Number(serie.tvdb_id) }));

                series.content[index].path = {};
                series.content.splice(index, 1, series.content[index]);
              }
            }
          });
          series.save();
        });
      });
  });
};
