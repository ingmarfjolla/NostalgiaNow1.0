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
import "../styles/popularList.css";
import AppNavbar from "../AppNavbar";
import Song from "./song";
import Game from "./game";
import Movie from "./movie";
import Show from "./show";
import Book from "./book";

function PopularList() {
  const [popularList, setPopularList] = useState([]);
  let { username } = useParams();

  useEffect(() => {
    const getPopularList = async () => {
      const results = await axios.get(`/api/users/popularList/${username}`);

      let popularList = results.data.result;
      console.log(popularList);
      setPopularList(popularList);
      //console.log(myList);
    };

    getPopularList();
    console.log("Effect has been run");
  }, []);

  return (
    <div className="popularList-background">
      <AppNavbar />
      <div className="title-background">
        <h1 style={{ textAlign: "center", fontSize: 50 }}>
          Most Liked Nostalgic Items This Week
        </h1>
      </div>

      {/* Songs Collection */}
      <h1 style={{ textAlign: "center" }}>Most Popular Songs</h1>
      <CardGroup>
        {popularList
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
      <h1 style={{ textAlign: "center" }}>Most Popular Games</h1>
      <CardGroup>
        {popularList
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
      <h1 style={{ textAlign: "center" }}>Most Popular Shows</h1>
      <CardGroup>
        {popularList
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

      {/* Movies Collection */}
      <h1 style={{ textAlign: "center" }}>Most Popular Movies</h1>
      <CardGroup>
        {popularList
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
      
      {/* Books Collection */}
      <h1 style={{textAlign: "center"}}>Most Popular Books</h1>
      <CardGroup>
        {popularList
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
              url = {book.amazonUrl}
              img ={book.image}
               />

              </div>
            );
          })}
      </CardGroup>
    </div>
  );
}

export default PopularList;