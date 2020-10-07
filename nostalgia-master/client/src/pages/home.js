import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";
import { Button } from "react-bootstrap";
import AppNavbar from "../AppNavbar";

import { useParams } from "react-router";
// SERVICES

function Home() {
  var { username } = useParams();
  const [answer, setAnswer] = useState("");
  var userN;

  useEffect(() => {
    const authen = async () => {
      const results = await axios.post("/api/users/authen/" + username);
      console.log("results:" + results.data);

      let p = new Promise((resolve, reject) => {
        userN = results.data;

        if (results.data === false) {
          reject("Fail");
        } else {
          resolve("sucess");
        }
      });
      p.then((message) => {
        let homepage = "/home/" + username;
        let aboutus = "/success/" + username;
        let check = "/check/" + username;
        let songList = "/songList/" + username;
        let gameList = "/gameList/" + username;
        let showList = "/showList/" + username;
        let movieList = "/movieList/" + username;

        setAnswer(
          <div className="homepage-background">
            <AppNavbar />
            <h1 className="introduce-user">
              Welcome To The Past, {userN.username}!
            </h1>

            <div id="nostalgia-choices">
              <div className="nostalgia-row">
                <div id="song-choice">
                  <Link to={songList}>
                    <h1 id="nostalgia-text">Songs</h1>
                  </Link>
                </div>

                <div id="tv-choice">
                  <Link to={showList}>
                    <h1 id="nostalgia-text">TV Shows</h1>
                  </Link>
                </div>
              </div>

              <div className="nostalgia-row">
                <div id="movie-choice">
                  <Link to={movieList}>
                    <h1 id="nostalgia-text">Movies</h1>
                  </Link>
                </div>

                <div id="game-choice">
                  <Link to={gameList}>
                    <h1 id="nostalgia-text">Games</h1>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }).catch((message) => {
        setAnswer(<Redirect to={"/error"} />);
      });
    };
    authen();
  }, []);

  return <div>{answer}</div>;
}

export default Home;
