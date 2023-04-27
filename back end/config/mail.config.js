// // main.js
const nodemailer = require('nodemailer');

// configure option
const option = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(option);

// send email
const sendEmail = async ({ to, subject, text, html, ...rest }) => {
  try {
    const res = await transporter.verify();
    if (res) {
      //config mail
      const mail = {
        //sender access
        from: '"MegaBook Store" <no-reply@accounts.megabook-store.com>',
        //receiver access
        to,
        //subject
        subject,
        //content text
        text,
        //html
        html,
        //others
        ...rest,
      };
      //send email
      const info = await transporter.sendMail(mail);
      if (info) {
        return true;
      }
    }
  } catch (err) {
    console.error('ERROR MAILER: ', err);
    return false;
  }
};

const headerHtmlMail = `<div style="display:flex; align-items: center; border-bottom: solid 2px #ccc;">
    <img src="https://res.cloudinary.com/dsa-company/image/upload/v1648978589/logo_g8shfj.png" width="147px" height="64px">
    <h1 style="color: #4c649b; font-size: 48px;padding-bottom: 10px;margin-left: 10px">
      MegaBook Store
    </h1>
    </div>`;
const footerHtmlVerifyMail = `<h3 style="color: red">
    Note: The code will expire in 10 minutes, so please verify soon!
    </h3>
    <h1 style="color:#000">Thanks!</h1>`;

// gửi mã xác nhận
const htmlSignupAccount = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;color:#000;">
        Hi there,<br />
        Here’s your verification code:<br />
    </h2>
    <h3 style="background: #eee;padding: 10px;color:#000;">
      <i><b>${token}</b></i>
    </h3>
  ${footerHtmlVerifyMail}
  </div>`;
};

// gửi mã đổi mật khẩu
const htmlResetPassword = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Hi customer,<br />
        Magabook Store has received your request for password recovery,<br />
         Don't worry, use this code to recover your password :
    </h2>
    <h1 style="background: #eee;padding: 10px;">
      <i><b>${token}</b></i>
    </h1>
    ${footerHtmlVerifyMail}
  </div>`;
};

// gửi thông báo đăng nhập sai quá nhiều
const htmlWarningLogin = () => {
  return `<div>
   ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Hi customer,<br />
        We are writing to inform you that an unauthorized login attempt has been made on your account. Our security systems detected this activity and we want to take immediate action to protect your account.
        <br/>>
        Please change your password right away and enable two-factor authentication to enhance your account security. If you notice any suspicious activity or have any concerns, please reach out to our customer support team as soon as possible.<br />
        Thank you for your prompt attention to this matter.<br/>
    </h2>
    <h1>Best regards,</h1>
  </div>`;
};

module.exports = {
  sendEmail,
  htmlSignupAccount,
  htmlResetPassword,
  htmlWarningLogin,
};
