import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import debug from 'debug';
import jwtSecret from '../../jwtSecret';
import { User, Register, Login, Facebook } from '../Schema';
import Joi from 'joi';
import path from 'path';
import axios from 'axios';
// const registerSchema = Joi.object().keys({
//   username: Joi.string().regex(/^[a-zA-Z0-9]\w+$/).min(3).max(20).required(),
//   firstname: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/).min(3).max(40).required(),
//   lastname: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/).min(3).max(40).required(),
//   email: Joi.string().regex(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).required(),
//   password: Joi.string().regex(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.).*$/).min(8).max(20).required(),
//   confirm: Joi.string().regex(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.).*$/).min(8).max(20).required(),
//   image: Joi.any().optional(),
// });

const log = debug('hypertube:api:user:register');

const storage = multer.diskStorage({
  destination: `${__dirname}/../../public`,
  filename: (req, file, cb) => {
    const fileSplit = file.originalname.split(".")
    console.log(path.extname(file.originalname));
    cb(null, file.originalname[0] + Math.random(0,999) + file.originalname[1]);
  },
});

const single = multer({ storage }).single('image');

const userToDatabase = (req) => {
  if (!req.file){
    req.file = '';
  }
  console.log(req.file);
  const passwordHash = crypto.createHash('rmd160').update(req.body.password).digest('base64');
  const newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: passwordHash,
    picture: req.file.filename,
    key: 0,
  });
  newUser.save();
};

export const createAccount = (req, res) => {
  single(req, res, async (err) => {
    const { error } = await Joi.validate(req.body, Register, { abortEarly: false });
    if (error) {
      return res.send({ status: false, errors: error.details });
    }
    if (err) {
      return res.send({ status: false, details: 'cannot create image' });
    }
    // req.file === image data
    // log(req.file);
    // res.send(req.file);
    const { username, email } = req.body;
    User.findOne({ username })
      .then((user) => {
        if (user) res.send({ status: false, details: 'username already exists' });
        else return User.findOne({ email });
      })
      .then((usermail) => {
        if (usermail) res.send({ status: false, details: 'email already exists' });
        else userToDatabase(req);
        return res.send({ status: true, details: 'user successfully saved in database' });
      });
  });
}

export const login = async (req, res) => {
  const { username } = req.body;
  const { error } = await Joi.validate(req.body, Login, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const passwordHash = crypto.createHash('rmd160').update(req.body.password).digest('base64');
  User.findOne({ username })
  .then((user) => {
    if (!user) res.send({ status: false, details: 'there is an issue with the password or the username' });
    if (user) {
      if (user.password.localeCompare(passwordHash) !== 0) {
        return res.send({ status: false, details: 'there is an issue with the password or the username' });
      } else {
        const token = jwt.sign({ username: user.username, id: user._id }, jwtSecret);
        res.header('Access-Control-Expose-Headers', 'x-access-token');
        res.set('x-access-token', token);
        res.send({ status: true, details: 'user connected' });
      }
    }
  });
};

export const facebook = async (req, res) => {
  console.log(req.body.picture.data.url);
  const FBUser = new User({
    fb_id: req.body.id,
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    picture: req.body.picture.data.url,
    provider: 'facebook',
  });
  FBUser.save();
};
