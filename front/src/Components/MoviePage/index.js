import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './sass/moviePage.sass';
import api from '../../apiURI';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';

export default class MoviePage extends Component {
  state = {
    movieInfos: '',
    quality: '',
    lang: '',
    redraw: false,
    error: '',
  }

  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    this.props.actions.movie.getMoviePage({
      id: Number(this.props.id),
    });
    if(this.props.user.language === 'en') { this.setState({ lang: 'eng' }) }
    if(this.props.user.language === 'fr') { this.setState({ lang: 'fre' }) }
// faire requet axios avec ces params:



    // if (this.props.movie.results) {
    //   console.log('ON RENTRE ICI DANS LE SATANE RECEIVE PROPS');
    //   console.log('newprops', this.props.movie.results[0].torrents[0].hash);
    //   const hash = this.props.movie.results[0].torrents[0].hash;
    //   this.setState({ quality: hash });
    // }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  return = () =>{
    browserHistory.push('/app/movies');
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.movie.results) {
      console.log('ON RENTRE ICI DANS LE SATANE RECEIVE PROPS');
      console.log('newprops', newProps.movie.results[0].torrents[0].hash);
	  if (newProps.movie.results[0].torrents[0].quality === '3D'){
		  const hash = newProps.movie.results[0].torrents[1].hash;
		  this.setState({ quality: hash });
	  }
	  else{
		  const hash = newProps.movie.results[0].torrents[0].hash;
		  this.setState({ quality: hash });
  		}
      if (!this._mounted) return false;
      console.log("AVANT LE FONCTION", this.props.user.id);
      if(this.props.user.id){
        this.onPlay(newProps.movie.results[0].id, this.props.user.id);
      }
    axios({
      method: 'POST',
      url: `${api}/movie/subtitles`,
      data: {
        sublanguageid: this.state.lang,
        hash: this.state.quality,
        imdbid: newProps.movie.results[0].imdb_code,
      }
    }).then((result) => {
      console.log('res subtitles', result);
      if (!this._mounted) return false;
      this.setState({ filename: result.data });
    });
    // if (newProps.movie && newProps.movie.results.path) {
    //   console.log('ON RENTRE ICI DANS LE SATANE RECEIVE PROPS');
    //   console.log('newprops', newProps.movie.results[0].torrents[0].hash);
    //   const hash = newProps.movie.results[0].torrents[0].hash;
    //   this.setState({ quality: hash });
    // }
    }
  }


  toList = (list) => {
    if (this.props.movie) {
      console.log('DANS GENRE LIST');
      const infos = list.reduce((accu, name) => accu ? `${accu}, ${name}` : name, '')
      if (infos) return infos;
      else return 'N/A';
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
    setTimeout(() => {
      if (!this._mounted) return false;
      this.setState({ redraw: false });
    }, 0)
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
      comment.value = '';
    }
  }

  goProfile = (id) =>{
    browserHistory.push(`/app/user/profile/${id}`)
  }

  onPlay = (movieId, userId) => {
    console.log('entereddddddd', userId);
    axios({
      method: 'POST',
      url: `${api}/movie/seenMovie`,
      data: {
        movieId,
        userId,
      }
    }).then((result) => {
      console.log('yo', result);
      if (result.data.errors) {
        this.setState({ error: result.data.errors });
      }
    });
  }

  render() {
    console.log("PRRRRROOOPS",this.props);
    let comments = [];
    if (this.props.movie.results && this.props.user && this.props.movie.results[0].comments) {
      // console.log("PATHHHHH", this.props.movie.results[0].path[this.state.quality].path);
      comments = this.props.movie.results[0].comments.map((comment, key) =>
      <p className="userComment" onClick={()=> this.goProfile(comment.id)} key={key}>
        <img role="presentation" className="picUser" src={`http://localhost:8080/public/${this.props.user.picture}`} />
        {comment.username} {comment.comment}</p>
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
                <p> Rate: {this.props.movie.results[0].rating} </p>
                <p> Released: {this.props.movie.results.Released} </p>
                <p> Runtime: {this.props.movie.results.Runtime}</p>
              </div>
              <div className="movieSummary">
                <p>{this.props.movie.results[0].summary}</p>
              </div>
              <div className="movieGenre">
                <p>Genre : {this.toList(this.props.movie.results[0].genres)}</p>
              </div>
              <div className="movieCast">
                <p>With : {this.props.movie.results.Actors}</p>
              </div>
              <div className="movieDirectors">
                <p>Director : {this.toList(this.props.movie.results[0].directors)}</p>
              </div>
            </div>
            </div>
        }
        <div className="return"><i onClick={this.return} className="fa fa-arrow-circle-left" aria-hidden="true"></i></div>
        <div className="media">
        {!redraw && this.state.quality && this.state.filename && <div className="videoPlayer">
          <video crossOrigin width="640" height="360" controls autoPlay style={{
          textAlign: 'center',
        }}>
        {(((!this.props.movie.results[0].path) || (this.props.movie.results[0].path && !this.props.movie.results[0].path[this.state.quality])) && <source src={`${api}/stream/movie/${this.state.quality}/${this.props.id}/${this.props.user.id}`} type="video/mp4" />) ||
          (<source src={`http://localhost:8080/public/Media/${this.props.movie.results[0].path[this.state.quality].path}`} type="video/mp4" />)
        }
          <track src={`http://localhost:8080/public/subtitles/${this.state.filename}`} kind="subtitles"  default/>
        </video>
        </div>
        }
        <div className="buttons">
        {this.props.movie.results && this.props.movie.results[0].torrents.map((torrent, key) => {
          if(torrent.quality === '3D') return ;
          return(
              <FlatButton key={key} className='oneButton' label={torrent.quality} onClick={() => this.quality(torrent.hash)}
                style={{
                  marginTop: '10px',
                  marginLeft: '10px',
                  color: 'white',
                }}
                ></FlatButton>
          )
        })
      }
      </div>
      <div className="allComments">
        <form onSubmit={this.comments} className="formComments">
          <div className="comments">
            {comments}
          </div>
          <input className="commentInput" type="text" name="comment" placeholder="Write a comment..." />
        </form>
      </div>
    </div>
      </div>

    )
  }
}
