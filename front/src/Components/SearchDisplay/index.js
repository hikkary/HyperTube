import React, { Component } from 'react';
import './SeriesDisplay.sass';
import MenuSeries from './MenuSeries';
import RangeSeries from './RangeSeries';
import SortSeries from './SortSeries';
import _ from 'lodash';
import SearchMenu from '../SearchMenu';
// import axios from 'axios';
// import apiURI from '../../apiURI';

export default class SearchDisplay extends Component {
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
    // this.props.actions.series.getSeries();
  }

  componentWillReceiveProps = (newProps) => {
    if(newProps.search){
      console.log(newProps.search.slice(0, 30));
      this.setState({ series: newProps.search.slice(0, 30), ready: true });
    }
  }

  render() {
    console.log("PROPS", this.props);
    return(
      <div className="seriesContainer">
        {/* <SearchMenu onKeyDown={this.handleChange}/> */}
        <div className="list">
          {/* <MenuSeries onChange={this.handleChange} />
          <RangeSeries onChange={this.handleChange} />
          <SortSeries onChange={this.handleChange} /> */}
        </div>
      <div className="moviesAndSeries">
        {this.state.ready && this.props.search.map((src, key) => {
          return(
              <p>{src.title}</p>
          )

        })}
      </div>
    </div>
  )
}
}
