import React from "react";
import ArticleCard from "./components/ArticleCard";
import { getNewsArticlesForToday } from "./data";

import "./assets/main.css";
import "./App.css";
import ArticleMain from "./components/ArticleMain";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedArticle: undefined,
      showArticleMain: false,
      articles: []
    };

    this.selectArticle = this.selectArticle.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    let articles = await getNewsArticlesForToday();
    this.setState({ articles: articles });
  }

  selectArticle(article) {
    console.log(article);

    this.setState({
      showArticleMain: true,
      selectedArticle: article
    });
  }

  renderNav() {
    return (
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-bold text-xl">Chatter.news</span>
        </div>
        <div className="inline-flex">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">Prev</button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">Next</button>
        </div>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-bold text-right">Login</span>
        </div>
      </nav>
    );
  }

  renderArticleMain() {
    return <ArticleMain article={this.state.selectedArticle} />;
  }

  renderArticleList() {
    return (
      <div className="flex flex-wrap justify-center">
        {this.state.articles.map((a, index) => (
          <ArticleCard className="w-full md:w-3/5" article={a} key={index} onArticleSelected={this.selectArticle} />
        ))}
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderNav()}
        <div className="container mt-5">{this.state.showArticleMain ? this.renderArticleMain() : this.renderArticleList()}</div>
        {/* <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Archive</button> */}
      </>
    );
  }
}

export default App;
