import React, { useState } from "react";
import { NavDropdown, Navbar, Nav, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

function AppNavbar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  var { username } = useParams();

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Navbar.Brand href={`/home/${username}`}>Nostalgia Now</Navbar.Brand>

        <Navbar.Toggle onClick={toggle} />
        <Navbar.Collapse isOpen={isOpen}>
          <Nav className="ml-auto" style={{marginRight:0}}>
            <Nav.Link href={`/songList/${username}`}>Songs</Nav.Link>
            <Nav.Link href={`/gameList/${username}`}>Games</Nav.Link>
            <Nav.Link href={`/movieList/${username}`}>Movies</Nav.Link>
            <Nav.Link href={`/showList/${username}`}>Shows</Nav.Link>
            <Nav.Link href={`/bookList/${username}`}>Books</Nav.Link>
            <Nav.Link href={`/popularList/${username}`}>
                <Button variant="success">Popular</Button>
            </Nav.Link>
            {/* <Nav.Link href="https://github.com/reactstrap/reactstrap">
              GitHub
            </Nav.Link> */}
          </Nav>
        
            <Nav.Link href={`/user/${username}`} style={{marginLeft:0, marginRight:0}}>
          <Button
                variant="light"
                size="sm"
              >
                {" "}
                <FontAwesomeIcon
                  icon={faUser}
                  size="2x"
                  style={{ color: "black", marginLeft: 10, marginRight: 10 }}
                />
              </Button>
              </Nav.Link>
            
          <div className="logout" style={{marginLeft:0, marginRight:0}}>
                    <form action="/api/users/logout" method="POST">
                      <Button type="submit" variant="dark">Log Out</Button>
                    </form>
                </div>

        </Navbar.Collapse>
      </Navbar>

    </div>
  );
}

export default AppNavbar;
