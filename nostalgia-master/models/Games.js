const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
//template is left hand and thats the type
const GameSchema = new Schema({
    name: String,
    release_date: String,
    image: String,
    rating: String,
    videoId: String,
    year:String,
    type: String,
    likeCount: Number,
    usersWhoLike: []
});


module.exports = Game = mongoose.model("Game", GameSchema);

// Top 20 of the week
// still need youtube url