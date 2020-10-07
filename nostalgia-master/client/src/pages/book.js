import React, { useState } from "react";
import axios from "axios";
import Iframe from "react-iframe";
import "../styles/song.css";
import Card from "react-bootstrap/Card";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faHeart,
  faHeartBroken,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";



function Book(props){

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let date = new Date()
    let currentYear = date.getFullYear();

    //-----------------------------------Incrementing a games's number of total likes on the backend---------------------------
    const [likes, setLikes] = useState(props.likes); // State to management the amount of likes of a given song

    // When a user click on the heart button, this function will get triggered
    const increaseLikes = (current_user, id) => {
        let alreadyLiked;

        const addLike = async () => {
        // Increment the song's likes on the backend
        const res = await axios.get(`/api/books/likeBook/${current_user}/${id}`);
        alreadyLiked = res.data.result; // Was a song already liked by this user?
        console.log(alreadyLiked);
        // If a song was not already liked by this user, then we can increment the front end like's
        if (alreadyLiked === false) {
            setLikes(likes + 1);
        } // Note that if a user already liked a song, they are prevented from incrementing to deter spamming
        };

        // Call the function to increment likes
        addLike();
    };

    // This will enable the popup of the likes
    function renderTooltip(props) {
        return (
        <Tooltip id="button-tooltip" {...props}>
            <strong>Total Likes: {likes}</strong>
        </Tooltip>
        );
    }
    //------------------------------------------------------------------------------------------------------------------

    //-----------------------------------Decrementing a song's number of total likes on the backend---------------------------
    // When a user click on the heart broken button, this function will get triggered
    const decreaseLikes = (current_user, id) => {
        let alreadyUnliked;

        const unLike = async () => {
        // Decrement the song's likes on the backend
        const res = await axios.get(
            `/api/books/unlikeBook/${current_user}/${id}`
        );
        alreadyUnliked = res.data.result; // Was a song already unliked by a user?
        console.log(alreadyUnliked);
        // If a song was not already unliked by this user, then we can decrement the front end like's
        if (alreadyUnliked === false) {
            setLikes(likes - 1);
        } // Note that if a user already unliked a song, they are prevented from decrementing to deter spamming
        };

        // Call the functiion to decrement likes
        unLike();
    };
    //------------------------------------------------------------------------------------------------------------------

    //-----------------------------------Adding a song to a user's likes array on the backend---------------------------
    // When a user click on the plus button, this function will get triggered
    const addToMyFavorite = (current_user, id) => {
        // Create a function to make a POST request to add a song to a user's likes array on the database/backend
        const addBook = async () => {
        const results = await axios.post(
            `/api/books/addBook/${current_user}/${id}`
        );
        };

        // Call the function to add the song
        addBook();
    };
    //------------------------------------------------------------------------------------------------------------------

    //-----------------------------------Removing a song from a user's likes array on the backend---------------------------
    // When a user click on the minus button, this function will get triggered
    const removeFromMyFavorite = (current_user, id) => {
        // Create a function to make a POST request to remove a song from a user's likes array on the database/backend
        const removeBook = async () => {
        const res = await axios.post(
            `/api/books/removeBook/${current_user}/${id}`
        );
        console.log(res.data.result);
        };

        // Call the function to remove the song
        removeBook();
    };

    //------------------------------------------------------------------------------------------------------------------

    return(
    <div>
        <Card>
        <Card.Body>
          <Card.Title>
            {props.title}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {props.author}
          </Card.Subtitle>
          <div style={{ width: 400, display: 'flex', alignItems: 'center',justifyContent: 'center',}}>
            <Card.Img src={props.img} style={{width: 150}}/>
          </div>
          <div style={{ width: 400}}>
            {props.descript}  
          </div>

          <div>
            <div className="button-left">
              <Button variant="warning">
                {props.year}{" "}
                <Badge pill variant="dark">
                  <a href={props.url} target="_blank">Amazon</a>     
                </Badge>
              </Button>
            </div>

            <div className="icons">
              <Button
                variant="light"
                size="sm"
                onClick={() => addToMyFavorite(props.current_user, props.id)}
              >
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="2x"
                  style={{ color: "green", marginLeft: 10, marginRight: 10 }}
                />
              </Button>
              {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}> */}
              <Button
                variant="light"
                size="sm"
                onClick={() =>
                  removeFromMyFavorite(props.current_user, props.id)
                }
              >
                {" "}
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  size="2x"
                  style={{ color: "red", marginLeft: 10, marginRight: 10 }}
                />
              </Button>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => increaseLikes(props.current_user, props.id)}
                >
                  {" "}
                  <FontAwesomeIcon
                    icon={faHeart}
                    size="2x"
                    style={{
                      color: "#FA709A",
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  />
                </Button>
              </OverlayTrigger>
              <Button
                variant="light"
                size="sm"
                onClick={() => decreaseLikes(props.current_user, props.id)}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faHeartBroken}
                  size="2x"
                  style={{ color: "#FA709A", marginLeft: 10, marginRight: 10 }}
                />
              </Button>

            </div>
          </div>
          
        </Card.Body>
      </Card>


    </div>
    );
}

export default Book;