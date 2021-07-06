require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')


const jwt = require('jsonwebtoken')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

const app = express()
app.use(express.json());

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true})

const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'))

const User = require('./model/User');
const moment = require('moment');

//middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if(err) {
                return res.sendStatus(403)
            }
            req.user = user;
            next()
        })
    }
    else {
        res.sendStatus(401);
    }
}

//routes

app.post('/signup', async (req, res) => {
    const user  = req.body;

    if(user) {
        const userDetails = await User.find({ uid: user.uid  });
        console.log(userDetails)
        if(userDetails.length === 0){
            const UserData = new User({...user})
            UserData.save()
            res.send(UserData)
        }
        else {
            res.send("Same User Found")
        }
    }
    else {
        res.send("Input a valid User")
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password })
    console.log(user)
    if(user) {
        const accessToken = jwt.sign({ user }, accessTokenSecret)
        res.json({
            accessToken
        })
    }
    else {  
        res.send('User does not exist')
    }

})

app.post('/question', authenticateJWT, async (req, res) => {
    const questionData = req.body;
    const questionBody = {
        ...questionData,
        creatorName: req.user.name,
        creatorid: req.user._id,
        time: new Date.now(),
    }
} )



app.listen(3001, () => console.log('Server started on 3000'))