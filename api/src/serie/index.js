import Mongoose from 'mongoose';
import _ from 'lodash';
import Joi from 'joi';
import OS from 'opensubtitles-api';
import download from 'download-file';
import srt2vtt from 'srt-to-vtt';
import fs from 'fs';
import { Comment } from '../Joi';
import { Serie, User } from '../Schema';

const ObjectId = Mongoose.Types.ObjectId;

export const serie = (req, res) => {
  const data = req.params.id;
  Serie.find({ imdb_code: data })
  .exec()
    .then((results) => {
      res.send(results);
    });
};

export const episode = (req, res) => {
  const data = req.params.serie_id;
  Serie.find({ imdb_code: data })
  .exec()
    .then((results) => {
      const episodeInfo = results[0].content.filter((ep) => {
        if (ep.tvdb_id === Number(req.params.id)) {
          return ep;
        }
      });
      res.send({ status: true, details: episodeInfo });
    });
};

export const addComment = async (req, res) => {
  const { error } = await Joi.validate({ comment: req.body.comment }, Comment, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: 'badComments' });
  }
  const { username, id, comment, serieId, episodeId } = req.body;
  Serie.find({ imdb_code: serieId })
  .exec()
    .then((results) => {
      const index = _.indexOf(results[0].content, _.find(results[0].content, { tvdb_id: Number(episodeId) }));
      if (!results[0].content[index].comments) {
        results[0].content[index].comments = [];
      }
      results[0].content[index].comments.unshift({ comment, id, username });
      results[0].content.splice(index, 1, results[0].content[index]);
      results[0].save().then((err) => { console.log(err); })
      res.send({ status: true, ...results[0].content[index] });
    })
    .catch((err) => { console.log(err) });
};

export const userSeenSerie = (req, res) => {
	console.log("============================================", req.body);
  const { userId, serieId, episodeId } = req.body;
  Serie.find({ imdb_code: serieId })
  .then((data) => {
    const index = _.indexOf(data[0].content, _.find(data[0].content, { tvdb_id: Number(episodeId) }));
    if (!data[0].content[index].seenBy) {
      data[0].content[index].seenBy = [];
    }
    data[0].content[index].seenBy.unshift(userId);
    data[0].content[index].seenBy = _.uniq(data[0].content[index].seenBy);
    data[0].content.splice(index, 1, data[0].content[index]);
    data[0].lastSeenDate = new Date();
    data[0].save()
	// .then((err) => { console.log(err); });
	console.log("||||||||||||||||||||||||||||||||||||||");
    User.findOne({ _id: ObjectId(userId) })
      .then((user) => {
        if (!user) return res.send({ status: false, errors: 'noUsername' });
        if (!user.lastSeen) {
          user.lastSeen = [];
        }
        user.lastSeen.unshift(data[0].title);
        user.lastSeen = _.uniq(user.lastSeen);
        user.lastSeen = user.lastSeen.slice(0, 10);
		console.log("//////////////////////////////////////");
        user.save()
		.then(() => {
			console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
			console.log("APRES USER SAVE");
			console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
		})
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

		// 0.then((err) => { console.log(err); });
        return res.send({ status: true });
      });
  });
};

export const getSubtitles = (req, res) => {
  const OpenSubtitles = new OS('42hypertube');
  OpenSubtitles.search({
    imdbid: req.body.imdbid,
    season: req.body.season,
    episode: req.body.episode,
  }).then(async (subtitles) => {
    let language = '';
    req.body.sublanguageid === 'eng' ? language = 'English' : language = 'French';
    let getSubtitlesSerie = await _.filter(subtitles, (sub) => {
      if (sub.lang === language) {
        return sub;
      }
    });
    if (getSubtitlesSerie.length === 0) {
      getSubtitlesSerie = await _.filter(subtitles, (sub) => {
        if (sub.lang === 'English') {
          return sub;
        }
      });
    }
    if (getSubtitlesSerie.length === 0) {
      return res.send({ status: false, details: 'no subtitles' });
    }
    const options = {
      directory: './public/subtitles',
      filename: getSubtitlesSerie[0].filename,
    };
    const url = getSubtitlesSerie[0].url;
    const filename = getSubtitlesSerie[0].filename.replace('.srt', '.vtt');
    const formerFilename = getSubtitlesSerie[0].filename;
    download(url, options, (err) => {
      if (err) throw err;
      fs.createReadStream(`./public/subtitles/${formerFilename}`)
      .pipe(srt2vtt())
      .pipe(fs.createWriteStream(`./public/subtitles/${filename}`));
      res.send(filename);
    });
  });
};
