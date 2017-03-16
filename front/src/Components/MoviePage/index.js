import React, { Component } from 'react';
import './moviePage.sass';

export default class MoviePage extends Component {
  state = {
    movieInfos: '',
  }
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
    console.log("PROP PROPS PROS",this.props.movie);
    // if (this.props.movie){
    //   const { movie } = this.props;
    //   console.log('MOVIE ', movie);
    // }// console.log('props movies' , movie);
    return (
    <div>
          {this.props.movie.results &&  <div className="infoContainer">
            <div className="displayBigPoster" style={{
              backgroundImage: `url('${this.props.movie.results[0].largeImage}')`
            }}>
              <div className="movieTitle">
                <p>{this.props.movie.results[0].title}</p>
              </div>
              <div className="movieInfo">
                <p>{this.props.movie.results[0].rating} {this.props.movie.results[0].year}</p>
              </div>
              <div className="movieSummary">
                <p>{this.props.movie.results[0].summary}</p>
              </div>
              <div className="movieGenre">
                <p>Genre : {this.toList(this.props.movie.results[0].genres)}</p>
              </div>
              <div className="movieCast">
                <p>With : {this.toList(this.props.movie.results[1].cast)}</p>
              </div>
              <div className="movieDirectors">
                <p>Director : {this.toList(this.props.movie.results[0].directors)}</p>
              </div>
            </div>
          </div>
        }
        )
      </div>
    )
  }
}
