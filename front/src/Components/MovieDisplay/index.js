import React, { Component } from 'react';
import _ from 'lodash';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Genres from '../Genres';
import './MovieDisplay.sass';

export default class MovieDisplay extends Component {

  state = {
    ready : false,
    bcolor: '#363637',
  }

  componentWillReceiveProps = (newProps) => {
    console.log(newProps);
    this.setState({ movies: newProps.movies.slice(0,30), ready:true })
    // let allGenres = newProps.movies.map(genre => genre.genres);
    // allGenres = _.flattenDepth(allGenres, 1);
    // allGenres = _.uniq(allGenres);
    // console.log('genres', allGenres);
  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.movies.getMovie();
    // this.props.actions.movies.getGenre('Comedy');
  }


colorGenre = (e) => {
 let bColor = '#'+Math.floor(Math.random()*16777215).toString(16);
 this.setState({bcolor: bColor})
  e.target.style.backgroundColor = bColor;
  // console.log(e.target.parentNode.parentNode);
}

resetDiv = (e) =>{
  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
}


resetColor = (e) =>{
  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
}

  render(){
    const {current} = this.props.translation;
    return(
      <div className="moviesContainer">
      <div className="list">
        <p className="genreTitle">GENRE</p>
          {Genres.map((genre) => {
            return(
              <div>
                <button className="genreButton" onClick={() => this.props.actions.movies.getGenre(genre)} onMouseOut={this.resetColor} onMouseOver={this.colorGenre} style={{
                  margin : '2px',
                }} >{genre} </button>
              </div>
            )
          })}
      </div>
      <div className="allMovies">
            { this.state.ready && this.state.movies.map((movie, key) =>{
              return(
                <div className="allInfo" key={key}>
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
