import React, { Component } from 'react';
import './BestOfMovies.sass';

export default class BestOfMovies extends Component {
  state = {
    ready : false,
  }

  componentWillReceiveProps = (newProps) => {
    console.log('rtfgy6gtrfcgtjuygtrvthygtvbhygtvf', newProps.movies);
    this.setState({ tenBestMovies: newProps.movies, ready: true });
    console.log("10", this.state.tenBestMovies);
  }

  componentDidMount = () => {
    const { actions } = this.props;
    actions.movies.TenBestMovies();
    console.log(this.props);
  }

  render(){
    const {current} = this.props.translation;
    return(
      <div>
      <div className="BestMovies">
        <p>{current.bestMovies}</p>
      </div>
      <div className="TenBestMovies">
          {this.state.ready && this.state.tenBestMovies.map((movie, key) => {
            return(
              <div key={key} className="allInfo">
                <div
                  className="movie"
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
