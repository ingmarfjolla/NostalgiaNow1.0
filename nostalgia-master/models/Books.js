const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
//template is left hand and thats the type
const BookSchema = new Schema({
    rank: String,
    title: String,
    description: String,
    image: String,
    amazonUrl: String,
    genre:String,
    author:String,
    type: String,
    likeCount: Number,
    usersWhoLike: []
});


module.exports = Book = mongoose.model("Book", BookSchema);