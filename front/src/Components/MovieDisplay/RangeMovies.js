import React, { Component } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './MovieDisplay.sass';

export default class RangeMovies extends Component {
  state = {
    year: {
      min: 1900,
      max: 2017,
    },
    rate: {
      min: 0,
      max: 10,
    }
  }

  handleChangeYear = (values) => {
    this.setState({ year: values });
    this.props.onChange('year', values);
  }

  handleChangeRating = (values) => {
    this.setState({ rate: values });
    this.props.onChange('rate', values);
  }

  render(){
    console.log('hey', this.props);
    // const {current} = this.props.translation;
    const { genreButton } = this.state;
    return(
      <div className="ranges">
        <InputRange
          maxValue={2017}
          minValue={1900}
          value={this.state.year}
          onChange={this.handleChangeYear}
        />
        <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.rate}
          onChange={this.handleChangeRating}
        />
      </div>
    )
  }
}
