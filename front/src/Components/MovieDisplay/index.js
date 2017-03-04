import React, { PropTypes, Component } from 'react';
import './moviedisplay.sass';

export default class MovieDisplay extends Component {

  state = {
    ready : false,
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({movies:newProps.movies.slice(0,30), ready:true })

  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.movies.getMovie();
  }

  fadeIn = (event) => {
    console.log(event.parentNode);
    event.target.style.opacity = 0.4;

  }

  fadeOut = (event) => {
    // console.log(event.target);
    event.target.style.opacity = 1;

  }

  render(){
    const {current} = this.props.translation
    return(
      <div className="allMovie">
                {/* <ul> */}

            { this.state.ready && this.state.movies.map(movie =>{
              return(
                <div className="allInfo" key={movie.id + Math.random(10000, 50000)}>
                    <div
                      className="movie"
                      key={movie.id + Math.random(10000, 50000)}
                      style={{ backgroundImage: `url('${movie.largeImage}')` }}
                    >
                      <div className="textContainer">
                        <p key={movie.id + Math.random(10000, 50000)}>{current.rate}: {movie.rating} </p>
                        <p key={movie.id + Math.random(10000, 50000)}>{movie.year} </p>
                      </div>
                    </div>
                <div className="title" key={movie.id + Math.random(10000, 50000)}>
                  <p key={movie.id + Math.random(10000, 50000)}>{movie.title} </p>
                </div>
              </div>
             )

             })}
        {/* </ul> */}
      </div>
    )
  }
}
