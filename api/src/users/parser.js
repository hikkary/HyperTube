export const emptyCheck = (req, res, next) => {
  const username = req.body.username;
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const email = req.body.email;
  const pass = req.body.password;
  if (!username || !fname || !lname || !email || !pass) {
    // add picture
    return res.send({ status: false, details: 'please fill out the form to register' });
  } else {
    next();
  }
};

export const username = (req, res, next) => {
  const username = req.body.username;
  if (username && username.length > 3 && username.match(/^[a-zA-Z0-9]\w+$/)) {
    next();
  } else {
    return res.send({ status: false, details: 'username not valid' });
  }
};

export const firstname = (req, res, next) => {
  const fname = req.body.firstname;
  if (fname && fname.length >= 3 && fname.match(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)) {
    next();
  } else {
    return res.send({ status: false, details: 'firstname not valid' });
  }

};

export const lastname = (req, res, next) => {
  const lname = req.body.lastname;
  if (lname && lname.length >= 3 && lname.match(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)) {
    next();
  } else {
    return res.send({ status: false, details: 'lastname not valid' });
  }
};

export const email = (req, res, next) => {
  const email = req.body.email;
  if (email && email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
    next();
  } else {
    return res.send({ status: false, details: 'email not valid' });
  }
};

// export const Password = (req, res, next) => {
//   const pass = req.body.password;
//   if (pass && pass.length > 5) {
//     next();
//   } else {
//     return res.send({ status: false, details: 'password not valid' });
//   }
//   return false;
// };
