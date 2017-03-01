import React, { PropTypes, Component } from 'react';

export default class MovieDisplay extends Component {

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.movies.getMovie();
  }

  render(){
    return(
      <div>
        <ul>
          {this.props.movies.map(movie => <p key={movie.id + Math.random(10000, 50000)}>{movie.title} </p>)}
        </ul>
      </div>
    )
  }
}
