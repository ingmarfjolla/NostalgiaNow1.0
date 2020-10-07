import React, {useEffect, useState} from "react";
import "../styles/signup.css";
import {BrowserRouter, Link} from 'react-router-dom';
import axios from "axios";

function Signup(){




	const [user, setUser]= useState('');
	const [repeatName, setRepeatName]= useState('');
	const [pass, setPass]= useState('');

	 useEffect(() => {
	    const getCheck = async () => {
	      const results = await axios.get("/api/users/check");
	   
		     if(results.data===true){
		     	setRepeatName('Username Repeated, Change other Username ');
		     }
	     
	    };

	    getCheck();
	    console.log("Effect has been run");
  	}, []);

		return (
		<div className="signupBox">
			<div className="title">Sign Up</div>

			<form className="signup" action= "/api/users/register" method='POST'>
				<label>{repeatName}</label>
				<br></br>
				<label for="username"> Username:   </label>
				<br></br>
				<input type="text" name="username" onChange={(e) =>setUser(e.target.value)} required/>
				<br></br>
				<label for="password">Password:</label>
				<br></br>
	            		<input type="password" name="password" id="password" required onChange={(e) =>setPass(e.target.value)}/>
	            		<br></br>
	            		<br></br>
	            		<button type="submit" id="submitButton">Sign Up</button>
	            		<br></br>
	            		<br></br>
			</form>
		</div>
		
	);

}

export default Signup;