import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from "react-facebook-login";

export default class login extends React.Component {
  state = {
    isLoggedIn: false,
    userID: '',
    name: '',
    email: '',
    picture: ''
  }
  render() {
    let fbContent;
    if(this.state.isLoggedIn) {
    } else {
      fbContent = (<FacebookLogin
       appId= "285110752479516" 
       autoLoad = {true}
       fields="name,email,picture"
       onClick={componentClicked} 
       callback = {responseFacebook} />);
    }


    return (
    <div>
      <h1>Currently</h1>
    </div>
    )}
}

export default login;