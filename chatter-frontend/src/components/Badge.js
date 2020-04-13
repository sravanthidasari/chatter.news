import React from "react";

import './Badge.css';

export default class Badge extends React.Component {
  render() {
    return (
      <div className="badge-outline border" {...this.props}>
        <i className={"fa " + this.props.iconName + (this.props.highlight ? " highlight-icon" : "")}></i>
        <span className='counter'>{this.props.count}</span>
      </div>
    );
  }
}
