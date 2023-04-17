const mongoose = require("mongoose");


let postsChantier = mongoose.Schema({

    id: {
        type: String
    },
    title: {
        type: String
    },
    image: {
        type: [String]
    },
    format: {
        type: String
    },
    h2: {
        type: String
    },
    p: {
        type: String
    },
    vue: {
        type: Number,
        default:0
    },
    single_commentaire: {
        type: String
    },
    commentaire: {
        type:[String]
    },

    commentaire_array:[
        {
            single_commentaire:{
                type:String
            },
            user_id:{
                type:String
            },
            pseudo:{
                type:String
            },
        }
    ],
    like: {
        type:[String],
        default:0
    },
    date: {
        type: String,
        default: Date
    },


})


module.exports = mongoose.model('posts', postsChantier);