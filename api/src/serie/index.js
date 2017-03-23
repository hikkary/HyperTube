import { Serie } from '../Schema';
import { Comment } from '../Joi';
import Joi from 'Joi';

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
  console.log(data);
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
  const { error } = await Joi.validate({ comment: req.body.comment }, Comment, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const { username, id, comment, serie_id } = req.body;
  console.log(username);
  console.log(id);
  console.log(comment);
  Serie.find({ id: serie_id })
  .exec()
    .then((results) => {
      console.log(results);
      results[0].comments.unshift({ comment, id, username });
      results[0].save();
      res.send({ status: true, results });
    })
};
