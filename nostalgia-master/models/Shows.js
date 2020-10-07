const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
//template is left hand and thats the type
const ShowSchema = new Schema({
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


module.exports = Show = mongoose.model("Show", ShowSchema);

// Top 20 of the week
// sill need youtube url