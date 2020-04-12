import React , {Component} from  'react'


export default class Articles extends Component {
  render(){
    return (
      <div>
        <h1> HeadLine: {this.props.articles.name}</h1>
        <h3>image: {this.props.articles.image} </h3>
        <p>url: {this.props.articles.url} </p>
        <p>description: {this.props.articles.description}</p>
        <p>datePublished: {this.props.articles.datePublished}</p>
      </div>
    )
  }
}