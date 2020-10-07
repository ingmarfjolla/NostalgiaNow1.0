const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const SongSchema = new Schema({
    title: String,
    artist: String,
    coverImage: String,
    videoId: String,
    dateOnChart: String,
    yearOnChart: Number,
    rank: Number,
    type: String,
    likeCount: Number,
    usersWhoLike: []
});

// "Song" is the collection in our nostalgiaDB database
/* Song is a constructor to make a new Song document that will be inserted into the
Song collection following the SongSchema format*/
module.exports = Song = mongoose.model("Song", SongSchema);

// Top 20 of the week