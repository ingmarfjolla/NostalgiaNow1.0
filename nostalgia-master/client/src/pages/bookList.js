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
import "../styles/book.css";

import Book from "./book"



function BookList()
{
    const[books, setBooks] = useState([]);
    const theYears = ["fiction","series books","kids books","non fiction"];
    useEffect(() => {
        const getBooks = async () => {
            const results = await axios.get('/api/books');
            let bookList = results.data;
            console.log(bookList);
            setBooks(bookList);
        };

        getBooks();
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
    return(
        
        <div className="book-list-background">
        <AppNavbar />
        <div className="title-background">
          <h1 id="top" style={{ textAlign: "center", fontSize: 70 }}>
            Do These Books Look Familiar?
          </h1>
        </div>

        <div style={{ display: "inline-flex", margin: 20 }}>
          <h1>I'm more of a....</h1>
          <DropdownButton id="dropdown-basic-button" title="-">
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
          <h1> type</h1>
        </div>

        {theYears.map((year) => {
          return (
            <div id={year}>
              <h1 className="year-heading">
                I'm interested in <Badge variant="primary">{year}</Badge>{" "}
                <a href="#top">📚</a>{" "}
              </h1>
              <CardGroup>
                {books
                  .filter((book) => book.genre == year)
                  .map((book) => {
                    return (
                      <div className="book-thing" style={{ marginBottom: 19 }}>
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
        })}
      </div>
       
    );
  }
}

export default BookList;