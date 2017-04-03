import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import MenuMovies from './MenuMovies';
import RangeMovies from './RangeMovies';
import SortMovies from './SortMovies';
import SearchMenu from '../SearchMenu';
import _ from 'lodash';
import './sass/MoviesDisplay.sass';
import './sass/spinner.css';
import InfiniteScroll from 'react-infinite-scroller';

export default class MoviesDisplay extends Component {
  state = {
	hasMore:true,
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
      name: 'seeds',
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
    this._mounted = true;
    this.loadMovies = _.debounce(this.loadMovies, 1000);
    this.loadMovies();
  }

  componentWillReceiveProps (newProps){
  	if (newProps.movies && newProps.movies.length === 0) {
  		this.setState({ hasMore: false });
  	} else {
  		this.setState({ hasMore: true });
  	}
  	if (newProps.movies[0] && newProps.movies[0].errors) {
  		this.setState({ hasMore: false });
  	}
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _mounted = false;

  resetValues = (key) => {
    if (key !== 'page') {
      this.setState({ page: { valuePage: 0, valueScroll: 0 } });
    }
    if (key === 'title') {
      if (!this._mounted) return false;
      this.setState({ genre: '' });
    };
  }

  handleChange = (key, value) => {
    this.resetValues(key);
    if (!this._mounted) return false;
    this.setState({ [key]: value }, () => {
      const {
        year,
        rate,
        genre,
        sort = { name: 'seeds', value: -1 },
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
    if (!this._mounted) return false;
    this.setState({ page: { valuePage: nextPage, valueScroll: 1 } });
  }

  seen = (movie) => {
    console.log('MY ID', this.props.user.id);
    console.log('MY PROPS', this.props);
    if (movie) {
      let seen = movie.seenBy.map((user) =>{
        if(user === this.props.user.id) {
          return "movieSeen"
        }
        return false;
      })
      seen = seen.filter((see) => {
        if (see){
          return see;
        }
        return false;
      });
      console.log("SEEEN" ,seen);
      if (seen.length !== 0) return "movieSeen";
      else return "movie";
    }
  }

  render(){
    const {current} = this.props.translation;
    let { movies } = this.props;
    let allMovies = '';
    if (movies && movies.length > 0 && !movies[0].errors) {
      movies = _.uniqBy(movies, 'id');
      allMovies = movies.map((movie, key) => {
        return (
        <div className="allInfo" key={key}>
            <div onClick={() => this.goMoviePage(movie.id)}
              className={this.seen(movie)}
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
    });

    }
    return(
      <div className="moviesContainer">
        <SearchMenu translation={this.props.translation} onKeyDown={this.handleChange}/>
        <SortMovies translation={this.props.translation} onChange={this.handleChange} />
        <RangeMovies translation={this.props.translation} onChange={this.handleChange} />
        <div className="list">
          <MenuMovies translation={this.props.translation} onChange={this.handleChange} />
        </div>
		{!this.state.hasMore && <div className="noMedia"> <p>{current.noMoviesFound}</p></div>}
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMovies}
          initialLoad={false}
          hasMore={this.state.hasMore}
          loader={<div className="spinner">
			  <div className="bounce1"></div>
			  <div className="bounce2"></div>
			  <div className="bounce3"></div>
			</div>}>
          {
            <div className="allMovies">
                {allMovies}
            </div>
          }
        </InfiniteScroll>
    </div>
    )
  }
}
