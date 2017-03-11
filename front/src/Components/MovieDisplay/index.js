import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import MenuMovies from './MenuMovies';
import RangeMovies from './RangeMovies';
import SortMovies from './SortMovies';
import SearchMenu from '../SearchMenu';
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
    filter: {
      name: 'title',
      sorted: 1,
    },
    title_search: '',
    id: '',
  }

  // componentWillReceiveProps = (newProps) => {
  //   console.log('RECEIVED', newProps.movies);
  //   this.setState({ movies: newProps.movies.slice(0,30), ready:true })
  // }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.movies.getMovie({});
    // this.props.actions.movies.getGenre('Comedy');
  }

  handleChange = (key, value) => {
    console.log('yayyyyyss');
    this.setState({ [key]: value }, () => {
      const { year, rate, genres , filter, title_search, id } = this.state;
      // console.log("TITRE 1",filter.name);
      // console.log("TITRE 2",filter.value);
      // console.log("titre 2", title ) ;
      console.log('dvdv', id);
      this.props.actions.movies.getMovie({
        yearMin: year.min,
        yearMax: year.max,
        rateMax: rate.max,
        rateMin: rate.min,
        genres,
        filter: filter.name,
        sorted: filter.value,
        title_search,
        id,
      })
    })
  }

  goMoviePage = (id) => {
    console.log('yayyyyyss');
    browserHistory.push(`/app/movies/${id}`);
  }

  render(){
    // console.log(this.props.actions);
    const {current} = this.props.translation;
    const { movies } = this.props;
    return(
      <div className="moviesContainer">
        <SearchMenu onKeyDown={this.handleChange}/>
        <div className="list">
          <MenuMovies onChange={this.handleChange} />
          <RangeMovies onChange={this.handleChange} />
          <SortMovies onChange={this.handleChange} />
        </div>
        <div className="allMovies">
              {movies && movies.map((movie, key) => {
                return(
                  <div className="allInfo" key={key}>
                      <div onClick= {() => this.goMoviePage(movie.id)}
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
