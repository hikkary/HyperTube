import React, { Component } from 'react';
import './sass/SearchMenuHomePage.sass';

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
    if(this.props.onChange){
      if(e.target.value === ''){
        this.props.onChange();
      }
    }
    this.setState({ search: e.target.value });
  }

  submit = (event) => {
    if (event.keyCode === 13) {
      this.props.onKeyDown('title', this.state.search);
    }
  }

  render(){
    const { current } = this.props.translation;
    return(
      <div className="searchContainer">
        <input type="text" className="search" name="search" placeholder={current.search} onKeyDown={this.submit} onChange={this.handleChangeSearch}></input>
      </div>
    )
  }
}
