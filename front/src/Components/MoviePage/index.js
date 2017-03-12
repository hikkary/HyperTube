import React, { Component } from 'react';
import './moviePage.sass';

export default class MoviePage extends Component {
  state = {
  }

  componentDidMount() {
    this.props.actions.movie.getMoviePage({
      id: this.props.id,
    })
  }

  render() {
    console.log("PROPS",this.props.movie)
    // if(this.props.movie){
    // const { movie } = this.props.movie;
    // }
    // const { movie } = this.props.movie;
    return (
    <div>
          <div className="infoContainer">
            <div className="displayBigPoster" style={{
              backgroundImage: `url('${this.props.movie.largeImage}')`
            }}>
              <div className="movieTitle">
                <p>{this.props.movie.title}</p>
              </div>
              <div className="movieInfo">
                <p>{this.props.movie.rating}</p>
              </div>
              <div className="movieSummary">
                <p>{this.props.movie.summary}</p>
              </div>
            </div>
          </div>
        )
      </div>
    )
  }
}
