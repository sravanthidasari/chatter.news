import React from 'react';

export default class ArticleMain extends React.Component {
  render() {
    return (
      <div>
        {this.props.article.headLine}
      </div>
    );
  }
}