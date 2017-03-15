import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './SeriesDisplay.sass';
import MenuSeries from './MenuSeries';
import RangeSeries from './RangeSeries';
import SortSeries from './SortSeries';
import _ from 'lodash';
import SearchMenu from '../SearchMenu';
import InfiniteScroll from 'react-infinite-scroller';
import img from '../../../public/series_default.png';

export default class SeriesDisplay extends Component {
  state={
    ready: false,
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
    pageNumer: 0,
    page: 0,
  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    // this.props.actions.series.getSeries();
    this.loadSeries = _.debounce(this.loadSeries, 1000);
    this.loadSeries();
  }

  // componentWillReceiveProps = (newProps) => {
  //   console.log(newProps.series.slice(0, 30));
  //   this.setState({ series: newProps.series.slice(0, 30), ready: true });
  // }

  handleChange = (key, value) => {
    this.setState({ [key]: value }, () => {
      let { genre, id, year, rate, sort = {name: 'title', value: 1}, title, page = {valuePage: 0, valueScroll: 0 } } = this.state;
      // QUAND ON SELECTIONNE UN GENRE ET QU'ON LANCE UNE RECHERCHE, ON CHERCHE UNIQUEMENT DANS LE
      // GENRE,
      // console.log("TITRE ",title);
      if(title){ genre = '' }
      if(genre){ title = '' }

      this.props.actions.series.getSeries({
        genre,
        yearMin: year.min,
        yearMax: year.max,
        rateMin: rate.min,
        rateMax: rate.max,
        sort: sort.name,
        asc: sort.value,
        title,
        id,
        page: page.valuePage,
        scroll: page.valueScroll,
      })
    })
  }

  goSeriePage = (id) => {
    browserHistory.push(`/app/movies/${id}`);
  }

  loadSeries = () => {
    const { pageNumber } = this.state;
    console.log('loadSeries function');
    this.handleChange('page', { valuePage: pageNumber, valueScroll: 1 });
    const nextPage = pageNumber + 1;
    this.setState({ pageNumber: nextPage });
  }

  render() {
    const { series } = this.props; // 30 films at a time
    return(
      <div className="seriesContainer">
        <SearchMenu onKeyDown={this.handleChange}/>
        <div className="list">
          <MenuSeries onChange={this.handleChange} />
          <RangeSeries onChange={this.handleChange} />
          <SortSeries onChange={this.handleChange} />
        </div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadSeries}
          hasMore={true}
          loader={<div className="loader">Loading ...</div>}
          initialLoad={false}
        >
        {
          <div className="allSeries">
            {series && series.length > 0 && series.map((src, key) => {
              return (
                <div key={key} className="displaySeries">
                  {((src.images.poster.length > 0 && <div onClick={() => this.goSeriePage(src.imdb_code)} className="Serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
                    <div className="rateYear">
                      <p>Year: {src.year}</p>
                      <p>Seasons: {src.num_seasons}</p>
                      <p>Rating: {(src.rating === -1 && '-') || src.rating}</p>
                    </div>
                  </div>)
                  ||
                  (<div onClick={() => this.goSeriePage(src.imdb_code)} className="Serie" style={{ backgroundImage: `url('${img}')` }}>
                      <div className="rateYear">
                        <p>Year: {src.year}</p>
                        <p>Seasons: {src.num_seasons}</p>
                        <p>Rating: {(src.rating === -1 && '-') || src.rating}</p>
                      </div>
                    </div>
                  ))}
                  <div className="SerieTitles">
                    <p>{src.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        }
        </InfiniteScroll>
      </div>
    )
  }
}
