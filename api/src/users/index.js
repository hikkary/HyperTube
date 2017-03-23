/* eslint-disable no-param-reassign */
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import multer from 'multer';
import debug from 'debug';
import Joi from 'joi';
import path from 'path';
import axios from 'axios';
import jwtSecret from '../../jwtSecret';
import { User } from '../Schema';
import { Register, Login, Forgot, Update, Profile } from '../Joi';
import { uid, secret } from './secret42';
import mailCenter from './mailCenter';


const log = debug('hypertube:api:user:register');

const storage = multer.diskStorage({
  destination: `${__dirname}/../../public`,
  filename: (req, file, cb) => {
    cb(null, Math.random(100000, 9999999) + path.extname(file.originalname));
  },
});

const single = multer({ storage }).single('image');

const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

export const connectedUser = (req, res) => {
  const token = getToken(req);
  jwt.verify(token, jwtSecret, (err, decoded) => {
    User.find({ _id: decoded.id })
      .then((result) => {
        if (result) {
          decoded.lastSeen = result[0].lastSeen;
          console.log(decoded);
          res.send(decoded);
        } else {
          res.send('errors');
        }
      });
  });
};

export const getUserInfo = (req, res) => {
  const id = req.body.id;
  User.findOne({ _id: id })
    .then((result) => {
      if (!result) {
        res.send({ status: false, details: 'Username not found' });
      }
      const user = {
        username: result.username,
        firstname: result.firstname,
        id: result.id,
        email: result.email,
        picture: result.picture,
        lastSeen: result.lastSeen,
      };
      res.send({ status: false, details: 'Username found', user });
    });
};

const userToDatabase = (req) => {
  if (!req.file) {
    req.file = {};
    req.file.filename = 'poule.jpg';
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
    lastSeen: [],
  });
  newUser.save();
};

export const createAccount = (req, res) => {
  single(req, res, async (err) => {
    const { error } = await Joi.validate(req.body, Register, { abortEarly: false });
    if (error) {
		// return res.send({ status: false, errors: error.details });
      return res.send({ status: false, errors: 'fillForm' });
    }
    if (err) {
      return res.send({ status: false, details: 'imgIssue' });
    }
    const { username, email } = req.body;
    User.findOne({ username })
      .then((user) => {
        if (user) res.send({ status: false, details: 'usernameExists' });
        else return User.findOne({ email });
      })
      .then((usermail) => {
        if (usermail) res.send({ status: false, details: 'emailExists' });
        else userToDatabase(req);
        return res.send({ status: true, details: 'userCreated' });
      });
  });
};

export const login = async (req, res) => {
  const { username } = req.body;
  const { error } = await Joi.validate(req.body, Login, { abortEarly: false });
  if (error) {
	//   return res.send({ status: false, errors: error.details });
    return res.send({ status: false, errors: "badLogin" });
  }
  const passwordHash = crypto.createHash('sha512').update(req.body.password).digest('base64');
  User.findOne({ username })
    .then((user) => {
      if (!user) res.send({ status: false, errors: 'badLogin' });
      if (user) {
        if (user.password.localeCompare(passwordHash) !== 0) {
          return res.send({ status: false, errors: 'badLogin' });
        }
        if (!user.picture) {

        }

        const tokenUserinfo = {
          username: user.username,
          lastname: user.lastname,
          firstname: user.firstname,
          id: user.id,
          email: user.email,
          language: user.language,
          picture: user.picture,
        };
        const token = jwt.sign(tokenUserinfo, jwtSecret);
        res.header('Access-Control-Expose-Headers', 'x-access-token');
        res.set('x-access-token', token);
        res.send({ status: true, details: 'user connected', user });
      }
    });
};

export const handleAuthorize42 = (req, res) => {
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
    axios({
      method: 'GET',
      url: 'https://api.intra.42.fr/v2/me',
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    })
    .then((user) => {
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
  const { error } = await Joi.validate(req.body, Forgot, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: 'badUsername' });
  }
  const { username } = req.body;
  User.findOne({ username })
    .then(async (result) => {
      if (!result) {
        res.send({ status: false, details: 'noUsername' });
      }
      const key = crypto.randomBytes(20).toString('hex');
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
  if (password.localeCompare(newPass) !== 0) {
    res.send({ status: false, details: 'passwords dont match' });
  }
  User.findOne({ username })
    .then((result) => {
      if (!result) {
        res.send({ status: false, details: 'Username not found' });
      }
      if (result.key.localeCompare(key) !== 0) {
        res.send({ status: false, details: 'An issue occured' });
      }
      const passwordHash = crypto.createHash('sha512').update(password).digest('base64');
      result.password = passwordHash;
      result.save()
      .then(() => {
        res.send({ status: true, details: 'Password Updated' });
      });
    });
};

export const facebook = async (req, res) => {
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

export const editProfile = (req, res) => {
  single(req, res, async (err) => {
    const { error } = await Joi.validate(req.body, Profile, { abortEarly: false });
    if (error) {
      return res.send({ status: false, errors: 'fillForm' });
    }
    if (err) {
      return res.send({ status: false, errors: 'imgIssue' });
    }
    const { id } = req.body;
    User.findOne({ _id: id })
      .then((result) => {
        if (!result) {
          res.send({ status: false, errors: 'noUsername' });
        }
        if (!req.file && result.picture) {
          req.file = {
            filename: result.picture,
          };
        }
        if (!req.file && !result.picture) {
          req.file = {
            filename: '',
          };
        }
        if (result.picture && result.picture !== 'poule.jpg' && req.file ) {
          fs.unlink(`./public/${result.picture}`, (err) => {
            if (err) throw err;
          });
        }
        result.username = req.body.username;
        result.firstname = req.body.firstname;
        result.lastname = req.body.lastname;
        result.email = req.body.email;
        result.picture = req.file.filename;
        result.save()
        // res.send({ status: ..... details: result})
        .then(() => {
          const updatedUser = {
            username: result.username,
            lastname: result.lastname,
            firstname: result.firstname,
            id: result.id,
            email: result.email,
            language: result.language,
            picture: result.picture,
          }
          const token = jwt.sign(updatedUser, jwtSecret);
          res.header('Access-Control-Expose-Headers', 'x-access-token');
          res.set('x-access-token', token);
          res.send({ status: true, details: 'user updated' });
        });
      });
  });
};
