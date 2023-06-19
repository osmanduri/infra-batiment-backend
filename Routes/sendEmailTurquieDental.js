const router = require('express').Router()
const nodemailer = require('nodemailer')
const path  = require('path');
const hbs = require('nodemailer-express-handlebars')

router.post('/', (req, res) => {
    res.send('send mail done')
})

router.post('/send', (req, res) => {
    try{
        let transporter = nodemailer.createTransport({
            host:'smtp.ionos.fr',
            port:'465',
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASSWORD
            }
        });

        const handlebarOptions = {
            viewEngine: {
                extName: ".handlebars",
                partialsDir: path.resolve(__dirname, "../Views/templates"),
                defaultLayout: false,
            },
            viewPath: path.resolve(__dirname, "../Views/templates"),
            extName: ".handlebars",
        };

        transporter.use('compile', hbs(handlebarOptions));
        let mailOptions = {
            from: process.env.USER_MAIL,
            to: req.body.destinataire,
            cc: process.env.USER_MAIL,
            subject: `Demande effectué par  ${req.body.prenom} ${req.body.nom}` ,
            text: '',
            template: 'reception',
            context: {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: "osman.duri@hotmail.fr",
                phone: "0101010101",
                country: "UK",
                subject: "Implant dentaire",
                message: "This is a msg"
            }
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if(!err){
                res.status(200).send('Email envoyé')
            }else{
                res.status(400).send(err)
            }
        })
    }catch(err){
        res.send(err)
    }   
})


module.exports = router