const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    aid: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    qid:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    uid:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    uname:{
        type: String,
        required: true,
    }
})

const User = mongoose.model('Answer', Schema)
module.exports = Answer