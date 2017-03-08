import React, { Component } from 'react';
import './MovieDisplay.sass';

export default class MovieDisplay extends Component {

  state = {
    ready : false,
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({ movies: newProps.movies.slice(0,30), ready:true })

  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.movies.getMovie();
    // this.props.actions.movies.getGenre('Action');
  }

  // fadeIn = (event) => {
  //   console.log(event.parentNode);
  //   event.target.style.opacity = 0.4;
  // }
  //
  // fadeOut = (event) => {
  //   // console.log(event.target);
  //   event.target.style.opacity = 1;
  // }

  render(){
    const {current} = this.props.translation
    return(
      <div className="allMovies">
            { this.state.ready && this.state.movies.map(movie =>{
              return(
                <div className="allInfo" key={movie.id + Math.random(10000, 50000)}>
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
    )
  }
}
