import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import jwtSecret from '../../jwtSecret';
import { User } from '../Schema';

const userToDatabase = (req) => {
  console.log("ACANT DB",req.body.password);
  const passwordHash = crypto.createHash('rmd160').update(req.body.password).digest('base64');
  const newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: passwordHash,
    picture: req.body.picture,
    key: 0,
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
          return res.send({ status: true, details: 'user successfully saved in database' });
        });
    });
};

export const login = (req, res) => {
  console.log(req.body);
  if(!req.body.password || !req.body.username ){
    return res.send({ status: false, details: 'please fill out the login form' });
		}
  const { username } = req.body;
  const passwordHash = crypto.createHash('rmd160').update(req.body.password).digest('base64');

  User.findOne({ username })
  .then((user) => {
    if (user) {
      console.log("USER password",user.password);
      console.log("Hash password",passwordHash);
      if (user.password.localeCompare(passwordHash) !== 0) {
        return res.send({ status: false, details: 'there is an issue with the password or the username' });
      } else {

          return res.send({ status: true, details: 'OK', token: jwt.sign(user, jwtSecret) });
      }
    }
  });
};
