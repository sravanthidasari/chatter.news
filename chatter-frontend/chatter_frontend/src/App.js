import React, {Component} from 'react';
import article from (./article.js)

class App extends React.Component {
  constructor (props) {
    super(props) 
      this.state = {
        article: article 
      }
    }

  render() {
    return (
    <div>
      <header class="blockquote text-center">
        <h1>&larr;Chatter date &rarr;</h1>
        </header>
        <body>
          <div>
            <div>
              {
              this.state.article.map((headline) => {
                return (
                  <div>
                  <h1>Article 1</h1>
                  <img src="..." alt="..." class="img-thumbnail"/>
                  <input type="text" id="comments" name="comment" placeholder="write a comment" />
                  </div>
                )
              })
              }
            </div>
            <div>
            <h1>Article 2</h1>
            <img src="..." alt="..." class="img-thumbnail"/>
            <input type="text" id="comments" name="comment" placeholder="write a comment" />
            </div>
            <div>
            <h1>Article 3</h1>
            <img src="..." alt="..." class="img-thumbnail"/>
            <input type="text" id="comments" name="comment"   placeholder="write a comment" />
            </div>
            <div>
            <h1>Article 4</h1>
            <img src="..." alt="..." class="img-thumbnail"/>
            <input type="text" id="comments" name="comment" placeholder="write a comment" />
            </div>
            <div>
            <h1>Article 5</h1>
            <img src="..." alt="..." class="img-thumbnail"/>
            <input type="text" id="comments" name="comment" placeholder="write a comment" />
            </div>

          </div>

        </body>
      </div>
    )}
}


export default App;
