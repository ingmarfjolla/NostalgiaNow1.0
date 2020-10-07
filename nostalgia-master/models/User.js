const mongoose = require('mongoose');
// const session = require("express-session");
// const passport=require("passport");
const passportLocalMongoose =require("passport-local-mongoose");
const Schema = mongoose.Schema;

// Create schema
const userSchema = new Schema({
    username: String,
	password: String,
	likes:[]
});

// Add a plugin to the UserSchema
// passportLocalMongoose will help to hash and salt user passwords and to save users to the MongoDB database
userSchema.plugin(passportLocalMongoose); 

// "User" is the collection in our nostalgiaDB database
/* User is a constructor to make a new User document that will be inserted into the
User collection following the userSchema format*/
module.exports = User = mongoose.model("User", userSchema);


// Top 20 of the week