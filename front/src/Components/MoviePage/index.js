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
    console.log(this.props.movie)
    return (
      <div>
          <div className="infoContainer">
            <div className="displayBigPoster">
            </div>
            <p>{this.props.movie.title}</p>

          </div>
        )
      </div>
    )
  }
}
