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
const Question = require('./model/Question');

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
    console.log(req.body)
    if(user) {
        const userDetails = await User.find({ email: user.email  });
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
    const { user } = req.user;
    const questionData = req.body;
    const questionBody = new Question({
        ...questionData,
        creatorName: user.name,
        creatorid: user._id,
    })
    questionBody.save()
    res.send(questionBody)

})

app.post('/question/:id/delete', authenticateJWT, async (req, res) => {
    const { user } = req.user
    const { id } = req.params

    console.log(updatedQuestion)

    const deletedData = await Question.deleteOne({_id: id, creatorid: user._id})
    if(deletedData){
        res.json(updateData)
    }
    else{
        res.send('Some Problem')
    }
})

app.put('/question/:id', authenticateJWT, async (req, res) => {
    const { user } = req.user
    const { id } = req.params
    const updatedQuestion = req.body;

    console.log(updatedQuestion)

    const updateData = await Question.updateOne({_id: id, creatorid: user._id}, updatedQuestion)
    if(updateData){
        res.json(updateData)
    }
    else{
        res.send('Some Problem')
    }
})



app.listen(3001, () => console.log('Server started on 3000'))