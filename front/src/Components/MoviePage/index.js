import React, { Component } from 'react';

export default class MoviePage extends Component {
  state={
    movie: '',
    ready: false,
  }

  componentWillReceiveProps = (newProps) => {
    console.log('RECEIVED', newProps.movies);
    this.setState({ movie: newProps.movies, ready:true })
  }

  componentDidMount() {
    console.log('PROPS AU DID', this.props);
    this.props.actions.movies.getMovie({
      id: this.props.params.id,
    })
  }

  render() {
    console.log(this.props);
    return (
      <div>
      { this.state.ready && this.state.movie.map((movie, key) => {
        return (
          <p key={key}>{movie.title} </p>
        )
      }) }
      </div>
    )
  }
}
