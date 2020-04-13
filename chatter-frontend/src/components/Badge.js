import React from "react";

import "./Badge.css";

export default class Badge extends React.Component {
  render() {
    return (
      <div className={this.props.className + " badge-outline border"}>
        <i
          className={"fa " + this.props.iconName + (this.props.highlight ? " highlight-icon" : "")}
          style={this.props.clickable ? { cursor: "pointer" } : {}}
          onClick={this.props.onClick}
        ></i>
        <span className="counter">{this.props.count}</span>
      </div>
    );
  }
}
