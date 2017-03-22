/* eslint-disable no-param-reassign */
// import axios from 'axios';
import _ from 'lodash';
import Joi from 'joi';
import { Movie, User } from '../Schema';
import { Comment } from '../Joi';
import OS from 'OpenSubtitles-api';
import download from 'download-file';
import srt2vtt from 'srt-to-vtt';
import fs from 'fs';

export const movie = (req, res) => {
  const data = req.params.id;
  Movie.find({ id: data })
  .exec()
    .then((results) => {
      // add imdb axios to get
      // if (results) {
      //     axios.get(`http://imdb.wemakesites.net/api/${results[0].imdb_code}?api_key=87ffd3ef-264f-43b0-8ce6-aae18034a202`)
      //       .then(({ data: { data } }) => {
      //         console.log('data', data);
      //         // console.log('results', results);
      //         // get infos from imdb axios
      //         const compInfos = _.pick(data, [
      //           'duration',
      //           'cast',
      //           'released',
      //           'review',
      //         ]);
              // console.log("RESULT AVNAT" ,results.data);
              // merge imdb infos + infos de la database
              // console.log('compInfo', compInfos);
              // const finalInfos = [
              //   ...results,
              //   ...compInfos,
              // ]
              // console.log('final infos', finalInfos);
              // results.push("NIKE KEEK KE KEK KEKE KEK EKE KKE K EKE KE KEKE KK EKE KE KK E");
              // results.push(compInfos);
              // results = {...compInfos.data, ...results}
              // console.log("RESULT APRES PUSH",results);
              // const allInfos = Object.assign({}, results);
              // console.log('all', allInfos);
              // console.log('final results with everything', results);
      res.send({ status: true, ...results });
    });
};
    // });
// };

export const addComment = async (req, res) => {
  const { error } = await Joi.validate({ comment: req.body.comment }, Comment, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const { username, id, comment, movie_id } = req.body;
  console.log(username);
  console.log(id);
  console.log(comment);
  Movie.find({ id: movie_id })
  .exec()
    .then((results) => {
      console.log(results);
      results[0].comments.unshift({ comment, id, username });
      results[0].save();
      res.send({ status: true, results });
    });
};

export const userSeenMovie = (req, res) => {
  const { userId, movieId } = req.body;
  console.log('idssss', userId, movieId);
  Movie.find({ id: movieId })
  .then((data) => {
    data[0].seenBy.push(userId);
    data[0].seenBy = _.uniq(data[0].seenBy);
    data[0].save();
    User.find({ _id: userId })
      .then((user) => {
        console.log('title movie', data[0].title);
        user[0].lastSeen.push(data[0].title);
        user[0].lastSeen = _.uniq(user[0].lastSeen);
        user[0].lastSeen = user[0].lastSeen.slice(0, 10);
        user[0].save();
        res.send({ status: true });
        console.log('user', user[0]);
      });
  });
};

export const getSubtitles =  (req, res) => {
  const OpenSubtitles = new OS('42hypertube');
  console.log('hellooooo youuuu subbbbtitltes');
  console.log('HASH HASH HAHS', req.body.hash);
  console.log('WORK WORK WORK', req.body);
  OpenSubtitles.search({
    sublanguageid: 'fre',       // Can be an array.join, 'all', or be omitted.
    hash: req.body.hash,        // Size + 64bit checksum of the first and last 64k
    imdbid: req.body.imdbid,        // Size + 64bit checksum of the first and last 64k
  }).then( (subtitles) => {
    const url = subtitles.fr.url;

    const options = {
      directory: './public/subtitles',
      filename: subtitles.fr.filename,
    };

  const filename = subtitles.fr.filename.replace('.srt', '.vtt');

  download(url, options,  (err) => {
    if (err) throw err;
    console.log('meow');

    fs.createReadStream(`./public/subtitles/${subtitles.fr.filename}`)
    .pipe(srt2vtt())
    .pipe(fs.createWriteStream(`./public/subtitles/${filename}`))
    res.send(filename)
  });
    // console.log('sub', subtitles);
    // subtitles = Object {
        // en: {
        //     downloads: "432",
        //     encoding: "ASCII",
        //     id: "192883746",
        //     lang: "en",
        //     langName: "English",
        //     score: 9,
        //     url: "http://dl.opensubtitles.org/download/subtitle_file_id",
        //     filename: "some_movie.tag.srt"
        // }
        // fr: {
        //     download: "221",
        //     encoding: "UTF-8",
        //     id: "1992536558",
        //     lang: "fr",
        //     langName: "French",
        //     score: 6,
        //     url: "http://dl.opensubtitles.org/download/subtitle_file_id",
        //     filename: "some_movie.tag.srt"
        // }
    // }
  });
};
