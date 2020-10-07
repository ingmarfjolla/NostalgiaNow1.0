import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useParams } from "react-router";
import AppNavbar from "../AppNavbar";

import "../styles/movie.css";

import Movie from "./movie";

function MovieList() {
  const [movies, setMovies] = useState([]);

  const theYears = [
    2010,
    2009,
    2008,
    2007,
    2006,
    2005,
    2004,
    2003,
    2002,
    2001,
    2000,
    1999,
    1998,
    1997,
    1996,
    1995,
  ];

  useEffect(() => {
    const getMovies = async () => {
      const results = await axios.get("/api/movies");
      let movieList = results.data;
      console.log(movieList);
      setMovies(movieList);
    };

    getMovies();
    console.log("Effect has been run");
  }, []);

  //-----------------------------------------------------------------------------------------------
  // Check auten
  let { username } = useParams();

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
      <div className="movie-list-background">
        <AppNavbar />
        <div className="title-background">
          <h1 id="top" style={{ textAlign: "center", fontSize: 70 }}>
            Movies of the Past 20 Years
          </h1>
        </div>

        <div style={{ display: "inline-flex", margin: 20 }}>
          <h1>I miss the year...</h1>
          <DropdownButton id="dropdown-basic-button" title="YYYY">
            {theYears.map((year) => {
              return (
                <Dropdown.Item key={year} href={`#${year}`}>
                  {" "}
                  {year}{" "}
                </Dropdown.Item>
                /* <Button className="button-year" variant="dark" style={{margin: 20}}>{year}</Button> */
              );
            })}
          </DropdownButton>
        </div>

        {theYears.map((year) => {
          return (
            <div id={year}>
              <h1 className="year-heading">
                Take Me Back to <Badge variant="primary">{year}</Badge>{" "}
                <a href="#top">📼 </a>{" "}
              </h1>
              <CardGroup>
                {movies
                  .filter((movie) => movie.year == year)
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
            </div>
          );
        })}
      </div>
    );
  }
}

export default MovieList;