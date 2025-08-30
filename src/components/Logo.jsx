import React from "react";
import logo from "../assets/Gemini_Generated_Image_vfm9mbvfm9mbvfm9-removebg-preview.png";

function Logo({width='100px'}){
    return(
     <img src={logo} 
     alt="Chronicle Logo"
     style={{width}}
     />
    )
}

export default Logo