import React, { PropTypes, Component } from 'react';

export default class MovieDisplay extends Component {

  componentDidMount = () => {
    console.log("PROPS",this.props);
  }

  render(){
    return(
      <div>
        <ul>
          {this.props.movies.map(movie => <p key={movie.id}>{movie.title} </p>)}
        </ul>
      </div>
    )
  }
}
