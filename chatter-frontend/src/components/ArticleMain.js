import React from "react";

import Badge from "./Badge";
import { getCommentDetails, addCommentReaction } from "../data";

export default class ArticleMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentReactions: [],
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.postCommentReaction = this.postCommentReaction.bind(this);
  }

  componentDidMount() {
    for (let comment of this.props.article.comments) {
      this.fetchCommentDetails(comment).then(c => c);
    }
  }

  async postCommentReaction(articleId, commentId, reaction) {
    if (!this.props.userId) {
      alert("You should be logged in for this ...");
      return;
    }

    let commentDetails = await addCommentReaction(articleId, commentId, reaction, this.props.userId);
    this.processCommentDetails(commentDetails);
  }

  async fetchCommentDetails(comment) {
    let commentDetails = await getCommentDetails(this.props.article._id, comment._id);
    this.processCommentDetails(commentDetails);
  }

  processCommentDetails(commentDetails) {
    commentDetails.likeCount = commentDetails.reactions.filter(r => r.reaction === 0).length;
    commentDetails.dislikeCount = commentDetails.reactions.filter(r => r.reaction === 1).length;

    let commentReactions = [...this.state.commentReactions];

    let index = commentReactions.findIndex(cr => cr._id === commentDetails._id);
    if (index === -1) {
      commentReactions.push(commentDetails);
    } else {
      commentReactions.splice(index, 1, commentDetails);
    }

    this.setState({ commentReactions: commentReactions });
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.props.onAddComment(this.props.article, event.target.value);

      event.target.value = "";
      event.preventDefault();
    }
  }

  renderComment(comment, index) {
    const rindex = this.state.commentReactions.findIndex(c => c._id === comment._id);
    if (rindex === -1) {
      this.fetchCommentDetails(comment).then(c => c);
    }

    return (
      <div className="p-2 border-b border-solid border-gray-400 flex justify-between" key={index}>
        <div className="w-4/5">
          <div className="px-2 font-bold text-blue-700">{comment.name || comment.userId}</div>
          <div className="px-2">{comment.comment}</div>
        </div>
        <div>{rindex !== -1 ? this.renderCommentReactions(this.state.commentReactions[rindex]) : ""}</div>
      </div>
    );
  }

  renderCommentReactions(comment) {
    return (
      <>
        <Badge
          iconName="fa-thumbs-up"
          count={comment.likeCount}
          clickable={true}
          onClick={() => this.postCommentReaction(this.props.article._id, comment._id, 0)}
        />
        <Badge
          className="ml-2"
          iconName="fa-thumbs-down"
          count={comment.dislikeCount}
          clickable={true}
          onClick={() => this.postCommentReaction(this.props.article._id, comment._id, 1)}
        />
      </>
    );
  }

  renderCommentInput() {
    return (
      <input
        type="text"
        className="w-full mt-4 p-2 bg-gray-200 border border-gray-400 rounded"
        placeholder="Write a comment ..."
        onKeyDown={this.handleKeyDown}
      />
    );
  }

  render() {
    return (
      <div className={this.props.className + " px-32 m-2"}>
        <div className="flex-none text-gray-700 text-center bg-gray-200 px-2 py-3 rounded-lg">
          <div className="lg:flex lg:items-top">
            <div className="lg:flex-none py-1">
              <div className="flex flex-col justify-center">
                <img className="rounded-lg mb-2 object-none" src={this.props.article.image} alt={this.props.article.headLine} />
                <Badge className="mb-2" iconName={"fa-thumbs-up"} count={this.props.article.likeCount} />
                <Badge className="mb-2" iconName={"fa-thumbs-down"} count={this.props.article.dislikeCount} />
                <Badge className="mb-2" iconName={"fa-comments"} count={this.props.article.commentCount} />
              </div>
            </div>
            <div className="mt-0 lg:mt-0 lg:ml-2">
              <div className="text-lg font-bold text-left">{this.props.article.headLine}</div>
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
          <div className="text-right">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={this.props.onBackToList}>
              Back to list
            </button>
          </div>
        </div>
        <div className="bg-gray-200 mx-12 pb-3 px-3 rounded-b-lg border-t-2 border-gray-700">
          <>{this.props.article.comments.map((c, index) => this.renderComment(c, index))}</>
          {this.renderCommentInput()}
        </div>
      </div>
    );
  }
}
