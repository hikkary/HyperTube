import React, { Component } from 'react';
import MenuMovies from './MenuMovies';
import RangeMovies from './RangeMovies';
import SortMovies from './SortMovies';
import _ from 'lodash';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Genres from '../Genres';
import './MovieDisplay.sass';

export default class MovieDisplay extends Component {
  state = {
    ready : false,
    genres: '',
    year: {
      min: 1900,
      max: 2017,
    },
    rate: {
      min: 0,
      max: 10,
    },
    title: '',
  }

  componentWillReceiveProps = (newProps) => {
    console.log(newProps);
    this.setState({ movies: newProps.movies.slice(0,30), ready:true })
  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.movies.getMovie({});
    // this.props.actions.movies.getGenre('Comedy');
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value }, () => {
      const { year, rate, genres, filter } = this.state;
      console.log("TITRE 1",filter.name);
      console.log("TITRE 2",filter.value);
      // console.log("titre 2", title ) ;
      this.props.actions.movies.getMovie({
        yearMin: year.min,
        yearMax: year.max,
        rateMax: rate.max,
        rateMin: rate.min,
        genres,
        filter: filter.name,
        sorted: filter.value,
      })
    })
  }


  render(){
    // console.log(this.props.actions);
    const {current} = this.props.translation;
    return(
      <div className="moviesContainer">
        <div className="list">
          <MenuMovies onChange={this.handleChange} />
          <RangeMovies onChange={this.handleChange} />
          <SortMovies onChange={this.handleChange} />
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
