/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import Joi from 'joi';
import OS from 'opensubtitles-api';
import download from 'download-file';
import srt2vtt from 'srt-to-vtt';
import fs from 'fs';
import { Movie, User } from '../Schema';
import { Comment } from '../Joi';

export const movie = (req, res) => {
  const data = req.params.id;
  Movie.find({ id: data })
  .exec()
    .then((results) => {
      axios.get(`http://www.omdbapi.com/?i=${results[0].imdb_code}`)
       .then((response) => {
         const compInfos = _.pick(response.data, [
           'Runtime',
           'Actors',
           'Released',
         ]);
         results = { ...compInfos, ...results };
         res.send({ status: true, ...results });
       });
    });
};

export const addComment = async (req, res) => {
  const { error } = await Joi.validate({ comment: req.body.comment }, Comment, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: 'badComments' });
  }
  const { username, id, comment, movie_id } = req.body;
  Movie.find({ id: movie_id })
  .exec()
    .then((results) => {
      results[0].comments.unshift({ comment, id, username });
      results[0].save();
      res.send({ status: true, results });
    });
};

export const userSeenMovie = (req, res) => {
  const { userId, movieId } = req.body;
  Movie.find({ id: movieId })
  .then((data) => {
    data.map((movie) => {
      movie.seenBy.push(userId);
      movie.seenBy = _.uniq(data[0].seenBy);
      movie.LastSeenDate = new Date();
      movie.save();
    });
    User.find({ _id: userId })
      .then((user) => {
        if (!user) return res.send({ status: false, errors: 'noUsername' });
        user[0].lastSeen.unshift(data[0].title);
        user[0].lastSeen = _.uniq(user[0].lastSeen);
        user[0].lastSeen = user[0].lastSeen.slice(0, 10);
        user[0].save();
        return res.send({ status: true });
      });
  });
};

export const getSubtitles = (req, res) => {
  try {
    const OpenSubtitles = new OS('42hypertube');
    OpenSubtitles.search({
      hash: req.body.hash,        // Size + 64bit checksum of the first and last 64k
      imdbid: req.body.imdbid,        // Size + 64bit checksum of the first and last 64k
    }).then((subtitles) => {
      let language = '';
	  req.body.sublanguageid === 'eng' ? language = 'English' : language = 'French';
      let getSubtitlesMovie = _.filter(subtitles, (sub) => {
        if (sub.lang === language) {
          return sub;
        }
      });
      if (getSubtitlesMovie.length === 0) {
        getSubtitlesMovie = _.filter(subtitles, (sub) => {
          if (sub.lang === 'English') {
            return sub;
          }
        });
      }
      if (getSubtitlesMovie.length === 0) {
        return res.send({ status: false, details: 'no subtitles' });
      }
      const options = {
        directory: './public/subtitles',
        filename: getSubtitlesMovie[0].filename,
      };
      const url = getSubtitlesMovie[0].url;
      const filename = getSubtitlesMovie[0].filename.replace('.srt', '.vtt');
      download(url, options, (err) => {
        if (err) throw err;
        const formerFilename = getSubtitlesMovie[0].filename;
        fs.createReadStream(`./public/subtitles/${formerFilename}`)
        .pipe(srt2vtt())
        .pipe(fs.createWriteStream(`./public/subtitles/${filename}`));
        res.send(filename);
      });
    });
  } catch (e) {
    sleep(100);
    getSubtitles(req, res);
  }
};
