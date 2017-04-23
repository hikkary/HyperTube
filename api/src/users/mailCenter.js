import nodemailer from 'nodemailer';

const resetPassword = async (transporter, user, host) => {
  const mailOptions = {
    from: '"Reset password" <noreply@hypertube.com>', // sender address
    to: user.email, // list of receivers
    subject: 'Change password', // Subject line
    text: ` Please click on this link to change your password ${host}/updatePassword?username=${user.username}&key=${user.key}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
       // console.log(error);
    }
  });
  return true;
};

const mailCenter = async (user, host) => {
  const transporter = await nodemailer.createTransport('smtps://hikkaryfr@gmail.com:Kenshiro31@smtp.gmail.com');
  resetPassword(transporter, user, host);
};

export default mailCenter;
