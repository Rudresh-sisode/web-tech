import React,{Component} from "react";
import {Link,withRouter} from 'react-router-dom';

const url = "https://developerjwt.herokuapp.com/api/auth/userinfo";

class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            userData:""
        }
    }

    handleLogout = ()=>{
        sessionStorage.removeItem('ltk');
        sessionStorage.removeItem('ltk');
    }
}