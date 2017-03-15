import React, { Component } from 'react';
import './moviePage.sass';

export default class MoviePage extends Component {

  componentDidMount() {
    this.props.actions.movie.getMoviePage({
      id: this.props.id,
    })
  }

  toList = (list) => {
		 let tmp = "";
    if (this.props.movie)
    {
      console.log('DANS GENRE LIST');
			for (let data in list) {
        // console.log(this.props.movie.genres[data]);
				if (data && data + 1) {
					tmp += list[data]+", ";
				}
			}
			return tmp;
    }
	}

  render() {
    console.log("PROPS",this.props.movie)
    // const { movie } = this.props.movie;
    return (
    <div>
          <div className="infoContainer">
            <div className="displayBigPoster" style={{
              backgroundImage: `url('${this.props.movie.largeImage}')`
            }}>
              <div className="movieTitle">
                <p>{this.props.movie.title}</p>
              </div>
              <div className="movieInfo">
                <p>{this.props.movie.rating} {this.props.movie.year}</p>
              </div>
              <div className="movieSummary">
                <p>{this.props.movie.summary}</p>
              </div>
              <div className="movieGenre">
                <p>Genre : {this.toList(this.props.movie.genres)}</p>
              </div>
              <div className="movieCast">
                <p>With : {this.toList(this.props.movie.cast)}</p>
              </div>
              <div className="movieDirectors">
                <p>Director : {this.toList(this.props.movie.directors)}</p>
              </div>
            </div>
          </div>
        )
      </div>
    )
  }
}
