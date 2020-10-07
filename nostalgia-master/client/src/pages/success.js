import React, {useEffect, useState} from "react";
// import "../styles/sign.css";
import {BrowserRouter, Link, Redirect} from 'react-router-dom';
import axios from "axios";
import { useParams } from "react-router";



function Success(){

	var {username,password}=useParams();
    const [route, setRouter ] =useState("");

	useEffect(() => {
        const login = async () => {
            var url="/api/users/login/"+username+"/"+password;
            const results = await axios.post(url);
            if(results.data==="password does not match" ||results.data==="cannot find"){
                setRouter(
                    <Redirect to={"/"} />
                );
              
            }else{
                console.log(results.data);
                 setRouter(
                    <Redirect to={"/home/"+results.data.username} />
                );
            }
        };
        login();
        
    }, []);

	return (
		<div>
            {route}
        </div>
        
		
	);

}

export default Success;
