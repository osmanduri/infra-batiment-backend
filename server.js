const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config()
require('./Models/db_connection');
const cloud_router = require('./Routes/cloud.route');
const postsChantier_router = require('./Routes/postsChantier_router');
const user_router = require('./Routes/user.route');
const authRoute = require('./Routes/auth.route');
const sendMailTurquieDentalRoute = require('./Routes/sendEmailTurquieDental');
const cookieSession = require('cookie-session');
const passport = require('passport')
require('./passport')

app.use(cookieSession(
    {
        name:"session",
        keys: [process.env.PASS_SEC],
        maxAge:24*60*60*100
    }
))

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: 'https://turquiedental.com',
    credentials: true,
    'allowedHeaders': ['token', 'Content-Type'],
    'exposedHeaders': ['token'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors());


//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.json())
app.use(express.static('assets'));

//Routes
app.use('/turquieDental', sendMailTurquieDentalRoute)
app.use('/chantiers', postsChantier_router);
app.use('/users', user_router);
app.use('/auth', authRoute);
app.use('/cloud', cloud_router)

//Port d'écoute
app.listen(process.env.PORT, () => {
    console.log('listening Port on: ' + process.env.PORT)
})