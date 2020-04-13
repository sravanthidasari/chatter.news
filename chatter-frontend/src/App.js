"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import ArticleCard from "./components/ArticleCard";
import Badge from "./components/Badge";

import "./assets/main.css";
import "./App.css";

let baseURL = process.env.REACT_APP_BASEURL;
if (process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:3003";
} else {
  baseURL = "https://fathomless-sierra-68956.herokuapp.com";
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      article: {
        headLine: "Almost all of the federal stockpile of personal protective equipment is depleted, new documents show",
        description:
          'Ninety percent of the federal personal protective equipment stockpile had been depleted as the Health and Human Services Department made its "final shipments" of N95 respirators, surgical and face masks, face shields, gowns and gloves, according to new documents released Wednesday by the House Oversight Committee The remaining 10% of the ...',
        image: "https://www.bing.com/th?id=ON.FEFFC96A14690C86D5A48509A4EFE92F&pid=News",
        url: "https://www.usatoday.com/story/news/politics/2020/04/08/coronavirus-almost-all-federal-equipment-stockpile-depleted/2971757001/",
        date: "2020-04-09T02:12:00.000Z",
        likeCount: 2,
        dislikeCount: 5,
        commentCount: 10
      }
    };
  }

  componentDidMount() {
    // this.getData();
  }

  render() {
    return (
      <>
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-bold text-xl">Chatter.news</span>
          </div>
        </nav>
        <div className="container mt-5">
          <div className="md:flex">
            <ArticleCard article={this.state.article} />
            <ArticleCard article={this.state.article} />
          </div>
        </div>
        {/* <button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Archive</button> */}
      </>
    );
  }
}

export default App;
