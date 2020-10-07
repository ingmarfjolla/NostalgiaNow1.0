import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import ComeBackLater from "./pages/comeBackLater"
import UserAccount from "./pages/userAccount.js";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import SongList from "./pages/songList";
import BookList from "./pages/bookList";
import GameList from "./pages/gameList";
import MovieList from './pages/movieList';
import ShowList from './pages/showList';
import PopularList from "./pages/popularList";

// import Userj from "./pages/userj.js";
import Success from "./pages/success";
// import AppNavbar from './AppNavbar';
const App = () => {
  let restricted_hour = new Date().getHours();
  let restricted_minutes = new Date().getMinutes();
  let restricted_day = new Date().getDay();
  console.log(restricted_hour, restricted_minutes, restricted_day);

  return (
    <div>
      <BrowserRouter>
        {((restricted_day == 0 && restricted_hour == 0 && (restricted_minutes >= 0 && restricted_minutes <= 30)
        ) ? <Route path="/" exact component={ComeBackLater} /> : <Route path="/" exact component={Login} /> )}

        {((restricted_day == 0 && restricted_hour == 0 && (restricted_minutes >= 0 && restricted_minutes <= 30)
        ) ? <Route path="/" exact component={ComeBackLater} /> : <Route path="/signup" exact component={Signup} /> )}
        
        {/* <Route path="/" exact component={Login} /> */}
        {/* <Route path="/signup" exact component={Signup} /> */}
        <Route path="/user/:username" exact component={UserAccount} />
        <Route path="/home/:username" exact component={Home} />
        <Route path="/songList/:username" exact component={SongList} />
        <Route path="/bookList" exact component={BookList} />
        <Route path="/gameList/:username" exact component={GameList} />
        <Route path="/showList/:username" exact component ={ShowList} />
        <Route path="/movieList/:username" exact component={MovieList} />
        <Route path="/bookList/:username" exact component={BookList} />
        <Route path="/popularList/:username" exact component={PopularList} />
        {/* <Route path="/users/test/:username/:password" exact component={Userj} /> */}
        <Route
          path="/users/success/:username/:password"
          exact
          component={Success}
        />
        
      </BrowserRouter>
    </div>
  );
};

export default App;
