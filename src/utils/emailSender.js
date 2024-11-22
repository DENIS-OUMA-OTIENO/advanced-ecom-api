const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.USER_MAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.USER_MAIL,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   try {
//     await transporter.sendMail(mailOptions); 
//     console.log("Email sent successfully")
//   } catch (error) {
//     console.error("Error sending email:", error)
//     throw new Error("Email could not be sent")    
//   }
  
// };

const sendEmail = async ({email, subject, message}) => {
  try {
      const transporter = nodemailer.createTransport({
          host: process.env.HOST,
          service: process.env.MAIL_SERVICE,
          port: 465,
          secure: true,
          auth: {
              user: process.env.USER_MAIL,
              pass: process.env.EMAIL_PASSWORD,
          },
      });

      await transporter.sendMail({
          from: process.env.USER_MAIL,
          to: email,
          subject: subject,
          text: message,
      });

      console.log("email sent sucessfully");
  } catch (error) {
      console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
