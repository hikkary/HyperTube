/* eslint-disable no-param-reassign */
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import multer from 'multer';
import debug from 'debug';
import Joi from 'joi';
import path from 'path';
import axios from 'axios';
import mongoose from 'mongoose';
import jwtSecret from '../../jwtSecret';
import { clientID, gmailSecret } from './secretGmail';
import { User } from '../Schema';
import { Register, Login, Forgot, Update, Profile, AuthProfile } from '../Joi';
import { uid, secret } from './secret42';
import mailCenter from './mailCenter';

const log = debug('hypertube:api:user:register');
const ObjectId = mongoose.Types.ObjectId;
const single = multer({ storage }).single('image');

const storage = multer.diskStorage({
  destination: `${__dirname}/../../public`,
  filename: (req, file, cb) => {
    cb(null, Math.random(100000, 9999999) + path.extname(file.originalname));
  },
});

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
    // console.log('decoded', decoded);
    User.findOne({ _id: ObjectId(decoded.id) })
      .then((result) => {
        if (result) {
          // console.log("=========================================", result);
          if (!decoded.lastSeen) {
            decoded.lastSeen = [];
          }
          if (result.lastSeen) {
            // console.log('result de if', result.lastSeen);
            // console.log('de if decoded', decoded.lastSeen);
          decoded.lastSeen = result.lastSeen;
        }
          // console.log("DECODED", decoded.lastSeen);
          return res.send({ status: true, details: decoded });
        } else {
          return res.send({ status: false, details: 'errors' });
        }
      });
  });
};

export const getUserInfo = (req, res) => {
  const id = req.body.id;
  User.findOne({ _id: ObjectId(id) })
    .then((result) => {
      console.log(result);
      if (!result) {
        return res.send({ status: false, errors: 'Username not found' });
      }
      const user = {
        username: result.username,
        firstname: result.firstname,
        lastname: result.lastname,
        id: result.id,
        email: result.email,
        picture: result.picture,
        lastSeen: result.lastSeen,
        provider: result.provider,
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
      return res.send({ status: false, errors: 'imgIssue' });
    }
    const { username, email } = req.body;
    User.findOne({ username })
      .then((user) => {
        if (user) return res.send({ status: false, errors: 'usernameExists' });
        else return User.findOne({ email });
      })
      .then((usermail) => {
        if (usermail) return res.send({ status: false, errors: 'emailExists' });
        else userToDatabase(req);
        return res.send({ status: true, success: 'userCreated' });
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

export const handleAuthorize42 = async (req, res) => {
  const code = req.query.code;
  let finalToken = '';
  await axios({
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
  .then(async (response) => {
	const token = await response.data.access_token;
    await axios({
      method: 'GET',
	  headers:{
       Authorization: `Bearer ${token}`,
      },
      url: 'https://api.intra.42.fr/v2/me',
    })
    .then(async (user) => {
      const data = {
        auth_id: user.data.id,
        username: `${user.data.first_name}${user.data.last_name}`,
        firstname: user.data.first_name,
        lastname: user.data.last_name,
        picture: user.data.image_url,
        provider: '42',
      };
      // console.log("RESPONSE", response.data.access_token);
      User.findOrCreate({ auth_id: user.data.id }, data, { upsert: true })
      .then(async (user42) => {
		  console.log(user42);
        const tokenUserinfo = {
          username: user42.result.username,
          lastname: user42.result.lastname,
          firstname: user42.result.firstname,
          id: user42.result.id,
          email: user42.result.email,
          language: user42.result.language,
          picture: user42.result.picture,
		  provider: user42.result.provider,
        };
        finalToken = await jwt.sign(tokenUserinfo, jwtSecret);
		res.header('Access-Control-Expose-Headers', 'x-access-token');
		res.set('x-access-token', token);
		res.redirect(`http://localhost:3000/login?token=${finalToken}`);
      })
      .catch((err) => { console.log(err); });
    });




    // res.send({ status: true, details: 'user connected' });
  })
  .catch((e) => {
    console.log(e);
    res.redirect('http://localhost:3000/?error=42log');
    // message d'erreur
  });
};

export const facebook = async (req, res) => {
  console.log('yoyoyo');
  const data = ({
    auth_id: req.body.id,
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    picture: req.body.picture.data.url,
    provider: 'facebook',
  });
  User.findOrCreate({ auth_id: req.body.id }, data, { upsert: true })
  .then((user) => {
    if (user) {
      const tokenUserinfo = {
        id: user.result.id,
        username: `${req.body.first_name}${req.body.last_name}`,
        lastname: req.body.last_name,
        firstname: req.body.first_name,
        auth_id: req.body.id,
        language: user.result.language,
        picture: req.body.picture.data.url,
        provider: 'facebook',
      };
      const token = jwt.sign(tokenUserinfo, jwtSecret);
      console.log('token facebook', token);
      res.header('Access-Control-Expose-Headers', 'x-access-token');
      res.set('x-access-token', token);
      res.send({ status: true, details: 'user connected' });
    }
  });
};

export const gmailAuth = (req, res) => {
  const code = req.query.code;
  console.log('gmail auth back', code);
  axios({
    method: 'POST',
    url: 'https://accounts.google.com/oauth2/v4/token',
    data: {
      code: req.query.code,
      client_id: clientID,
      client_secret: gmailSecret,
      redirect_uri: 'https://localhost:8080/api/users/gmail_auth',
      grant_type: 'authorization_code',
      access_type: 'offline',
    },
  })
  .then((response) => {
    console.log(response.data);
    // res.redirect('http://localhost:3000/app/homePage');
  });
//     axios({
//       method: 'GET',
//       url: 'https://www.googleapis.com/drive/v2/files',
//       headers: {
//         Authorization: `Bearer ${response.data.access_token}`,
//       },
// })
}

export const githubAuth  = (req, res) => {
  const code = req.query.code;
  console.log('entered github', code);
  axios({
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    data: {
      client_id: '3fa2a5a1929e273f97c5',
      client_secret: '22bf4ae262fa4df0100a696c19c6b53bbf9c63e2',
      code: req.query.code,
      redirecr_uri: 'http://localhost:8080/api/users/github_auth',
      state: 'qwertyu456',
    }
  })
  .then((response) => {
    const token = response.data.split('&')[0];
    const final = token.split('=')[1];
    axios({
      method: 'GET',
      url: 'https://api.github.com/user',
      headers: {
        Authorization: `token ${final}`,
      }
    })
    .then((response) => {
      console.log(response.data);
      const firstname = response.data.name.split(' ')[0];
      const lastname = response.data.name.split(' ')[1];
      const userInfoGit = {
        auth_id: response.data.id,
        firstname,
        lastname,
        username: response.data.login,
        picture: response.data.avatar_url,
        provider: 'github',
      }
      User.findOrCreate({ id: response.data.id }, userInfoGit, { upsert: true })
        .then((user) => {
          if (user) {
            console.log('user', user);
            const tokenUserinfo = {
              id: user.result.id,
              username: response.data.login ,
              firstname,
              lastname,
              auth_id: response.data.id,
              language: user.result.language,
              picture: response.data.avatar_url,
              provider: 'github',
            };
            const token = jwt.sign(tokenUserinfo, jwtSecret);
            console.log('token github', token);
            res.redirect(`http://localhost:3000/login?token=${token}`);
          }
        });
      });
    });
  }

export const forgotPassword = async (req, res) => {
  const { error } = await Joi.validate(req.body, Forgot, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: 'badUsername' });
  }
  const { username } = req.body;
  User.findOne({ username })
    .then(async (result) => {
      if (!result) {
        res.send({ status: false, errors: 'noUsername' });
      }
      const key = crypto.randomBytes(20).toString('hex');
      result.key = key;
      result.save()
        .then((savedUser) => {
          log(savedUser);
          mailCenter(result, req.headers.origin);
          res.send({ status: true, success: 'emailSent' });
        })
        .catch(() => res.send({ status: false, errors: 'An error occurred' }));
    });
};

export const updatePassword = async (req, res) => {
  const { error } = await Joi.validate(req.body, Update, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: 'passwordRegex' });
  }
  const { username, key, password, newPass } = req.body;
  if (password.localeCompare(newPass) !== 0) {
    res.send({ status: false, errors: 'noMatch' });
  }
  User.findOne({ username })
    .then((result) => {
      if (!result) {
        res.send({ status: false, errors: 'noUsername' });
      }
      if (result.key.localeCompare(key) !== 0) {
        return res.send({ status: false, errors: 'errorOccured' });
      }
      const passwordHash = crypto.createHash('sha512').update(password).digest('base64');
      result.password = passwordHash;
      const key = crypto.randomBytes(20).toString('hex');
      result.key = key;
      result.save()
      .then(() => {
        res.send({ status: true, details: 'Password Updated' });
      });
    });
};

export const editProfile = (req, res) => {
  single(req, res, async (err) => {
    console.log(req.body.language);
    const { error } = await Joi.validate(req.body, Profile, { abortEarly: false });
    if (error) {
      console.log('joi', error);
      return res.send({ status: false, errors: 'fillForm' });
    }
    if (err) {
      return res.send({ status: false, errors: 'imgIssue' });
    }
    const { id } = req.body;
    User.findOne({ _id: ObjectId(id) })
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
        console.log('lang', req.body.language);
        if (!req.body.language) {
          if (!result.language) {
            console.log('base de donnees undefined');
            result.language = 'en';
          } else {
            result.language = result.language;
          }
        } else {
          result.language = req.body.language;
        }
        console.log('result language' , result.language);
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

export const authEditProfile = (req, res) => {
  const { id } = req.body;
  const { error } = Joi.validate(req.body, AuthProfile, { abortEarly: false });
  if (error) {
    console.log('joi', error);
    return res.send({ status: false, errors: 'fillForm' });
  }
  User.findOne({ _id: ObjectId(id) })
    .then((user) => {
      if (!user) return res.send({ status: false, errors: 'noUsername' });
      if (user) {
        if (!req.body.currentLanguage) {
          console.log('pas de body');
          if (!user.language) {
            user.language = 'en';
          } else {
            user.language = user.language;
          }
        } else {
          user.language = req.body.currentLanguage;
          console.log('yo', user);
        }
        user.save();
      }
    });
};

export const deleteAccount = (req, res) => {
  User.findOne({ _id: ObjectId(req.body.id) })
    .then((result) => {
      console.log('USER', result);
      if (!result) return res.send({ status: false, error: 'noUsername' });
      result.remove();
      res.send({ status: true });
    });
};
