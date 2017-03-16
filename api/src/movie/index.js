import { Movie } from '../Schema';
import axios from 'axios';
import _ from 'lodash';

export const movie = (req, res) => {
  const data = req.params.id;
  Movie.find({ id: data })
  .exec()
    .then((results) => {
      // add imdb axios to get
      if (results) {
          axios.get(`http://imdb.wemakesites.net/api/${results[0].imdb_code}?api_key=87ffd3ef-264f-43b0-8ce6-aae18034a202`)
            .then(({ data: { data } }) => {
              console.log('data', data);
              // console.log('results', results);
              // get infos from imdb axios
              const compInfos = _.pick(data, [
                'duration',
                'cast',
                'released',
                'review',
              ]);
              // merge imdb infos + infos de la database
              console.log('compInfo', compInfos);
              // const finalInfos = [
              //   ...results,
              //   ...compInfos,
              // ]
              // console.log('final infos', finalInfos);
              results.push(compInfos);
              // const allInfos = Object.assign({}, results);
              // console.log('all', allInfos);
              // console.log('final results with everything', results);
              res.send({ status: true, results });
            })
      }
    });
};
