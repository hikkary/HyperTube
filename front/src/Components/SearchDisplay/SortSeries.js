import React, { Component } from 'react';
import './SeriesDisplay.sass';
import FlatButton from 'material-ui/FlatButton';

export default class SortSeries extends Component {
  state = {
    title: -1,
    year: -1,
    rate: -1,
  }

  sortTitle = () => {
    this.state.title === 1 ? this.setState({ title: -1 }) : this.setState({ title: 1 }) ;
    this.props.onChange('filter', {name:'title', value: this.state.title});
  }

  sortYear = () => {
    this.state.year === 1 ? this.setState({ year: -1 }) : this.setState({ year: 1 }) ;
    this.props.onChange('filter', {name:'year', value: this.state.year});
  }

  sortRate = () => {
    this.state.rate === 1 ? this.setState({ rate: -1 }) : this.setState({ rate: 1 }) ;
    this.props.onChange('filter', {name:'rating', value: this.state.rate});
  }

  render(){
    console.log('hey', this.props);
    return(
      <div className="sorted">
        <FlatButton label="Sort By Title" onClick={this.sortTitle}/>
        <FlatButton label="Sort By Year" onClick={this.sortYear}/>
      <FlatButton label="Sort By Rate" onClick={this.sortRate} />
    </div>
    )
  }
}
