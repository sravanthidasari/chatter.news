"use strict";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Articles from "./components/Articles";


let baseURL = process.env.REACT_APP_BASEURL;
if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:3003";
} else {
  baseURL = "https://fathomless-sierra-68956.herokuapp.com";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bingEndpoint: "https://westus2.api.cognitive.microsoft.com/bing/v7.0/news",
      apikey: "4c2c58925d16403b833369d435edbe67",
      query: "&t=",
      articles: [
        {
          name: " ",
          description: " "
        },
        {
      comments: " "
        }
      ]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const newArticle = {
      articles: this.state.articles,
      name: this.state.articles.name,
      description: this.state.articles.description
    };
    console.log(newArticle);
    const UpdatedArticles = [newArticle, ...this.state.articles];

    this.setState(
      {
        searchURL: this.state.baseURL + this.state.apikey + this.state.query + this.state.article.name
      },
      () => {
        fetch(this.state.searchURL)
          .then(response => {
            return response.json();
          })
          .then(response => {
            this.setState({ article: response });
          })
          .catch(err => {
            console.error(err);
          });
      }
    );
  }

  render() {
    return (
      <div>
        <h1>Chatter</h1>
      <table>
        <tbody>
          <{this.state.articles.map((name, index) => {
            return (
              <tr key={index}>
                <td>{this.state.articles.name}</td>
                <td>{this.state.articles.description}</td>
              </tr>
            );
          })}
        </tbody>
        </table>
        <div>
        {/* <form onSubmit={this.handleSubmit}> */}
        <label htmlFor="name">Head Lines</label>
        <input id="name" type="text" value={this.state.name} onChange={this.handleChange} />
        <input type="submit" value="Latest News Articles" />
        {/* </form> */}
        <a href={this.state.searchURL}>{this.state.searchURL}</a>
        <Articles articles={this.state.articles} /> */}
        </div>
      </div>
    );
  }
}

export default App;
