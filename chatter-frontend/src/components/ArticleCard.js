import React from "react";

import "./ArticleCard.css";

export default class ArticleCard extends React.Component {
  render() {
    return (
      <div className="flex-1 text-gray-700 text-center bg-gray-200 px-2 py-2 m-2 rounded article-outline">
        <div className="lg:flex lg:items-center">
          <div className="lg:flex-shrink-0">
            <img className="rounded-lg" src={this.props.article.image} alt={this.props.article.headLine} />
          </div>
          <div className="mt-0 lg:mt-0 lg:ml-2">
            <div className="text-lg font-bold text-justify">{this.props.article.headLine}</div>
            <div></div>
            <p class="text-gray-600">Aug 18</p>
          </div>
        </div>
        {/* <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">{this.props.article.headLine}</div>
            <p className="text-gray-700 text-base">{this.props.article.description}</p>
            <p className="text-gray-700 text-base">
              <a href={this.props.article.url} target="full-article">
                Read more ...
              </a>
            </p>
            <div class="flex items-center">
              <div class="text-sm">
                <p class="text-gray-900 leading-none">{this.props.article.date}</p>
              </div>
            </div>
          </div> */}
      </div>
    );
  }
}
