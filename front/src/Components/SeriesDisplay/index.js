import React, { Component } from 'react';
import './SeriesDisplay.sass';
import MenuSeries from './MenuSeries';
import RangeSeries from './RangeSeries';
import SortSeries from './SortSeries';
import _ from 'lodash';
import SearchMenu from '../SearchMenu';
// import axios from 'axios';
// import apiURI from '../../apiURI';

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
  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.series.getSeries();
  }

  componentWillReceiveProps = (newProps) => {
    console.log(newProps.series.slice(0, 30));
    this.setState({ series: newProps.series.slice(0, 30), ready: true });
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value }, () => {
      const { genres, year, rate, filter, title_search } = this.state;
      this.props.actions.series.getSeries({
        genres,
        yearMin: year.min,
        yearMax: year.max,
        rateMin: rate.min,
        rateMax: rate.max,
        filter: filter.name,
        sorted: filter.value,
        title_search,
      })
    })
  }

  render() {
    return(
      <div className="seriesContainer">
        <SearchMenu onKeyDown={this.handleChange}/>
        <div className="list">
          <MenuSeries onChange={this.handleChange} />
          <RangeSeries onChange={this.handleChange} />
          <SortSeries onChange={this.handleChange} />
        </div>
      <div className="allSeries">
          {this.state.ready && this.state.series.map((src, key) => {
            console.log(src.rating);
            return (
              <div key={key} className="displaySeries">
              <div className="Serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
                <div className="rateYear">
                  <p>Year: {src.year}</p>
                  <p>Seasons: {src.num_seasons}</p>
                  <p>Rating: {(src.rating === -1 && '-') || src.rating}</p>
                  </div>
              </div>
              <div className="SerieTitles">
                <p>{src.title}</p>
              </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
