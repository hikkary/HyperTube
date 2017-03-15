import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import MenuMovies from './MenuMovies';
import RangeMovies from './RangeMovies';
import SortMovies from './SortMovies';
import SearchMenu from '../SearchMenu';
import _ from 'lodash';
import './MoviesDisplay.sass';
import InfiniteScroll from 'react-infinite-scroller';

export default class MoviesDisplay extends Component {
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
    page: {
      valueScroll: 0,
      valuePage: 0,
    },
  }

  componentDidMount = () => {
    this.loadMovies = _.debounce(this.loadMovies, 1000);
    this.loadMovies();
  }

  resetValues = (key) => {
    if (key !== 'page') {
      this.setState({ page: { valuePage: 0, valueScroll: 0 } });
    }
    if (key === 'title') { this.setState({ genre: '' }); };
  }

  handleChange = (key, value) => {
    this.resetValues(key);
    this.setState({ [key]: value }, () => {
      const {
        year,
        rate,
        genre,
        sort = { name: 'title', value: 1 },
        title,
        id,
        page
      } = this.state;
      this.props.actions.movies.getMovie({
        yearMin: year.min,
        yearMax: year.max,
        rateMax: rate.max,
        rateMin: rate.min,
        genre,
        sort: sort.name,
        asc: sort.value,
        title,
        id,
        page: page.valuePage,
        scroll: page.valueScroll,
      })
    })
  }

  goMoviePage = (id) => {
    browserHistory.push(`/app/movies/${id}`);
  }

  loadMovies = () => {
    const { page } = this.state;
    const nextPage = page.valuePage + 1;
    this.handleChange('page', page);
    this.setState({ page: { valuePage: nextPage, valueScroll: 1 } });
  }

  render(){
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
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMovies}
          initialLoad={false}
          hasMore={true}
          loader={<div className="loader">Loading ...</div>}>
          {
            <div className="allMovies">
                  {movies && movies.length > 0 && movies.map((movie, key) => {
                    return(
                      <div className="allInfo" key={key}>
                          <div onClick={() => this.goMoviePage(movie.id)}
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
                   })
                 }
            </div>
          }
          </InfiniteScroll>
    </div>
    )
  }
}
