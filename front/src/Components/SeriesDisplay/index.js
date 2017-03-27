import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './sass/SeriesDisplay.sass';
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
    genre: '',
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
    page: {
      valueScroll: 0,
      valuePage: 0,
    },
  }

  componentDidMount = () => {
    console.log("PROPS DID MOUNT SERIESDISPLAY",this.props);
    this.loadSeries = _.debounce(this.loadSeries, 1000);
    this.handleChange();
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
      const { genre, id, year, rate, sort = { name: 'title', value: 1 }, title, page } = this.state;
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
      });
    });
  };

  goSeriePage = (id) => {
    browserHistory.push(`/app/series/${id}`);
  }

  loadSeries = () => {
    const { page = { valuePage: 1, valueScroll: 1 } } = this.state;
    this.handleChange('page', page);
    const nextPage = page.valuePage + 1;
    this.setState({ page: { valuePage: nextPage, valueScroll: 1 } });
  }

  render() {
    const { series } = this.props;
    return(
      <div className="seriesContainer">
        <SearchMenu translation={this.props.translation} onKeyDown={this.handleChange}/>
        <SortSeries translation={this.props.translation} onChange={this.handleChange} />
        <RangeSeries onChange={this.handleChange} />
        <div className="list">
          <MenuSeries onChange={this.handleChange} />

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
                  {((src.images && src.images.poster.length > 0 && <div onClick={() => this.goSeriePage(src.imdb_code)} className="Serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
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
