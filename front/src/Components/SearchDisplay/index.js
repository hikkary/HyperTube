import React, { Component } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import './sass/SearchDisplay.sass';

export default class SearchDisplay extends Component {
  state={
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
  }

  goMoviePage = (id) => {
    browserHistory.push(`/app/movies/${id}`);
  }

  goSeriePage = (id) => {
    browserHistory.push(`/app/series/${id}`);
  }

  seriesDisplay = (src, key) =>(
    <div className="allInfo" key={key}>
     <div
       className="Serie"
       onClick={() => this.goSeriePage(src.imdb_code)}
       style={{ backgroundImage: `url('${src.images.poster}')` }}
       >
        <div className="textContainer">
          <p>Year: {src.year}</p>
          {src.num_seasons && <p>Seasons: {src.num_seasons}</p>}
          <p>Rating: {(src.rating === -1 && '-') || (src.rating)}</p>
        </div>
     </div>
     <div className="title">
       <p>{src.title}</p>
     </div>
    </div>
  )

  seen = (movie) => {
    if (movie) {
      let seen = movie.seenBy.map((user) => {
        if (user === this.props.user.id) {
          return "movieSeen";
        }
        return false;
      });
      seen = seen.filter((see) => {
        if (see) {
          return see;
        }
        return false;
      });
      if (seen.length !== 0) return "movieSeen";
      else return "movie";
    }
  }

  moviesDisplay = (src, key) => (
    <div className="allInfo" key={key}>
      <div
        onClick={() => this.goMoviePage(src.id)}
        className={this.seen(src)}
        style={{ backgroundImage: `url('${src.largeImage}')` }}
      >
        <div className="textContainer">
          <p>Rate: {src.rating} </p>
          <p>{src.year} </p>
        </div>
      </div>
      <div className="title">
        <p>{src.title} </p>
      </div>
    </div>
  )

  render() {
    const { search } = this.props;
    return(
      <div className="searchContainer">
        <div className="moviesAndSeries">
          {search && search.map((src, key) => {
            return (
              (src.provider === 'EZTV' && this.seriesDisplay(src,key)) || (src.provider === 'YTS' &&
              this.moviesDisplay(src, key)
            ))
          }) }
        </div>
      </div>
    )
  }
}
