import React from "react";

import "./ArticleCard.css";
import Badge from "./Badge";

export default class ArticleCard extends React.Component {
  render() {
    return (
      <div className="flex-1 text-gray-700 text-center bg-gray-200 px-2 py-3 m-2 rounded-lg article-outline">
        <div className="lg:flex lg:items-top">
          <div className="lg:flex-none py-1">
            <div className="flex flex-col justify-center">
              <img className="rounded-lg mb-2" src={this.props.article.image} alt={this.props.article.headLine} />
              <Badge className="mb-2" iconName="fa-thumbs-up" count={this.props.article.likeCount} />
              <Badge className="mb-2" iconName="fa-thumbs-down" count={this.props.article.dislikeCount} />
              <Badge className="mb-2" iconName="fa-comments" count={this.props.article.commentCount} />
            </div>
          </div>
          <div className="mt-0 lg:mt-0 lg:ml-2">
            <div className="text-lg font-bold text-left">{this.props.article.headLine}</div>
            <div className="text-sm font-semibold text-justify mt-2">
              {this.props.article.description} 
              <a href={this.props.article.url} target="FullArticle">Read more</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
