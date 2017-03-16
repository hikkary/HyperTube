import React, { Component } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './MoviesDisplay.sass';

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
  }

  handleChangeYearToProps = () => {
    console.log("YWRUWERIEW OEWJR",this.state.year);
    this.props.onChange('year', this.state.year);
  }

  handleChangeRating = (values) => {
    this.setState({ rate: values });
  }

  handleChangeRatingToProps = () => {
    this.props.onChange('rate', this.state.rate);
  }

  render(){
    // console.log('hey', this.props);
    // const {current} = this.props.translation;
    // const { genreButton } = this.state;
    return(
      <div className="ranges">
        <InputRange
          maxValue={2017}
          minValue={1900}
          value={this.state.year}
          onChangeComplete={this.handleChangeYearToProps}
          onChange={this.handleChangeYear}
        />
        <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.rate}
          onChange={this.handleChangeRating}
          onChangeComplete={this.handleChangeRatingToProps}
        />
      </div>
    )
  }
}
