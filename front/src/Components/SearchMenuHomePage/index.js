import React, { Component } from 'react';

export default class SearchMenu extends Component {
  state={
    search: '',
  }

  handleChangeSearch = (e) => {
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
    return(
      <div className="searchContainer">
    
        <input type="text" className="Search" name="search" placeholder="Search..." onKeyDown={this.submit} onChange={this.handleChangeSearch}></input>
      </div>
    )
  }
}
