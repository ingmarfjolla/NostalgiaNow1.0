import React, {useEffect, useState} from "react";
import "../styles/login.css";
import {BrowserRouter, Link} from 'react-router-dom';
import { useParams } from "react-router";



function Login(){
	

	const [user, setUser]= useState('');
	const [pass, setPass]= useState('');

	return (
		<div className="Outer">
			<div className="loginBox">
				<div className="title">Log in</div>
				<form className="login" action="/api/users/login" method="POST">
					
					<label for="username"> Username:   </label>
					<br></br>
					<input type="text" name="username"  required/>
					<br></br>
					<label for="password">Password:</label>
					<br></br>
		            		<input type="password" name="password" id="password"  required/>
		           	 	<br></br>
		            		<br></br>
		            		<button type="submit" id="submitButton">Log In</button>
		            		<br></br>
		            		<br></br>
							<div style={{backgroundColor: "white"}}>
							<Link to ="/signup">New User</Link>	
							</div>
				</form>
			</div>
		</div>
		
	);

}

export default Login;