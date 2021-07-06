const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    space: {
        type: String,
        required: true,
    },
    title:{
        type:String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    answer:{
        type:[mongoose.Schema.ObjectId],
        required: true
    },
    up:{
        type:[mongoose.Schema.ObjectId],
        required: true
    },
    creatorid:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    creatorName:{
        type:String,
        required: true
    }
},{
    timestamps: true
})

const Question = mongoose.model('Question', Schema)
module.exports = Question