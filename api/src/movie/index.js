// import axios from 'axios';
import _ from 'lodash';
import Joi from 'joi';
import { Movie } from '../Schema';
import { Comment } from '../Joi';

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
            })
      }
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
    })
};

export const userSeenMovie = (req) => {
  const { userId, movieId } = req.body;
  console.log('idssss', userId, movieId);
  Movie.find({ id: movieId })
  .then((data) => {
    data[0].seenBy.push(userId);
    data[0].save();
    User.find({ _id: userId })
      .then((user) => {
        console.log('title movie', movie[0].title);
        user[0].lastSeen.push(data[0].title);
        user[0].save();
        console.log('user', user[0]);
      });
  });
}
