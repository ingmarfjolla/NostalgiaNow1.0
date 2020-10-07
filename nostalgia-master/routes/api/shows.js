const express = require("express");
const router = express.Router();

const User = require("../../models/User");      // Bring in the User model
const Show = require("../../models/Shows");     // Bring in the Shows model

// @route GET api/songs
// @desc  Get all songs
// @access Public
router.get("/", async (req, res) => {
    let showz = await Show.find().sort( {Year: "desc"} );
    res.json(showz);
});

// When a user, from the client show.js page, wants to add a show to their likes array
// They will end up on this route (api/shows/addShow/:user/:id)
router.post("/addShow/:user/:id",  function (req, res){
	let user = req.params.user;
	let request_id = req.params.id;

    // First parameter is the query (using an id) to find a specific show
	Show.findOne({_id: request_id}, function(err, foundShow){
		if(err){
			console.log(err);
        }
        // If we have found that show in the database
        else{
            let repeat = false;
            // First parameter is the query (using a username) to find a specific user
			User.findOne({username:user}, function(err, foundUser){
				if(err){
					console.log(err);
                }
                // If we have found a corresponding user in the database
                else{
                    // Make sure the show isn't already in its likes array
					foundUser.likes.map(item =>{
                        // If the show is found in the user's likes array, then set repeat to true
						if(item._id == request_id)
							repeat = true;
					});
                    
                    // Since the show is already present in their likes, there is no need to re-store it
					if(repeat==true){
						console.log("Repeat, this show is already in our likes array");
                    }
                    // The show is not present in the likes array, so add it
                    else{
						console.log("Not repeat, this show will be added");
						console.log(foundUser.likes);
                        console.log("new show added in array");
                        
                        let referenced_show = {
                            _id: foundShow._id,
                            title: foundShow.title,
                            type: foundShow.type
                        }
                        
                        // Push that show into their array
						foundUser.likes.push(referenced_show);
						foundUser.save();   // Save the changes
					}
				}
			});
		}
    });
	res.send("check");
});

// When a user, from the client shows.js page, wants to remove a show from their likes array
// They will end up on this route (api/shows/removeShow/:user/:id)
router.post("/removeShow/:user/:id", async function (req, res){
    let user = req.params.user;
    let request_id = req.params.id;

    console.log("removing was clicked");

    // First parameter: in the User collection, find the document with username the client provided in the URL parameters
    // Second parameter: the document is detected, handle it with a callback function
    User.findOne({username: user}, function(err, foundUser){
        // Document was not found
        if(err){
            console.log(err);
        }
        // Document was found
        else{
            let wasThereSomethingToRemove = false;     // Keep track if a user can actually remove something
            // Loop through a user's likes array to find the show object in their array they want to remove (query the show object with its _id)
            for(let i = 0; i < foundUser.likes.length; i++){
                // If the show the user wants to remove is also a song in their likes array
                if(foundUser.likes[i]._id == request_id){
                    // Take the last element, replace it with the element we want to remove
                    foundUser.likes[i] = foundUser.likes[foundUser.likes.length-1];
                    foundUser.likes.pop();      // Remove last element
                    wasThereSomethingToRemove = true;   // There was something to actually remove
                }
            }

            console.log(request_id + " was removed");
            // The user's like array was altered by removing a show, so save the new changes
            foundUser.save().then(user => console.log(user));
            // Send an OK response back to the client, and also whether there was something to remove or not
            res.status(200).send({result: wasThereSomethingToRemove});
        }
    })
    
    // Issue with using pull in an array of document: https://github.com/Automattic/mongoose/issues/1635
    // let result = await User.updateOne( {username: user}, {$pull: {likes: {artist : {request_artist}, title: {request_title} /*`ObjectId(${request_id})`*/}}}, {safe: true} );
    // console.log(result);
});

// When a user, from the client shows.js page, wants to like a show
// They will end up on this route (api/shows/likeShow/:user/:title)
router.get("/likeShow/:user/:id", async function (req, res){
    let username = req.params.user;
    let request_id = req.params.id;
    
    // updateOne first parameter is document we want to find, second parameter is the changes we want to make
    let result =await Show.updateOne(     // $ne means if the username is not equal to any element in usersWhoLike
        {_id: request_id, usersWhoLike: { $ne: username }},             // Query: find the document in the database with the id and username the client provided
        {$inc: { likeCount: 1 }, $push: { usersWhoLike: username }} );  // Change: change that found song document's total likes and push the username to the array of users who liked the song
    
    // Seeing if anything was found AND modified
    console.log("Number of documents matched: " + result.n);
    console.log("Number of documents modified: " + result.nModified);

    // If a show's likeCount was modified/incremented, that means the user never liked it before
    if(result.nModified > 0){
        res.status(200).send({result: false});
    }

    // If a show's likeCount was not modified/incremented, that means the user liked it before and should not spam
    else{
        res.status(200).send({result: true});
    }
})

// When a user, from the client show.js page, wants to unlike a song
// They will end up on this route (api/shows/unlikeShow/:user/:title)
router.get("/unlikeShow/:user/:id", async function (req, res){
    let username = req.params.user;
    let request_id = req.params.id;
    
    // updateOne first parameter is document we want to find, second parameter is the changes we want to make
    let result = await Show.updateOne(
        {_id: request_id, usersWhoLike: username },
        {$inc: { likeCount: -1 }, $pull: { usersWhoLike: username }} );
    
    console.log("Number of documents matched: " + result.n);
    console.log("Number of documents modified: " + result.nModified);
    
    // If a show's likeCount was modified/decremented, that means the user never disliked it before
    if(result.nModified > 0){
        res.status(200).send({result: false});
    }
    
    // If a shows's likeCount was not modified/decremented, that means the user never liked it in the first place
    else{
        res.status(200).send({result: true});
    }
})




module.exports = router;