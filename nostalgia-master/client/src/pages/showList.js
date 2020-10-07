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

import Show from "./show"
import "../styles/show.css";

function ShowList()
{
    const[shows, setShows] = useState([]);
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
        1999
      ];
    
    useEffect(() => {
        const getShows = async () => {
            const results = await axios.get('/api/shows');
            let showList = results.data;
            console.log(showList);
            setShows(showList);
        };

        getShows();
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
  } else 
  {
    return (
      <div className="show-list-background">
        <AppNavbar />
        <div className="title-background">
          <h1 id="top" style={{ textAlign: "center", fontSize: 70 }}>
            Shows of the Past 30 Years
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
                <a href="#top">📺</a>{" "}
              </h1>
              <CardGroup>
                {shows
                  .filter((show) => show.year == year)
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
                        {/* url={song.url} /> */}
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

export default ShowList;