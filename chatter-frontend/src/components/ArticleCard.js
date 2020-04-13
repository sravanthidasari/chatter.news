import React from "react";

import "./ArticleCard.css";
import Badge from "./Badge";

export default class ArticleCard extends React.Component {
  constructor(props) {
    super(props);

    this.selectArticle = this.selectArticle.bind(this);
  }

  selectArticle(event) {
    event.preventDefault();
    this.props.onArticleSelected(this.props.article);
  }

  render() {
    return (
      <div className={this.props.className + " flex-none text-gray-700 text-center bg-gray-200 px-2 py-3 m-2 rounded-lg"}>
        <div className="lg:flex lg:items-top">
          <div className="lg:flex-none py-1">
            <div className="flex flex-col justify-center">
              <img
                className="rounded-lg mb-2 object-none"
                style={{ cursor: "pointer" }}
                src={this.props.article.image}
                alt={this.props.article.headLine}
                onClick={this.selectArticle}
              />
              <Badge className="mb-2" iconName={"fa-thumbs-up"} count={this.props.article.likeCount} />
              <Badge className="mb-2" iconName={"fa-thumbs-down"} count={this.props.article.dislikeCount} />
              <Badge className="mb-2" iconName={"fa-comments"} count={this.props.article.commentCount} />
            </div>
          </div>
          <div className="mt-0 lg:mt-0 lg:ml-2">
            <div className="text-lg font-bold text-left" onClick={this.selectArticle} style={{ cursor: "pointer" }}>
              {this.props.article.headLine}
            </div>
            <div className="text-sm text-justify mt-2">
              <span>{this.props.article.description}</span>
              <span className="ml-2">
                <a href={this.props.article.url} target="FullArticle">
                  Read more
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
