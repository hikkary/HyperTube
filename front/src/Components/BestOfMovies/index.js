import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './sass/BestOfMovies.sass';

export default class BestOfMovies extends Component {

  componentDidMount = () => {
    const { actions } = this.props;
    actions.movies.TenBestMovies();
    // console.log('ten best movies props did mount', this.props);
  }

  goMoviePage = (id) => {
    browserHistory.push(`/app/movies/${id}`);
  }

  render(){
    const { current } = this.props.translation;
    const { movies } = this.props;
    return(
      <div>
      <div className="BestMovies">
        <p>{current.bestMovies}</p>
      </div>
      <div className="TenBestMovies">
          {movies && movies.map((movie, key) => {
            return(
              <div key={key} className="allInfo">
                <div
                  className="movie"
                  onClick={() => this.goMoviePage(movie.id)}
                  style={{ backgroundImage: `url('${movie.largeImage}')` }}
                >
                  <div className="textContainer">
                    <p>{current.rate}: {movie.rating} </p>
                    <p>{movie.year} </p>
                  </div>
                </div>
                <div className="title">
                  <p>{movie.title} </p>
                </div>
              </div>
            )
          })}
      </div>
    </div>
    )
  }
}
