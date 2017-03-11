import { Movie } from '../Schema';

export const movie = (req, res) => {
  const data = req.params.id;
  // const { id } = req.params;
  // console.log(id );
  // res.send(id);
  console.log('data', data);
  Movie.find({id: data})
  .exec()
    .then((results) => {
      console.log('results', results);
      res.send(results);
    });
};
