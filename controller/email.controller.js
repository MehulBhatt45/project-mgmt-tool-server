

var nodemailer = require('nodemailer');
var emailController = {};

emailController.sendEmail = function(req, res) {
  console.log(req.body);
  var transporter = nodemailer.createTransport({
                                host: "smtp.gmail.com",
                                port: 465,
                                secure: true,
                                service: 'gmail',

                                auth: {
                                        user: 'tnrtesting2394@gmail.com',
                                        pass: 'raoinfotech09'
                                }
                        });


                        var mailOptions = {
                                from: 'tnrtesting2394@gmail.com',
                                to: req.body.to,
                                subject: req.body.sub,
                                html: req.body.content
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                        console.log("Error",error);
                                } else {
                                        console.log('Email sent: ' + info.response);
                                        res.status(200).send("email send");
                                }
                        });
}

module.exports = emailController;
