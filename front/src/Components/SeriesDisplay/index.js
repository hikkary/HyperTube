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
  state = {
	hasMore: true,
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
    this.loadSeries = _.debounce(this.loadSeries, 1000);
    this.handleChange();
  }

  componentWillReceiveProps (newProps){
	  if (newProps.series && newProps.series.length === 0) {
		  this.setState({ hasMore: false });
	  } else {
		  this.setState({ hasMore: true });
	  }
	  if (newProps.series[0] && newProps.series[0].errors) {
		  this.setState({ hasMore: false });
	  }
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
        genre,
        id,
        year,
        rate,
        sort = { name: 'year', value: -1 },
        title,
        page
      } = this.state;
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
    const { current } = this.props.translation;
    return(
      <div className="seriesContainer">
        <SearchMenu translation={this.props.translation} onKeyDown={this.handleChange}/>
        <SortSeries translation={this.props.translation} onChange={this.handleChange} />
        <RangeSeries onChange={this.handleChange} />
        <div className="list">
          <MenuSeries onChange={this.handleChange} />
        </div>
		    {!this.state.hasMore && <div className="noMedia"> <p>{current.noSeriesFound}</p></div>}
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadSeries}
          hasMore={this.state.hasMore}
          loader={<div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>}
          initialLoad={false}
        >
        {
          <div className="allSeries">
            {series && series.length > 0 && !series[0].errors && series.map((src, key) => {
              return (
                <div key={key} className="displaySeries">
                  {((src.images && src.images.poster.length > 0 && <div onClick={() => this.goSeriePage(src.imdb_code)} className="serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
                    <div className="rateYear">
                      <p>Year: {src.year}</p>
                      <p>Seasons: {src.num_seasons}</p>
                      <p>Rating: {(src.rating === -1 && '-') || src.rating}</p>
                    </div>
                  </div>)
                  ||
                  (<div onClick={() => this.goSeriePage(src.imdb_code)} className="serie" style={{ backgroundImage: `url('${img}')` }}>
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
