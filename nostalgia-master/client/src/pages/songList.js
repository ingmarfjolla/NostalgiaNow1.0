import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useParams } from "react-router";
import AppNavbar from '../AppNavbar';
import "../styles/song.css";

import Song from "./song";

function SongList() {
  const [songs, setSongs] = useState([]);

  const theYears = [
    2011,
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
  ];

  useEffect(() => {
    const getSongs = async () => {
      const results = await axios.get("/api/songs");
      let songList = results.data;
      console.log(songList);
      setSongs(songList);
    };

    getSongs();
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
      <div className="song-list-background">
        <AppNavbar />
        {/* Portion of code below is to Log Out  */}
        {/* <form action="/api/users/logout" method="post">
          <button type="submit">Log Out</button>
        </form> */}
        {/* Portion of code aove is to Log Out */}
        <div className="title-background">
          <h1 id="top" style={{ textAlign: "center", fontSize: 70 }}>
            Songs of the Past 20 Years
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
                <a href="#top">🎧 </a>{" "}
              </h1>
              <CardGroup>
                {songs
                  .filter((song) => song.yearOnChart === year)
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
            </div>
          );
        })}
      </div>
    );
  }
}

export default SongList;

//     return(
//         <div className="song-list-background">
//                 <div className="title-background">
//                 <h1 id= "top" style={{textAlign: "center", fontSize: 70}}>Songs of the Past 20 Years</h1>
//                 </div>

//                 <div style={{display: "inline-flex", margin: 20}}>
//                     <h1>I miss the year...</h1>
//                     <DropdownButton id="dropdown-basic-button" title="YYYY">

//                         {theYears.map(year =>{
//                             return(

//                                 <Dropdown.Item key={year} href={`#${year}`}> {year} </Dropdown.Item>
//                                 /* <Button className="button-year" variant="dark" style={{margin: 20}}>{year}</Button> */

//                             );
//                         })}

//                     </DropdownButton>
//                 </div>

//                 {theYears.map(year => {
//                     return(
//                         <div id={year}>
//                             <h1 className="year-heading">Take Me Back to <Badge variant="primary">{year}</Badge> <a href="#top">☝️ </a> </h1>
//                             <CardGroup>
//                             {songs.filter(song => song.yearOnChart === year).map(song => {
//                                 return (<div style={{marginBottom: 19}}>
//                                  <Song key={song.id} id={song.id} title={song.title} artist={song.artist} img={song.coverImage} rank={song.rank} year={song.yearOnChart}
//                                 //url = { "https://en.wikipedia.org/wiki/Boom Boom Pow"}
//                                 url={`http://www.youtube.com/embed/${song.videoId}`} />
//                                 {/* url={song.url} /> */}
//                                 </div>);
//                             })}
//                             </CardGroup>
//                         </div>
//                     );
//                 })}

//         </div>
//     );
// }

// export default SongList;
