import React, { Component } from 'react';
import './moviePage.sass';
import api from '../../apiURI';
import axios from 'axios';

export default class MoviePage extends Component {
  state = {
    movieInfos: '',
    quality: '',
  }

  componentDidMount() {
    this.props.actions.movie.getMoviePage({
      id: this.props.id,
    });
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.movie.results) {
      console.log('newprops', newProps.movie.results[0].torrents[0].hash);
      const hash = newProps.movie.results[0].torrents[0].hash;
      this.setState({ quality: hash });
    }
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

  // play = () => {
  //   axios({
  //     method: 'POST',
  //     url: `${api}/stream`,
  //     data: {
  //       hash: this.state.quality,
  //     }
  //   })
  // }

  quality = (hash) => {
    this.setState({ quality: hash });
  }

  render() {
    if (this.props.movie.results) {
      console.log("PROP RESULT[0]",this.props.movie.results[0]);
    console.log("PROP RESULT[0]",this.props.movie.results[1]);
    console.log("PROP PROPS .torrents",this.props.movie.results[0].torrents);
  }
  console.log('QUALITY HASH', this.state.quality);
  // console.log('state hash', this.state.quality);
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
        {this.state.quality && <video width="620" height="540" controls>
          <source src={`${api}/stream/${this.state.quality}`} type="video/mp4" />
        </video>
        }
        {this.props.movie.results && this.props.movie.results[0].torrents.map((torrent, key) => {
          return(
            <div key={key}>
              <button label={torrent.quality} onClick={() => this.quality(torrent.hash) }>{torrent.quality}</button>
            </div>
          )
        })
      }
      </div>
    )
  }
}
