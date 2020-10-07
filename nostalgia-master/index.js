const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cron = require("node-cron");
const { getChart } = require("billboard-top-100");
const scrapeYoutube = require("scrape-yt");

//for user
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// IMPORT MODELS
require("./models/Product");

// import routes
const songs = require("./routes/api/songs");
const books = require("./routes/api/books");
const games = require("./routes/api/games");
const movies = require("./routes/api/movies");
const shows = require("./routes/api/shows");
const users = require("./routes/api/users");

// Import all database models
const Song = require("./models/Song");
const Games = require("./models/Games");
const Books = require("./models/Books");
const Movies = require("./models/Movies");
const Shows = require("./models/Shows");

// const users = require('./routes/api/users');
const app = express();
// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------------------------------------------------------------------***************
//for user
app.use(
  session({
    //use session packeage with initial configuration
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize()); //use passport and initalize it
app.use(passport.session()); //set up session
// ----------------------------------------------------------------------------------****************

// Database configuration
const db = require("./config/keys").mongoURI;

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// passport
mongoose.set("useCreateIndex", true);

// Use Routes
app.use("/api/songs", songs); // Any request that goes to /api/songs should refer to songs variables (another filepath)
app.use("/api/users", users);
app.use("/api/books", books); //any request to api/books will refer to the books variable
app.use("/api/games", games);
app.use("/api/movies", movies);
app.use("/api/shows", shows);

// mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || "");

// -----------------------------------Responsible for deleting current collections every sunday---------------------------------------------
// Run this function on 12:01 A.M. on a Sunday
cron.schedule("1 0 * * Sunday", async () => {
  console.log("cleaning db ");
  Song.deleteMany({}, function(err) {
    console.log('collection removed')
  });
  Games.deleteMany({}, function(err) {
    console.log('collection removed')
  });
  Books.deleteMany({}, function(err) {
    console.log('collection removed')
  });
  Movies.deleteMany({}, function(err) {
    console.log('collection removed')
  });
  Shows.deleteMany({}, function(err) {
    console.log('collection removed')
  });
  const res = await User.updateMany({}, { likes: [] });
  console.log(res);
});
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------API Calls to Billboard and Youtube to Populate Database--------------------------------------------------------------------------------------
// Run this function on 12:05 A.M. on a Sunday
cron.schedule("5 0 * * Sunday", () => {
  console.log("running a task when the minute is 17");

  async function addSong(title, artist, coverImage, dateOnChart, yearOnChart,rank) {

    // // Making sure the search actually returned somethng
    const maxRetryCount = 5;

    var retryCount = 1;
    var results = [];

    while (results.length == 0 && retryCount < maxRetryCount) {
      results = await scrapeYoutube.search(
        artist + " " + title + " " + "official music video"
      );
      retryCount++;
    }
    // //   End of makng sure search returned something

    //console.log(results);
    let videoURLId = results[0].id;
    let image = results[0].thumbnail;

    const newSong = new Song({
      title: title,
      artist: artist,
      coverImage: image,
      videoId: videoURLId,
      dateOnChart: dateOnChart,
      yearOnChart: yearOnChart.split("-")[0],
      rank: rank,
      type: "Song",
      likeCount: 0,
      usersWhoLike: [],
    });

    newSong.save().then((song) => console.log(song));
  }

  // Get today's date dynamically
  let todays_date = new Date().toISOString().substring(0, 10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];

  // Looping through the years 2001 to 2011
  for (let year = 2000; year <= 2011; year++) {
    // Making the date in YYYY-MM-DD format
    let resolved_date = `${year}` + "-" + todays_month + "-" + todays_day;
    //console.log(resolved_date);
    // getChart using resolved_date
    getChart("hot-100", resolved_date, (err, chart) => {
      if (err) console.log(err);

      // First 20 for every year get the best songs
      for (let i = 0; i < 20; i++) {
        //console.log(chart.songs[i]);
        addSong(
          chart.songs[i].title,
          chart.songs[i].artist,
          chart.songs[i].cover,
          chart.week,
          chart.week,
          chart.songs[i].rank
        );
      }
    });
  }
});
// //-----------------------------------------------------------------------------------------------------------------------

// //*****************************************************************************************************************************************************

// // //---------------------------------------STUFF FOR GAMES-----------------------------------------------------
// //
async function addGame(name, release_date, coverImage, rating){
  // Making sure the search actually returned somethng
    const maxRetryCount = 5;

    let retryCount = 1;
    let results = [];

    while(results.length == 0 && retryCount < maxRetryCount){
        results = await scrapeYoutube.search(name + " " + "video game gameplay");
        retryCount++;
    }
//   End of makng sure search returned something

   let videoId = results[0].id;
   let image = results[0].thumbnail;
    
    const newGame = new Games({
        name: name,
        release_date: release_date,
        image: image,
        rating: rating,
        videoId: videoId,
        year:release_date.split("-")[0],
        type: "Game",
        likeCount: 0,
        usersWhoLike: []
      });

      newGame.save().then(song => console.log(song));
};

// // // // game function -------------------------------------------------------------------------------
// Run this function on 12:10 A.M. on a Sunday
cron.schedule('10 0 * * Sunday', () => {
console.log('lets do the game database');
let todays_date = new Date().toISOString().substring(0,10);
let splitted_dates = todays_date.split("-");
let todays_month = splitted_dates[1];
let todays_day = splitted_dates[2];
let next_dat = +todays_day + +6;
let nextthing = next_dat.toString();
for(let year = 1990;year<=2011;year++)
{
  
  let firstdate = year.toString()+'-'+todays_month+'-'+todays_day;
  let nextdate = year.toString()+'-'+todays_month+'-'+nextthing;
  console.log(firstdate);
  // https://api.rawg.io/api/games?ordering=-rating&dates=2007-11-05,2007-11-11
  axios.get('https://api.rawg.io/api/games?ordering=-rating&dates='+firstdate+','+nextdate+'')
    .then(response =>
      {
        for(let i = 0; i <20; i++)
        {
          if(typeof response.data.results[i].name == "undefined"){
            continue;
          }

          else{
            addGame(response.data.results[i].name,response.data.results[i].released,response.data.results[i].background_image,response.data.results[i].rating);
          }
        }


    })
    .catch(error => {
      console.log(error);
    });
}
});
// // game function -------------------------------------------------------------------------------

// //*****************************************************************************************************************************************************

// //---------------------------------------book function ---------------------------------------
// //

function addBook(rank,title,description,image,amazonurl,genrez,authorz)
{
  const newBook = new Books({
    rank: rank,
    title: title,
    description: description,
    image: image,
    amazonUrl: amazonurl,
    genre:genrez,
    author:authorz, 
    type: "Book",
    likeCount: 0,
    usersWhoLike: []
  });
  newBook.save().then(beok=>console.log(beok));

};
// // //
// // // //---------------------------------------book function ---------------------------------------
// // // //---------------------------------------fiction hard book function ---------------------------------------
// // Run this function on 12:13 A.M. on a Sunday
cron.schedule('13 0 * * Sunday', () => {
  let todays_date = new Date().toISOString().substring(0,10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];
  let next_dat = +todays_day + +6;
  let nextthing = next_dat.toString();
  //let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
  console.log('running fiction book');
  for(var y = 2009;y<=2015;y++)
  {
    let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
    axios.get('https://api.nytimes.com/svc/books/v3/lists/'+firstdate+'/hardcover-fiction.json?api-key=xeUxPFrTYSAr1FRwcAm2XXHIoEt6MAFz')
        .then(response =>
          {
            for(var i =0;i<15;i++)
            {
              // response.data.results.books[i].rank
              // response.data.results.books[i].title
              // response.data.results.books[i].description
              // response.data.results.books[i].book_image
              // response.data.results.books[i].amazon_product_url
              addBook(response.data.results.books[i].rank,response.data.results.books[i].title,response.data.results.books[i].description,response.data.results.books[i].book_image,response.data.results.books[i].amazon_product_url,"fiction",response.data.results.books[i].author);

              // console.log(response.)
            }


            //console.log(response.data.results.books[0]);

        })
        .catch(error => {
          console.log(error);
       });
  }
  
});

// // // //
// // // //--------------------------------------- fiction hard book function ---------------------------------------

// // // //--------------------------------------- nonfiction hard book function ---------------------------------------
// // Run this function on 12:15 A.M. on a Sunday
cron.schedule('15 0 * * Sunday', () => {
  console.log('running a nonfiction');
  let todays_date = new Date().toISOString().substring(0,10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];
  let next_dat = +todays_day + +6;
  let nextthing = next_dat.toString();
  //let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
  for(var g = 2009;g<=2015;g++)
  {
    let firstdate = g.toString()+'-'+todays_month+'-'+todays_day;
    axios.get('https://api.nytimes.com/svc/books/v3/lists/'+firstdate+'/hardcover-nonfiction.json?api-key=xeUxPFrTYSAr1FRwcAm2XXHIoEt6MAFz')
    .then(response =>
    {
      for(var i =0;i<15;i++)
      {
        // response.data.results.books[i].rank
        // response.data.results.books[i].title
        // response.data.results.books[i].description
        // response.data.results.books[i].book_image
        // response.data.results.books[i].amazon_product_url
        addBook(response.data.results.books[i].rank,response.data.results.books[i].title,response.data.results.books[i].description,response.data.results.books[i].book_image,response.data.results.books[i].amazon_product_url,"non fiction",response.data.results.books[i].author);

        // console.log(response.)
      }


      //console.log(response.data.results.books[0]);

  })
  .catch(error => {
    console.log(error);
  });
  }
  
});

// // // //--------------------------------------- nonfiction hard book function ---------------------------------------

// // // //--------------------------------------- picture books function  kid stuff ---------------------------------------
// // Run this function on 12:17 A.M. on a Sunday
cron.schedule('17 0 * * Sunday', () => {
  console.log('running a task every minute');
  let todays_date = new Date().toISOString().substring(0,10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];
  let next_dat = +todays_day + +6;
  let nextthing = next_dat.toString();
  //let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
  for(var yearz = 2009; yearz<=2015;yearz++)
  {
    let firstdate = yearz.toString()+'-'+todays_month+'-'+todays_day;
    axios.get('https://api.nytimes.com/svc/books/v3/lists/'+firstdate+'/picture-books.json?api-key=xeUxPFrTYSAr1FRwcAm2XXHIoEt6MAFz')
    .then(response => {
    for (var i = 0; i < 10; i++)
    {
      // response.data.results.books[i].rank
      // response.data.results.books[i].title
      // response.data.results.books[i].description
      // response.data.results.books[i].book_image
      // response.data.results.books[i].amazon_product_url
      addBook(response.data.results.books[i].rank,response.data.results.books[i].title,response.data.results.books[i].description,response.data.results.books[i].book_image,response.data.results.books[i].amazon_product_url,"kids books",response.data.results.books[i].author);
      //console.log(response.data.results.books[i].rank);
      // console.log(response.)
    }


    //console.log(response.data.results.books[0]);
  })
  .catch(error => {
    console.log(error);
  });
  }

});


// // //   //--------------------------------------- picture books function  kid stuff ---------------------------------------
// // //*****************************************************************************************************************************************************


// // // //--------------------------------------- young adult books function  kid stuff ---------------------------------------
// Run this function on 12:20 A.M. on a Sunday
cron.schedule('20 0 * * Sunday', () => {
  console.log('running a task every minute');
  let todays_date = new Date().toISOString().substring(0,10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];
  let next_dat = +todays_day + +6;
  let nextthing = next_dat.toString();
  //let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
  for(var yearz = 2009; yearz<=2015;yearz++)
  {
    let firstdate = yearz.toString()+'-'+todays_month+'-'+todays_day;
    axios.get('https://api.nytimes.com/svc/books/v3/lists/'+firstdate+'/series-books.json?api-key=xeUxPFrTYSAr1FRwcAm2XXHIoEt6MAFz')
    .then(response => {
    for (var i = 0; i < 10; i++)
    {
      // response.data.results.books[i].rank
      // response.data.results.books[i].title
      // response.data.results.books[i].description
      // response.data.results.books[i].book_image
      // response.data.results.books[i].amazon_product_url
      addBook(response.data.results.books[i].rank,response.data.results.books[i].title,response.data.results.books[i].description,response.data.results.books[i].book_image,response.data.results.books[i].amazon_product_url,"series books",response.data.results.books[i].author);
      //console.log(response.data.results.books[i].rank);
      // console.log(response.)
    }


    //console.log(response.data.results.books[0]);
  })
  .catch(error => {
    console.log(error);
  });
  }

});


////young adult

// //*****************************************************************************************************************************************************

// //--------------------------------------Movie API Funcitonality--------------------------------------------------------------
// // //this returns the genre cuz genre is an array with ids gotta convert em
async function getGenre(arr)
{
  var ireturnthis="";
  for(var i=0;i<arr.length;i++)
  {
    if(arr[i]==28)
    {
      ireturnthis+="Action "
    }
    else if (arr[i]==12)
    {
      ireturnthis+= "Adventure "
    }
    else if (arr[i]==16)
    {
      ireturnthis+= "Animation "
    }
    else if (arr[i]==35)
    {
      ireturnthis+= "Comedy "
    }
    else if (arr[i]==80)
    {
      ireturnthis+= "Crime "
    }
    else if (arr[i]==99)
    {
      ireturnthis+= "Documentary "
    }
    else if (arr[i]==18)
    {
      ireturnthis+="Drama "
    }
    else if (arr[i]==10751)
    {
      ireturnthis+= "Family "
    }
    else if (arr[i]==14)
    {
      ireturnthis+= "Fantasy "
    }
    else if (arr[i]==36)
    {
      ireturnthis+= "History "
    }
    else if (arr[i]==27)
    {
      ireturnthis+= "Horror "
    }
    else if (arr[i]==10402)
    {
      ireturnthis+= "Music "
    }
    else if (arr[i]==9648)
    {
      ireturnthis+= "Mystery "
    }
    else if (arr[i]==10749)
    {
      ireturnthis+="Romance "
    }
    else if (arr[i]==878)
    {
      ireturnthis+="Science Fiction "
    }
    else if (arr[i]==10770)
    {
      ireturnthis+= "TV Movie "
    }
    else if (arr[i]==53)
    {
      ireturnthis+="Thriller "
    }
    else if (arr[i]==10752)
    {
      ireturnthis+= "War "
    }
    else if (arr[i]==37)
    {
      ireturnthis+="Western "
    }
  }
  return ireturnthis
}
//
async function addMovie(title,release,image,description,genre)
{

  // // Making sure the search actually returned somethng
    const maxRetryCount = 5;

    var retryCount = 1;
    var results = [];

    while(results.length == 0 && retryCount < maxRetryCount){
        results = await scrapeYoutube.search(title + " "+"trailer");
        retryCount++;
    }
//   //   End of makng sure search returned something

  let videoId = results[0].id;
  let genreting = await getGenre(genre);
  image = "https://image.tmdb.org/t/p/original/" + image;
  if(image == "https://image.tmdb.org/t/p/original/null")
  {
    image = results[0].thumbnail;
  }

  const newMovie = new Movies({
    title: title,
    release_date: release,
    image: image,
    description: description,
    genre:genreting,
    video: videoId,
    year:release.split("-")[0],
    type: "Movie",
    likeCount: 0,
    usersWhoLike: []
  });
  newMovie.save().then(moviez=>console.log(moviez));
}
// //
// // //---------------------------------------movie function ---------------------------------------
// //
// // //--------------------------------------- MOVIE DATABSE THINGS MOVIE THINGS ---------------------------------------
// // // Movie Database API Key: 219c752b1bd28c347bd087be9deb6add
// //

// Run this function on 12:22 A.M. on Sunday
cron.schedule('22 0 * * Sunday', () => {
  console.log('movies');
  let todays_date = new Date().toISOString().substring(0,10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];
  let next_dat = +todays_day + +6;
  let nextthing = next_dat.toString();
  //let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
  for(var r=1995;r<=2010;r++)
  {
    let firstdate = r.toString()+'-'+todays_month+'-'+todays_day;
    let secondate = r.toString()+'-'+todays_month+'-'+nextthing;
    const movieapikey = "https://api.themoviedb.org/3/discover/movie?api_key=219c752b1bd28c347bd087be9deb6add&language=en-US&region=US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&release_date.gte="+firstdate+"&release_date.lte="+secondate+""
    axios.get(movieapikey)
        .then(response =>
          {
              for(var i=0;i<20;i++)
              {
                // var disarr=response.data.results[i].genre_ids;
                // let genreting = getGenre(disarr);

                //title,release,image,description,genre
                //console.log(response.data.results[i].title)
                if(typeof response.data.results[i].title=="undefined")
                {
                  continue;
                }
                else{
                  //console.log(response.data.results[i].title)
                  addMovie(response.data.results[i].title,response.data.results[i].release_date,response.data.results[i].poster_path,response.data.results[i].overview,response.data.results[i].genre_ids)
                }
                //addMovie(response.data.results[i].title,response.data.results[i].release_date,response.data.results[i].poster_path,response.data.results[i].overview,response.data.results[i].genre_ids)  //,genreting)
                //console.log(response.data.results[i])  'https://image.tmdb.org/t/p/original/'+
              }




            //console.log(response.data.results.books[0]);

        })
        .catch(error => {
          console.log(error);
        });
    }  
  });
//       //--------------------------------------- MOVIE DATABSE THINGS MOVIE THINGS ---------------------------------------
//       //--------------------------------------- MOVIE DATABSE THINGS MOVIE THINGS ---------------------------------------
//       //--------------------------------------- MOVIE DATABSE THINGS MOVIE THINGS ---------------------------------------

// //*****************************************************************************************************************************************************

// // //---------------------------------------show function ---------------------------------------
// //
// //
async function getGenretwo(arr)
{
  var returning = ""
  for(var i = 0; i<arr.length;i++)
  {
    if(arr[i]==10759)
    {
      returning+= "Action & Adventure "
    }
    else if(arr[i]==16)
    {
      returning+= "Animation "
    }
    else if(arr[i]==35)
    {
      returning+= "Comedy "
    }
    else if(arr[i]==80)
    {
      returning+= "Crime "
    }
    else if(arr[i]==99)
    {
      returning+= "Documentary "
    }
    else if(arr[i]==18)
    {
      returning+= "Drama "
    }
    else if(arr[i]==10751)
    {
      returning+= "Family "
    }
    else if(arr[i]==10762)
    {
      returning+= "Kids "
    }
    else if(arr[i]==9648)
    {
      returning+= "Mystery "
    }
    else if(arr[i]==10763)
    {
      returning+= "News "
    }
    else if(arr[i]==10764)
    {
      returning+= "Reality "
    }
    else if(arr[i]==10765)
    {
      returning+= "Sci-Fi & Fantasy "
    }
    else if(arr[i]==10766)
    {
      returning+= "Soap "
    }
    else if(arr[i]==10767)
    {
      returning+= "Talk"
    }
    else if(arr[i]==10768)
    {
      returning+="War & Politics"
    }
    else if(arr[i]==37)
    {
      returning+="Western"
    }

  }
  return returning;
}

async function addShow(title,release,image,description,genre)
{

  // Making sure the search actually returned somethng
    const maxRetryCount = 5;

    var retryCount = 1;
    var results = [];

    while(results.length == 0 && retryCount < maxRetryCount){
        results = await scrapeYoutube.search(title +" " + "trailer");
        retryCount++;
    }
    image = "https://image.tmdb.org/t/p/original/" + image;
    if(image == "https://image.tmdb.org/t/p/original/null")
    {
      image = results[0].thumbnail;
    }
  let videoId = results[0].id;  
  let genrez = await getGenretwo(genre);
  const newShow = new Shows({
    title: title,
    release_date: release,
    image: image,
    description: description,
    genre:genrez,
    video: videoId,
    year:release.split("-")[0],
    type: "Show",
    likeCount: 0,
    usersWhoLike: []
  });
  newShow.save().then(showz=>console.log(showz));

}
// // //---------------------------------------show function ---------------------------------------
// // //--------------------------------------- SHOW DATABSE THINGS SHOW THINGS ---------------------------------------
// // //--------------------------------------- SHOW DATABSE THINGS SHOW THINGS ---------------------------------------
// // //--------------------------------------- SHOW DATABSE THINGS SHOW THINGS ---------------------------------------
// //

// Run this function on 12:25 A.M. on Sunday
cron.schedule('25 0 * * Sunday', () => {
  console.log('running after books and movies and games');
  let todays_date = new Date().toISOString().substring(0,10);
  let splitted_dates = todays_date.split("-");
  let todays_month = splitted_dates[1];
  let todays_day = splitted_dates[2];
  let next_dat = +todays_day + +6;
  let nextthing = next_dat.toString();
  //let firstdate = y.toString()+'-'+todays_month+'-'+todays_day;
  for(var m=1999;m<=2010;m++)
    {
      let firstdate = m.toString()+'-'+todays_month+'-'+todays_day;
      let seconddate = m.toString()+'-'+todays_month+'-'+nextthing;
      const showapikey = "https://api.themoviedb.org/3/discover/tv?api_key=219c752b1bd28c347bd087be9deb6add&language=en-US&sort_by=popularity.desc&first_air_date.gte="+firstdate+ "&first_air_date.lte="+seconddate+"&page=1&timezone=America%2FNew_York&include_null_first_air_dates=false&with_original_language=en"
      axios.get(showapikey)
          .then(response =>
            {
                for(var s=0;s<10;s++)
                {

                  //console.log(response.data.results[s])
                  //title,release,image,description,genre
                  //console.log(response.data.results)
                  if(typeof response.data.results[s].name=="undefined")
                  {
                    continue;
                  }
                  else{
                    addShow(response.data.results[s].name,response.data.results[s].first_air_date,response.data.results[s].poster_path,
                    response.data.results[s].overview,response.data.results[s].genre_ids)
                  }
                  // addShow(response.data.results[s].name,response.data.results[s].first_air_date,response.data.results[s].poster_path,
                  // response.data.results[s].overview,response.data.results[s].genre_ids)
                }

          })
          .catch(error => {
            console.log(error);
          });
    }
});

//*****************************************************************************************************************************************************

//IMPORT ROUTES
require("./routes/productRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

// Youtube API Key: AIzaSyAAaHObzCPK3m7L04Iw5zewunADjJ1UxXQ
// Movie Database API Key: 219c752b1bd28c347bd087be9deb6add
// MongoDB password: Hunter10
// Quota info: https://developers.google.com/youtube/v3/getting-started#quota
