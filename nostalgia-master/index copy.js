const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');
const { getChart } = require('billboard-top-100');

// IMPORT MODELS
require('./models/Product');
const songs = require('./routes/api/songs');
// Bring in the Song Model
const Song = require("./models/Song");

const app = express();
// Bodyparser Middleware
app.use(bodyParser.json());
// Database configuration
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Use Routes 
app.use("/api/songs", songs)    // Any request that goes to /api/songs should refer to songs variables (another filepath)

// mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || "");

//-----------------------API Calls to Billboard and Youtube to Populate Database--------------------------------------------------------------------------------------
const api_key = "AIzaSyAAaHObzCPK3m7L04Iw5zewunADjJ1UxXQ";
async function getUniqueVideoID(artist_name, song_title){

  let videoid = await axios({
    method:'get',
    baseURL: 'https://www.googleapis.com/youtube/v3/search',
    params:{
      key: api_key,
      q: artist_name + " " + song_title,
      part: "snippet",
      maxResults: 1,
      type: "video",
      videoEmbeddable: true
    }
  }).then(function(response){
    //console.log(response.data.items[0].id.videoId);
    return response.data.items[0].id.videoId;
  }).catch(function(error){
    console.log(error);
  });

  return videoid;
};

async function addSong(title, artist, coverImage, dateOnChart, yearOnChart, rank){
    let videoId = await getUniqueVideoID(artist, title);

      const newSong = new Song({
          title: title,
          artist: artist,
          coverImage: coverImage,
          url: videoId,
          dateOnChart: dateOnChart,
          yearOnChart: yearOnChart.split("-")[0],
          rank: rank
        });

        newSong.save().then(song => console.log(song));
}

for(var year = 2000; year <= 2001; year++){
  getChart('hot-100', `${year}-12-09`, (err, chart) => {
    if (err) console.log(err);

    // First 20 for every year get the best songs
    for(let i = 0; i < 10; i++){
      addSong(chart.songs[i].title, chart.songs[i].artist, chart.songs[i].cover, chart.week, chart.week, chart.songs[i].rank);
    }
  });
};

//-----------------------------------------------------------------------------------------------------------------------
    
//--------------------------Scheduler Function will be implemented later-----------------------------
// URL for npm documentation: https://www.npmjs.com/package/node-cron
// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });


//------------------------------------------------------


//IMPORT ROUTES
require('./routes/productRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })

}



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});

// Youtube API Key: AIzaSyAAaHObzCPK3m7L04Iw5zewunADjJ1UxXQ
// Youtube API Info: https://dev.to/aveb/making-your-first-get-request-to-youtube-search-api-4c2f
// Movie Database API Key: 219c752b1bd28c347bd087be9deb6add
// MongoDB password: Hunter10
// Quota info: https://developers.google.com/youtube/v3/getting-started#quota