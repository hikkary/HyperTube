import { User } from '../Schema';

const userToDatabase = (req) => {
  const newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    picture: req.body.picture,
  });
  newUser.save();
}

export const createAccount = (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) return res.send({ status: false, details: 'username already exists' });
      User.findOne({ email: req.body.email })
        .then((email) => {
          if (email) return res.send({ status: false, details: 'email already exists' });
          userToDatabase(req);
          return res.send('user ok');
        });
    });
};
