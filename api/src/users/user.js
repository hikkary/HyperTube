import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import debug from 'debug';
import jwtSecret from '../../jwtSecret';
import { User, Facebook } from '../Schema';
import { Register, Login, Forgot, Update } from '../Joi';
import Joi from 'joi';
import path from 'path';
import axios from 'axios';
import { uid, secret } from './secret42';
import mailCenter from './mailCenter';
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
    const fileSplit = file.originalname.split('.');
    console.log(path.extname(file.originalname));
    cb(null, file.originalname[0] + Math.random(0, 999) + file.originalname[1]);
  },
});

const single = multer({ storage }).single('image');

const userToDatabase = (req) => {
  if (!req.file) {
    req.file = '';
  } else {
    // req.file.mimetype
    const parts = req.file.mimetype.split('/');
    const result = parts[parts.length - 1];
    console.log('results', result);
    req.file.filename = `${req.file.filename}.${result}`;
  }
  const passwordHash = crypto.createHash('sha512').update(req.body.password).digest('base64');
  const newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    language: req.body.language,
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
    console.log(req.file);
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
};

export const login = async (req, res) => {
  const { username } = req.body;
  const { error } = await Joi.validate(req.body, Login, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const passwordHash = crypto.createHash('sha512').update(req.body.password).digest('base64');
  User.findOne({ username })
  .then((user) => {
    if (!user) res.send({ status: false, details: 'there is an issue with the password or the username' });
    if (user) {
      if (user.password.localeCompare(passwordHash) !== 0) {
        return res.send({ status: false, details: 'there is an issue with the password or the username' });
      }
      const token = jwt.sign({ username: user.username, id: user._id }, jwtSecret);
      res.header('Access-Control-Expose-Headers', 'x-access-token');
      res.set('x-access-token', token);
      res.send({ status: true, details: 'user connected', user });
    }
  });
};

export const handleAuthorize42 = (req, res) => {
  console.log('query', req.query.code);
  const code = req.query.code;
  axios({
    method: 'POST',
    url: 'https://api.intra.42.fr/oauth/token',
    data: {
      grant_type: 'authorization_code',
      client_id: uid,
      client_secret: secret,
      code,
      redirect_uri: 'http://localhost:8080/api/users/42_auth',
    },
  })
  .then((response) => {
    console.log(response.data.access_token);
    axios({
      method: 'GET',
      url: 'https://api.intra.42.fr/v2/me',
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    }).then((user) => {
      const data = {
        auth_id: user.data.id,
        firstname: user.data.first_name,
        lastname: user.data.last_name,
        picture: user.data.image_url,
        language: 'en',
        provider: '42',
      };
      User.findOrCreate({ auth_id: user.data.id }, data, { upsert: true }).catch((err) => { console.log(err); });
    });
    const token = response.data.access_token;
    res.header('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    // redirect port 3000
    res.redirect('http://localhost:3000/app');
    // res.send({ status: true, details: 'user connected' });
  })
  .catch((e) => {
    console.log(e);
    res.redirect('http://localhost:3000/?error=42log');
    // message d'erreur
  });
};

export const forgotPassword = async (req, res) => {
  // METTRE JOI ICI
  const { error } = await Joi.validate(req.body, Forgot, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const { username } = req.body;
  User.findOne({ username })
    .then(async (result) => {
      if (!result) {
        res.send({ status: false, details: 'Username not found' });
      }
      const key = crypto.randomBytes(20).toString('hex');
      // eslint-disable-next-line no-param-reassign
      result.key = key;
      result.save()
        .then((savedUser) => {
          log(savedUser);
          mailCenter(result, req.headers.origin);
          res.send({ status: true });
        })
        .catch(() => res.send({ status: false, details: 'An error occurred' }));
    });
};

export const updatePassword = async (req, res) => {
  const { error } = await Joi.validate(req.body, Update, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const { username, key, password, newPass } = req.body;
  if (password.localeCompare(newPass) !== 0){
    res.send({status: false, details: 'passwords dont match'})
  }

  User.findOne({username})
  .then((result) => {
    if (!result) {
      res.send({ status: false, details: 'Username not found' });
    }
    if (result.key.localeCompare(key) !== 0){
      res.send({ status: false, details: 'An issue occured' });
    }
    const passwordHash = crypto.createHash('sha512').update(password).digest('base64');

    // eslint-disable-next-line no-param-reassign
    result.password = passwordHash;
    result.save()
    .then(() =>{
      res.send({status:true, details : 'Password Updated'})
    })
  })
}

export const facebook = async (req, res) => {
  console.log(req.body.picture.data.url);
  console.log('TYPE ID', typeof (req.body.id));
  const data = ({
    auth_id: req.body.id,
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    language: 'en',
    picture: req.body.picture.data.url,
    provider: 'facebook',
  });
  User.findOrCreate({ auth_id: req.body.id }, data, { upsert: true }).catch((err) => { console.log(err); });
};

  // const FBUser = new User({
  //   fb_id: req.body.id,
  //   firstname: req.body.first_name,
  //   lastname: req.body.last_name,
  //   picture: req.body.picture.data.url,
  //   provider: 'facebook',
  // });
  // FBUser.save();
