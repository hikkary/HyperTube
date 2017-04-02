import { Serie, User } from '../Schema';
import { Comment } from '../Joi';
import _ from 'lodash';
import Joi from 'joi';
import OS from 'opensubtitles-api';
import download from 'download-file';
import srt2vtt from 'srt-to-vtt';
import fs from 'fs';

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
  // console.log(data);
  Serie.find({ imdb_code: data })
  .exec()
    .then((results) => {
      // console.log(results[0].content);
      const episodeInfo = results[0].content.filter((ep) => {
        if (ep.tvdb_id === Number(req.params.id)) {
          return ep;
        }
      });
      res.send({ status: true, details: episodeInfo });
    });
};

export const addComment = async (req, res) => {
  console.log('iddd serie', req.body.serieId);
  console.log('iddd episode', req.body.episodeId);
  const { error } = await Joi.validate({ comment: req.body.comment }, Comment, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const { username, id, comment, serieId, episodeId } = req.body;
  console.log(req.body.username);
  console.log(req.body.id);
  Serie.find({ imdb_code: serieId })
  .exec()
    .then((results) => {
      console.log('entered resultss');
      // let filteredEpisode = results[0].content.filter((episode) => {
      //   if (episode.tvdb_id === Number(episodeId)) {
      //     return episode;
      //   }
      // });

      // if (!filteredEpisode.comments) {
      //   console.log('entered if');
      //   filteredEpisode.comments = [];
      // }
      // filteredEpisode.comments.unshift({ comment, id, username });
      // filteredEpisode.save().then((err) => { console.log(err);})

      const index = _.indexOf(results[0].content, _.find(results[0].content, { tvdb_id: Number(episodeId) }));
      console.log("Index Serie", index);

      if (!results[0].content[index].comments) {
        console.log('entered if');
        results[0].content[index].comments = [];
      }
      results[0].content[index].comments.unshift({ comment, id, username });
      console.log("episode Actuel",results[0].content[index]);
      results[0].content.splice(index, 1, results[0].content[index]);

      console.log("============================================ß");
      // IL NE VEUT PAS SAVE !! mais le console log de filteredEpisode est parfait
      results[0].save().then((err) => { console.log(err);})
      res.send({ status: true, ...results[0].content[index] });
    })
    .catch((err) => console.log(err));
};

export const userSeenSerie= (req, res) => {
  console.log(req.body);
  const { userId, serieId, episodeId } = req.body;
  console.log('idssss', userId, serieId);
  Serie.find({ imdb_code: serieId })
  .then((data) => {
    console.log(data);
    console.log("================");
    console.log(data)
    console.log("================");
    const index = _.indexOf(data[0].content, _.find(data[0].content, { tvdb_id: Number(episodeId) }));
    console.log("INDDEX", index);
    if(!data[0].content[index].seenBy)
    {
      data[0].content[index].seenBy = [];
    }

    data[0].content[index].seenBy.unshift(userId);
    data[0].content.splice(index, 1, data[0].content[index])

    data[0].save();
    // data[0].seenBy.push(userId);
    // data[0].seenBy = _.uniq(data[0].seenBy);
    // data[0].save();
    console.log("USER IDD",userId);
    User.find({ _id: userId })
      .then((user) => {
        if (!user) return res.send({ status: false, errors: 'noUsername'});
        console.log('title movie', data[0].title);
        console.log("USER OOO",user);

        user[0].lastSeen.unshift(data[0].title);
        user[0].lastSeen = _.uniq(user[0].lastSeen);
        user[0].lastSeen = user[0].lastSeen.slice(0, 10);
        user[0].save();
        res.send({ status: true });
        console.log('user', user[0]);
      });
  });
};

export const getSubtitles = (req, res) => {
  const OpenSubtitles = new OS('42hypertube');
  console.log('HASH HASH HAHS', req.body);
  OpenSubtitles.search({
    imdbid: req.body.imdbid,
    season: req.body.season,
    episode: req.body.episode,
  }).then(async (subtitles) => {
    console.log('hello subtitles');
    console.log('sub api', subtitles);
    let language = '';
    req.body.sublanguageid === 'eng' ? language = 'English' : language = 'French';
    console.log('lang', language);
    // console.log('sub lang', subtitles.language);
    let getSubtitles = await _.filter(subtitles,(sub) => {
      // console.log('sub', sub);
      if(sub.lang === language){
        return sub
      }
    });
    if (getSubtitles.length === 0){
      getSubtitles = await  _.filter(subtitles,(sub) => {
        // console.log('sub', sub);
        if(sub.lang === 'English'){
          return sub
        }
      });
    }
    if(getSubtitles.length === 0){
      return res.send({status: false, details: 'no subtitles'})
    }

    console.log('sous tititt', getSubtitles[0]);
    const options = {
      directory: './public/subtitles',
      filename: getSubtitles[0].filename,
    };

    const url = getSubtitles[0].url;

    const filename = getSubtitles[0].filename.replace('.srt', '.vtt');
    console.log(filename);
    console.log(getSubtitles[0].filename);
    const formerFilename = getSubtitles[0].filename
    download(url, options, (err) => {
      if (err) throw err;
      console.log('meooooowww');
      fs.createReadStream(`./public/subtitles/${formerFilename}`)
      .pipe(srt2vtt())
      .pipe(fs.createWriteStream(`./public/subtitles/${filename}`))
      res.send(filename);
    })
  });
}
