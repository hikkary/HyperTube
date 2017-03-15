import { Movie } from '../Schema';

export const movie = (req, res) => {
  const data = req.params.id;
  Movie.find({ id: data })
  .exec()
    .then((results) => {
      res.send(results);
    });
};
