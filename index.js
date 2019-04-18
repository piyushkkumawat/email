var express = require('express');
var app = express();
var cors = require('cors');
var body_parser = require('body-parser');
var multer = require('multer');
var nodemailer = require('nodemailer');
var path = require('path');
const DataURI = require('datauri').promise;
var async = require('async');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/files/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname+'-'+Date.now())
    }
});
var upload = multer({storage: storage});
let attach = [];
app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());


async function main(files){
	//console.log("inside main ",files);
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "jaiswal.mayank31@gmail.com", // generated ethereal user
      pass: "qmvxyfacwhnbdufy" // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "jaiswal.mayank31@gmail.com", // sender address
    to: "jaiswal.mayank1412@gmail.com", // list of receivers
    subject: "HellBoy ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments: files

  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}





app.post('/fileSave', upload.any(),  (req, res) => {

	//console.log("fileSave ",req.files);

	return res.send("fileSave");
});


app.post('/sendEmail', upload.any(), (req,res) => {

	console.log("sendEmail ",req);

	// var fileArray = req.files;

	// let attachments = [];
	// async.each(fileArray, function(file, eachcallback){

	// 	DataURI(file.path)
 //  		.then(content => {
 //  			let obj = {
 //  				"filename": file.originalname,
 //  				"path": content
 //  			}
 //  			attachments.push(obj);
 //  			//console.log("attachments in datauri ",attachments);
 //  		})
 //  		.catch(err => { 
 //  			console.log("error in datauri",err);
 //  		 });

	// }, function(err) {
	// 	if(err) {
	// 		console.log(" error in async ",err);
	// 	}
	// })

	// main(attachments).catch(console.error);	

	return res.send("green day");
})


app.listen(5005, () => {
	console.log(" server get started at 5005");
})