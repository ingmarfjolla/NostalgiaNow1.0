const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// Bring in the User Model
var authen = false;
var alreadyRegister=false;
const User = require("../../models/User");
const Song = require("../../models/Song");
const Game = require("../../models/Games");
const Movie = require("../../models/Movies");
const Show = require("../../models/Shows");
const Book = require("../../models/Books");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.post("/authen/:username", async (req, res) => {
  let userN = req.params.username;
  console.log(userN);
  if (authen === false) {
    res.send(authen);
  } else {
    User.findOne({ username: userN }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundUser);
        if (foundUser) res.json(foundUser);
      }
    });
  }
});

// When a user, from any page, wants to completely log out of their account
// Their GET request will end up on this route (ap/users/logout)
router.post("/logout", function (req, res) {
  req.logout();
  authen = false;
  alreadyRegister=false;
  req.session.destroy(function (err) {
    res.clearCookie("connect.sid");
    console.log("You have been logged out");
    return res.redirect("/");
  });
  // req.logout();
  // console.log("You have been logged out");
  // authen = false;
  // return res.redirect("/");
});

// When a user, from login.js, wants to enter their credentials to authenticate themselves and access their account
// Their POST request will end up on this route (ap/users/login)
router.post("/login", function (req, res) {
  console.log("yes");

  // Create a new User by instantiating a new mongoose User object
  let newUser = new User({
    username: req.body.username, // Capture the client/request's input of username and store it in the User object
    password: req.body.password, // Capture the client/request's input of password and store it in the User object
  });

  // console.log(userN);

  // Use the login function provided by passport, must be called on the req object
  // First parameter is the user that is trying to login, second parameter is a callback
  req.login(newUser, function (err) {
    // If we are unable to find the user in our database
    if (err) {
      console.log(err);
    }
    // If we are able to find the user in our database
    else {
      // Let us authenticate a user using the local strategy
      passport.authenticate("local")(req, res, function () {
        authen = true;
        // If we have successfully authenticated the client
        if (req.isAuthenticated()) {
          console.log("You are authenticated");
          return res.redirect("/home/" + req.body.username);
        } else {
          console.log("You are NOT authenticated");
        }
      });
    }
  });
});

// When a user, from signup.js, wants to register to our website for the first time
// Their POST request will end up on this route (api/users/register)
router.post("/register", function (req, res) {
  // Create a new User by instantiating a new mongoose User object
  let newUser = new User({
    username: req.body.username, // Capture the client/request's input of username and store it in the User object
    // password: req.body.password, // Capture the client/request's input of password and store it in the User object
  });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      alreadyRegister=true;
      return res.redirect("/signup");
    } else {
      passport.authenticate("local")(req, res, function () {
        if (req.isAuthenticated()) {
          console.log("You are authenticated");
          authen = true;
          return res.redirect("/home/" + req.body.username);
        } else {
          console.log("You are NOT authenticated");
        }
      });
    }
  });
});

router.get("/check", async (req, res) => {
  console.log(alreadyRegister);
    res.send(alreadyRegister);

  });

// When
router.get("/myList/:username", async (req, res) => {
  let query_username = req.params.username;
  let recent_data_items = [];

  console.log("This is the username: " + query_username);

  await User.findOne({ username: query_username }, async (err, found_user) => {
    console.log(found_user);
    let favorites = found_user.likes;


	console.log("size of my favorites: " + favorites.length);
    for (let i = 0; i <= favorites.length; i++) {

      if (i < favorites.length) {
		// Finding the matching song
        if (favorites[i].type == "Song") {
		  let foundSong = await Song.findOne({ _id: favorites[i]._id })
		  recent_data_items.push(foundSong);
		}
		// Finding the matching game
		else if (favorites[i].type == "Game") {
			let foundGame = await Game.findOne({ _id: favorites[i]._id })
			recent_data_items.push(foundGame);
		  }
		
		// Finding the matching movie
		else if (favorites[i].type == "Movie") {
		let foundMovie = await Movie.findOne({ _id: favorites[i]._id })
		recent_data_items.push(foundMovie);
		}

		// Finding the matching show
		else if (favorites[i].type == "Show") {
			let foundShow = await Show.findOne({ _id: favorites[i]._id })
			recent_data_items.push(foundShow);
			}
		
		// Finding the matching book
		else if (favorites[i].type == "Book") {
			let foundBook = await Book.findOne({ _id: favorites[i]._id })
			recent_data_items.push(foundBook);
			}
	  }
	  
	  else if (i == favorites.length) {
		console.log(recent_data_items);
        res.send({result: recent_data_items});
      }
    }
  });
});

// Popular
router.get("/popularList/:username", async (req, res) => {
	let query_username = req.params.username;
  
	console.log("This is the username: " + query_username);

	let song_result = await Song.find().sort({likeCount: "desc"}).limit(10);
	console.log(song_result);

	let game_result = await Game.find().sort({likeCount: "desc"}).limit(10);
	console.log(game_result);

	let movie_result = await Movie.find().sort({likeCount: "desc"}).limit(10);
	console.log(movie_result);

	let show_result = await Show.find().sort({likeCount: "desc"}).limit(10);
	console.log(show_result);

	let book_result = await Book.find().sort({likeCount: "desc"}).limit(10);
	console.log(book_result);

	let popular_data_items = song_result.concat(game_result, movie_result, show_result, book_result)
	res.send({result: popular_data_items});
  });



// Whether a user has successfully registered or logged in using the right credentials, then
// passport.authenticate will send a cookie and tell the browser to hold onto tha cookie because
// the cookie has a few pieces of information that tells our server about the user, namely that they
// are authorized to view any of the pages that require authentication

// The content of the cookie holds meaning to the server because the server can
// check against the content of the cookie and know that the current user is already signed in, so we
// don't have to tell them to sign in again
module.exports = router;