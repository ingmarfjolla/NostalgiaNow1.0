import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Game from "./game";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useParams } from "react-router";
import AppNavbar from "../AppNavbar";
import "../styles/game.css";

function GameList() {
  const [games, setGames] = useState([]);
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
    1994,
    1993,
    1992,
    1991,
    1990,
  ];

  useEffect(() => {
    const getGames = async () => {
      const results = await axios.get("/api/games");
      let gameList = results.data;
      console.log(gameList);
      setGames(gameList);
    };

    getGames();
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
      <div id="game-background">
      <AppNavbar />
        <div>
          <h1 id="top" style={{ textAlign: "center", fontSize: 70 }}>
            Games of the Past 20 Years
          </h1>
        </div>

        <div style={{ display: "inline-flex", margin: 20 }}>
          <h1>I miss the year...</h1>
          <DropdownButton
            id="dropdown-basic-button"
            variant="dark"
            title="YYYY"
          >
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
                Take Me Back to <Badge variant="dark">{year}</Badge>{" "}
                <a href="#top"> 🎮</a>
              </h1>
              <CardGroup>
                {games
                  .filter((game) => game.year == year)
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

export default GameList;
