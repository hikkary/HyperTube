import React, { Component } from 'react';

export default class MoviePage extends Component {
  state={
    movie: '',
    ready: false,
  }

  componentWillReceiveProps = (newProps) => {
    console.log('heyyyykjjjjjj proppssss');
    console.log('RECEIVED', newProps.movies);
    this.setState({ movie: newProps.movies, ready:true })
  }

  componentDidMount() {
    console.log('PROPS AU DID', this.props);
    this.props.actions.movies.getMovie({
      id: this.props.id,
    })
    console.log('movies props', this.props.movies);
  }

  render() {
    return (
      <div>
      { this.state.ready && this.state.movie.map((movie, key) => {
        return (
          <p key={key}>{movie.title}</p>
        )
      }) }
      </div>
    )
  }
}
