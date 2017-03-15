import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import MenuMovies from './MenuMovies';
import RangeMovies from './RangeMovies';
import SortMovies from './SortMovies';
import SearchMenu from '../SearchMenu';
import _ from 'lodash';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import Genres from '../Genres';
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
    pageNumber: 0,
    page: 0,
  }

  // componentWillReceiveProps = (newProps) => {
  //   console.log('RECEIVED', newProps.movies);
  //   this.setState({ movies: newProps.movies.slice(0,30), ready:true })
  // }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    // this.props.actions.movies.getMovie({});
    this.loadMovies = _.debounce(this.loadMovies, 1000);
    this.loadMovies();
    // this.props.actions.movies.getGenre('Comedy');
  }

  handleChange = (key, value) => {
    console.log('yayyyyyss');
    if(key !== 'page'){ // GERER CORRECTEMENT
      this.setState({page: { valuePage: 0, valueScroll: 0 } })
    }

    this.setState({ [key]: value }, () => {
      const { year, rate, genre , sort = {name : 'title', value: 1}, title, id, page = { valuePage: 0, valueScroll: 0 } } = this.state;
      // console.log("TITRE 1",filter.name);
      // console.log("TITRE 2",filter.value);
      // console.log("titre 2", title ) ;
      console.log("SCROLL ", page.valueScroll);
      console.log("PAGE ", page.valuePage);
      console.log('dvdv', title);
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
    console.log('yayyyyyss');
    browserHistory.push(`/app/movies/${id}`);
  }


// METTRE A ZERO LA PAGE SI NOUVELLE REQUETE
  loadMovies = () => {
    console.log("CHARGEMENT DE FILMs");
    const { pageNumber } = this.state;
    console.log("CHARGEMENT DE FILMs", pageNumber);

    // this.setState({page: this.state.page + 1})
    this.handleChange( 'page', { valuePage: pageNumber, valueScroll: 1}  );
    const nextPage = pageNumber + 1;
    console.log("CHARGEMENT DE FILMs next", nextPage );

    this.setState({ pageNumber: nextPage });
  }

  render(){
    let pageStart;
    // console.log(this.props.actions);
    const {current} = this.props.translation;
    const { movies } = this.props; // 30 films at a time
    return(
      <div className="moviesContainer">
        <SearchMenu onKeyDown={this.handleChange}/>
        <div className="list">
          <MenuMovies onChange={this.handleChange} />
          <RangeMovies onChange={this.handleChange} />
          <SortMovies onChange={this.handleChange} />
        </div>
      <InfiniteScroll
          pageStart= {0}
          loadMore={this.loadMovies}
          initialLoad={false}
          hasMore={true}
          loader={<div className="loader">Loading ...</div>}>
          {
            <div className="allMovies">
                  {movies && movies.length > 0 && movies.map((movie, key) => {
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
            </div>}
        </InfiniteScroll>

    </div>
    )
  }
}
