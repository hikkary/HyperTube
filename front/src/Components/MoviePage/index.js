import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './sass/moviePage.sass';
import api from '../../apiURI';
// import axios from 'axios';

export default class MoviePage extends Component {
  state = {
    movieInfos: '',
    quality: '',
    redraw: false,
  }

  componentDidMount() {
    this.props.actions.movie.getMoviePage({
      id: this.props.id,
    });
    // if (this.props.movie.results) {
    //   console.log('ON RENTRE ICI DANS LE SATANE RECEIVE PROPS');
    //   console.log('newprops', this.props.movie.results[0].torrents[0].hash);
    //   const hash = this.props.movie.results[0].torrents[0].hash;
    //   this.setState({ quality: hash });
    // }
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.movie.results) {
      console.log('ON RENTRE ICI DANS LE SATANE RECEIVE PROPS');
      console.log('newprops', newProps.movie.results[0].torrents[0].hash);
      const hash = newProps.movie.results[0].torrents[0].hash;
      this.setState({ quality: hash });
    }
    // if (newProps.movie && newProps.movie.results.path) {
    //   console.log('ON RENTRE ICI DANS LE SATANE RECEIVE PROPS');
    //   console.log('newprops', newProps.movie.results[0].torrents[0].hash);
    //   const hash = newProps.movie.results[0].torrents[0].hash;
    //   this.setState({ quality: hash });
    // }
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

  // showControl = (e) => {
  //   console.log("ON EST ENTRER DNAS SHOW CONTROL");
  //   console.log(e);
  //   e.controls = true;
  // }

  quality = (hash) => {
    this.setState({ quality: hash, redraw: true });
    setTimeout(() => this.setState({ redraw: false }), 0)
  }

  comments = (e) => {
    e.preventDefault();
    console.log(e.target.comment.value);
    const { comment } = e.target;
    const { username, id } = this.props.user;
    const movie_id = this.props.id;
    if (this.props.actions) {
      this.props.actions.movie.addCommentMovie(
        comment.value,
        username,
        id,
        movie_id
      );
    }
  }

  goProfile = (id) =>{
    browserHistory.push(`/app/user/profile/${id}`)
  }

  render() {
    let comments = [];
    if (this.props.movie.results && this.props.movie.results[0].comments) {

      comments = this.props.movie.results[0].comments.map((comment, key) =>
      <p className="userComment" onClick={()=> this.goProfile(comment.id)} key={key}>{comment.username}: {comment.comment}</p>
    )
    console.log("Comment",comments);
    }
    const { redraw } = this.state
  setTimeout(() => {
    console.log('QUALITY HASH RENDER', this.state.quality);
  },3000)
  // console.log('state hash', this.state.quality);
    // if (this.props.movie){
    //   const { movie } = this.props;
    //   console.log('MOVIE ', movie);
    // }// console.log('props movies' , movie);
    return (
    <div>
          {this.props.movie.results && <div className="infoContainer">
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
                <p>With : {this.toList(this.props.movie.results[0].cast)}</p>
              </div>
              <div className="movieDirectors">
                <p>Director : {this.toList(this.props.movie.results[0].directors)}</p>
              </div>
            </div>
            </div>
        }
        {!redraw && this.state.quality && <div className="videoPlayer">
          <video width="720" height="540" controls="false" style={{
          textAlign: 'center',
        }}>
        {(!this.props.movie.results[0].path && <source src={`${api}/stream/${this.state.quality}/${this.props.id}`} type="video/mp4" />) ||
          (<source src={`http://localhost:8080/public/Media/${this.props.movie.results[0].path}`} type="video/mp4" />)
        }
    
        </video>
        </div>

        }
        {this.props.movie.results && this.props.movie.results[0].torrents.map((torrent, key) => {
          return(
            <div key={key}>
              <button label={torrent.quality} onClick={() => this.quality(torrent.hash) }>{torrent.quality}</button>
            </div>
          )
        })
      }
      <div className="comments">
        {comments}
      </div>
      <div>
        <form onSubmit={this.comments}>
          <input type="text" name="comment" placeholder="Leave a comment" />
          <input type="submit" value="send" />
        </form>
      </div>
      </div>

    )
  }
}
