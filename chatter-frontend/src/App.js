import React from "react";
import ArticleCard from "./components/ArticleCard";
import { getNewsArticlesForToday, getNewsArticleDetails, addCommentToArticle, addArticleReaction } from "./data";
import moment from "moment";

import "./assets/main.css";
import "./App.css";
import ArticleMain from "./components/ArticleMain";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedArticle: undefined,
      showArticleMain: false,
      articles: [],
      date: moment().startOf("date")
    };

    this.selectArticle = this.selectArticle.bind(this);
    this.addComment = this.addComment.bind(this);
    this.postArticleReaction = this.postArticleReaction.bind(this);
    this.goPrevious = this.goPrevious.bind(this);
    this.goNext = this.goNext.bind(this);
    this.startOver = this.startOver.bind(this);
    this.backToList = this.backToList.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async startOver() {
    this.setState({
      selectedArticle: undefined,
      showArticleMain: false,
      date: moment().startOf("date")
    });
  }

  async backToList() {
    this.setState({
      selectedArticle: undefined,
      showArticleMain: false
    });
  }

  async goPrevious(event) {
    event.preventDefault();
    this.setState({ date: this.state.date.subtract(1, "days") });
  }

  async goNext(event) {
    event.preventDefault();
    this.setState({ date: this.state.date.add(1, "days") });
  }

  async getData() {
    let articles = await getNewsArticlesForToday();
    this.setState({ articles: articles });

    for (const article of articles) {
      this.getArticleDetails(article).then(a => a);
    }
  }

  async getArticleDetails(article) {
    let articleDetails = await getNewsArticleDetails(article._id);
    articleDetails.likeCount = articleDetails.reactions.filter(r => r.reaction === 0).length;
    articleDetails.dislikeCount = articleDetails.reactions.filter(r => r.reaction === 1).length;
    articleDetails.commentCount = articleDetails.comments.length;

    this.updateArticleDetails(articleDetails);
    return articleDetails;
  }

  async postArticleReaction(article, reaction) {
    let articleDetails = await addArticleReaction(article._id, reaction, "sravanthi");
    articleDetails.likeCount = articleDetails.reactions.filter(r => r.reaction === 0).length;
    articleDetails.dislikeCount = articleDetails.reactions.filter(r => r.reaction === 1).length;
    articleDetails.commentCount = articleDetails.comments.length;

    this.updateArticleDetails(articleDetails);
    return articleDetails;
  }

  async addComment(article, comment) {
    // TODO: Replace the user id with the currently logged in user
    let commentDetails = await addCommentToArticle(article._id.toString(), comment, "sravanthi");
    article = {
      ...article,
      commentCount: article.commentCount + 1,
      comments: [...article.comments, commentDetails]
    };

    this.updateArticleDetails(article);
  }

  updateArticleDetails(articleDetails) {
    const copiedArticles = [...this.state.articles];
    const index = copiedArticles.findIndex(a => a._id === articleDetails._id);

    if (index === -1) {
      copiedArticles.push(articleDetails);
    } else {
      copiedArticles.splice(index, 1, articleDetails);
    }

    this.setState({ articles: copiedArticles });

    if (this.state.selectedArticle && this.state.selectedArticle._id === articleDetails._id) {
      this.setState({ selectedArticle: articleDetails });
    }
  }

  selectArticle(article) {
    this.setState({
      showArticleMain: true,
      selectedArticle: article
    });
  }

  renderNextButton() {
    let isDisabled = this.state.date.isSameOrAfter(moment(), "day");

    return isDisabled ? (
      <button
        className="bg-gray-300 font-bold py-2 px-4 rounded-r ml-5 opacity-50 text-gray-500 cursor-not-allowed"
        disabled
      >
        Next
      </button>
    ) : (
      <button
        className="bg-gray-300 font-bold py-2 px-4 rounded-r ml-5 hover:bg-gray-400 text-gray-800"
        onClick={this.goNext}
      >
        Next
      </button>
    );
  }

  renderPrevButton() {
    let isDisabled = this.state.date.isSameOrBefore(moment().startOf("date").subtract(7, "days"), "day");

    return isDisabled ? (
      <button
        className="bg-gray-300 font-bold py-2 px-4 rounded-l mr-5 opacity-50 text-gray-500 cursor-not-allowed"
        disabled
      >
        Prev
      </button>
    ) : (
      <button
        className="bg-gray-300 font-bold py-2 px-4 rounded-l mr-5 hover:bg-gray-400 text-gray-800"
        onClick={this.goPrevious}
      >
        Prev
      </button>
    );
  }

  renderNav() {
    return (
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white w-32 cursor-pointer" onClick={this.startOver}>
          <span className="font-bold text-3xl">Chatter.news</span>
        </div>
        <div className="inline-flex">
          {!this.state.showArticleMain ? this.renderPrevButton() : null}
          <div className="font-bold text-xl text-white">{this.state.date.format("MMM Do")}</div>
          {!this.state.showArticleMain ? this.renderNextButton() : null}
        </div>
        <div className="flex items-center flex-shrink-0 text-white w-32 font-bold">
          <p className="text-right w-full">Login</p>
        </div>
      </nav>
    );
  }

  renderArticleMain() {
    return <ArticleMain article={this.state.selectedArticle} onAddComment={this.addComment} onBackToList={this.backToList} />;
  }

  renderArticleList() {
    return (
      <div className="flex flex-wrap justify-center">
        {this.state.articles.map((a, index) => (
          <ArticleCard
            className="w-full md:w-5/12"
            article={a}
            key={index}
            onArticleSelected={this.selectArticle}
            onPostReaction={this.postArticleReaction}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderNav()}
        <div className="container mt-5">
          {this.state.showArticleMain ? this.renderArticleMain() : this.renderArticleList()}
        </div>
        {/* <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Archive</button> */}
      </>
    );
  }
}

export default App;
