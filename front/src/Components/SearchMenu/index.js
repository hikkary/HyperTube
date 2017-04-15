import React, { Component } from 'react';
import './sass/SearchMenu.sass';

export default class SearchMenu extends Component {
  state={
    search: '',
  }

  _mounted = false;

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleChangeSearch = (e) => {
    if (!this._mounted) return false;
    this.setState({ search: e.target.value });
  };

  submit = (event) => {
    if (event.keyCode === 13) {
      this.props.onKeyDown('title', this.state.search);
    }
    if (event.target.value === '') {
      this.props.onKeyDown('title', '');
    }
  };

  render(){
    const { current } = this.props.translation;
    return(
      <div className="searchContainer">
        <input type="text" className="search" name="search" placeholder={current.search} onKeyDown={this.submit} onChange={this.handleChangeSearch}></input>
      </div>
    )
  }
}
