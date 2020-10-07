
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
//template is left hand and thats the type
const MovieSchema = new Schema({
    title: String,
    release_date: String,
    image: String,
    description: String,
    genre:String,
    video: String,
    year:String,
    type: String,
    likeCount: Number,
    usersWhoLike: []
});


module.exports = Movie = mongoose.model("Movie", MovieSchema);

// Top 20 of the week
// still need youtube url