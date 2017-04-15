import React, { Component } from 'react';
import './sass/MoviesDisplay.sass';
import FlatButton from 'material-ui/FlatButton';

export default class SortMovies extends Component {
  state = {
    title: -1,
    year: -1,
    rate: -1,
  }

  sortTitle = () => {
    this.state.title === 1 ? this.setState({ title: -1 }) : this.setState({ title: 1 }) ;
    this.props.onChange('sort', { name:'title', value: this.state.title });
  }

  sortYear = () => {
    this.state.year === 1 ? this.setState({ year: -1 }) : this.setState({ year: 1 }) ;
    this.props.onChange('sort', { name:'year', value: this.state.year });
  }

  sortRate = () => {
    this.state.rate === 1 ? this.setState({ rate: -1 }) : this.setState({ rate: 1 }) ;
    this.props.onChange('sort', { name:'rating', value: this.state.rate });
  }

  render(){
    const { current } = this.props.translation;
    return(
      <div className="sorted">
        <FlatButton label={current.sortTitle} onClick={this.sortTitle}/>
        <FlatButton label={current.sortYear} onClick={this.sortYear}/>
        <FlatButton label={current.sortRate} onClick={this.sortRate} />
      </div>
    )
  }
}
