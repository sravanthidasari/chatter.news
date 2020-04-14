import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.customRender = this.customRender.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  responseFacebook(response) {
    console.log(response);

    if (response && response.userID) {
      if (this.props.onLogin) {
        console.log("Calling on login method ...");
        this.props.onLogin(response.userID, response.name, response.picture.data.url);
      }
    }
  }

  signOut(event) {
    event.preventDefault();
    window.FB.logout();
    if (this.props.onLogout) {
      this.props.onLogout();
    }
  }

  customRender(localProps) {
    return (
      <p className="text-right w-full cursor-pointer" onClick={localProps.onClick}>
        Login
      </p>
    );
  }

  showNameAndLogout() {
    return (
      <p className="w-full text-right cursor-pointer" onClick={this.signOut}>
        {this.props.name.split(" ")[0] + " (Logout)"}
      </p>
    );
  }

  render() {
    return this.props.userId ? (
      this.showNameAndLogout()
    ) : (
      <FacebookLogin
        appId="512346166124705"
        autoLoad={false}
        callback={this.responseFacebook}
        fields="name,email,picture"
        render={renderProps => this.customRender(renderProps)}
      />
    );
  }
}
