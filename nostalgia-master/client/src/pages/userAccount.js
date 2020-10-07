import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import CardGroup from "react-bootstrap/CardGroup";
import { useParams } from "react-router";
import "../styles/userAccount.css";
import AppNavbar from "../AppNavbar";
import Song from "./song";
import Game from "./game";
import Movie from "./movie";
import Show from "./show";
import Book from "./book";

function UserAccount() {
  const [myList, setMyList] = useState([]);
  let { username } = useParams();

  useEffect(() => {
    const getMyList = async () => {
      const results = await axios.get(`/api/users/myList/${username}`);

      let myReturnedList = results.data.result;
      console.log(myReturnedList);
      setMyList(myReturnedList);
      //console.log(myList);
    };

    getMyList();
    console.log("Effect has been run");
  }, []);

  //-----------------------------------------------------------------------------------------------
  // Check auten
  // let { username } = useParams();

  // const [answer, setAnswer]= useState("");
  // var homepage= "/home/username/"+username;
  // var aboutus= "/success/"+username;
  // var check= "/check/"+username;
  // var songList= "/songList/"+username;

  const [ui, setui] = useState("");
  let userN;

  useEffect(() => {
    const authen = async () => {
      const results = await axios.post("/api/users/authen/" + username);
      console.log("results:" + results.data);

      let p = new Promise((resolve, reject) => {
        if (results.data === false) {
          reject("Fail");
        } else {
          userN = results.data;
          setui(results.data);
          resolve("sucess");
        }
      });
      p.then((message) => {}).catch((message) => {});
    };
    authen();
  }, []);
  //--------------------------------------------------------------------------------------------------------------------

  function redirect() {
    return <Redirect to={"/error"} />;
  }
  if (ui === "") {
    return <div>{redirect}</div>;
  } else {
    return (
      <div className="userAccount-background">
        <AppNavbar />
        <div className="title-background">
          <h1 style={{ textAlign: "center", fontSize: 50 }}>
            What were you nostalgic about this week, {username}?
          </h1>
        </div>
        {/* Songs Collection */}
        <h1 style={{ textAlign: "center" }}>Your Songs</h1>
        <CardGroup>
          {myList
            .filter((listItem) => listItem.type == "Song")
            .map((song) => {
              return (
                <div style={{ marginBottom: 19 }}>
                  <Song
                    key={song._id}
                    id={song._id}
                    title={song.title}
                    artist={song.artist}
                    img={song.coverImage}
                    rank={song.rank}
                    year={song.yearOnChart}
                    current_user={username}
                    likes={song.likeCount}
                    //url = { "https://en.wikipedia.org/wiki/Boom Boom Pow"}
                    url={`https://www.youtube.com/embed/${song.videoId}`}
                  />
                  {/* url={song.url} /> */}
                </div>
              );
            })}
        </CardGroup>
        {/* Games Collection */}
        <h1 style={{ textAlign: "center" }}>Your Games</h1>
        <CardGroup>
          {myList
            .filter((listItem) => listItem.type === "Game")
            .map((game) => {
              return (
                <div style={{ marginBottom: 19 }}>
                  <Game
                    key={game._id}
                    id={game._id}
                    title={game.name}
                    img={game.image}
                    release_date={game.release_date}
                    year={game.year}
                    current_user={username}
                    likes={game.likeCount}
                    url={`https://www.youtube.com/embed/${game.videoId}`}
                  />
                  {/* url={song.url} /> */}
                </div>
              );
            })}
        </CardGroup>
        {/* Shows Collection */}
        <h1 style={{ textAlign: "center" }}>Your Shows</h1>
        <CardGroup>
          {myList
            .filter((listItem) => listItem.type === "Show")
            .map((show) => {
              return (
                <div style={{ marginBottom: 19 }}>
                  <Show
                    key={show._id}
                    id={show._id}
                    descript={show.description}
                    title={show.title}
                    genre={show.genre}
                    img={show.image}
                    rank={show.title}
                    year={show.year}
                    release_date={show.release_date}
                    current_user={username}
                    url={`https://www.youtube.com/embed/${show.video}`}
                    likes={show.likeCount}
                  />
                </div>
              );
            })}
        </CardGroup>
        <h1 style={{ textAlign: "center" }}>Your Movies</h1>
        <CardGroup>
          {myList
            .filter((listItem) => listItem.type === "Movie")
            .map((movie) => {
              return (
                <div style={{ marginBottom: 19 }}>
                  <Movie
                    key={movie._id}
                    id={movie._id}
                    descript={movie.description}
                    title={movie.title}
                    genre={movie.genre}
                    img={movie.image}
                    release_date={movie.release_date}
                    year={movie.year}
                    current_user={username}
                    url={`https://www.youtube.com/embed/${movie.video}`}
                    likes={movie.likeCount}
                  />
                </div>
              );
            })}
        </CardGroup>
        );
        <h1 style={{ textAlign: "center" }}>Your Books</h1>
        <CardGroup>
          {myList
            .filter((listItem) => listItem.type === "Book")
            .map((book) => {
              return (
                <div style={{ marginBottom: 19 }}>
                  <Book
                    key={book._id}
                    id={book._id}
                    current_user={username}
                    likes={book.likeCount}
                    descript={book.description}
                    title={book.title}
                    author={book.author}
                    url={book.amazonUrl}
                    img={book.image}
                  />
                </div>
              );
            })}
        </CardGroup>
      </div>
    );
  }
}

export default UserAccount;
