import React, { Component } from 'react';
import _ from 'lodash';
import GenreSerie from '../GenreSerie';
import './sass/SeriesDisplay.sass';

export default class MenuSeries extends Component {

  state = {
    bcolor: '#363637',
    genreButton: 'buttonList',
    operatorGenre: '+',
  }

  colorGenre = (e) => {
   let bColor = '#'+ Math.floor(Math.random()*16777215).toString(16);
   this.setState({ bcolor: bColor });
    e.target.style.backgroundColor = bColor;
  }

  resetDiv = (e) =>{
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  }

  resetColor = (e) =>{
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }

  displayMenu = (e) => {
    this.state.genreButton === 'genreButton' ? this.setState({ genreButton: 'buttonList', operatorGenre: '+' }) : this.setState({ genreButton: 'genreButton', operatorGenre: '-' }) ;
  }

  all = () => (
	  <div className="onGenre">
    <button
      className={this.state.genreButton}
      onClick={() => this.props.onChange('genre', '')}
      onMouseOut={this.resetColor}
      onMouseOver={this.colorGenre}
      style={{
        margin : '2px',
      }}>
      All
      </button>
  </div>
  )

  render(){
    // const {current} = this.props.translation;
    const { genreButton } = this.state;
    return(
        <div className="onList">
        <p className="genreTitle" onClick={this.displayMenu}>
        {this.state.operatorGenre} GENRES</p>
          {this.all()}
          {GenreSerie.map((genre, key) => {
            return(
              <div className="onGenre" key={key}>
                <button
                  className={genreButton}
                  onClick={() => this.props.onChange('genre', genre)}
                  onMouseOut={this.resetColor}
                  onMouseOver={this.colorGenre}
                  style={{
                    margin : '2px',
                  }}>
                    {genre}
                  </button>
              </div>
            )
          })}
      </div>
    )
  }
}
