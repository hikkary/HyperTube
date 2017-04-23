import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
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
	if (isNaN(Number(this.props.id)) === true) {
		browserHistory.push('/app/movies');
		return;
	}
    this.props.actions.movie.getMoviePage({
      id: Number(this.props.id),
    });
    // if (this.props.user.language === 'en') { this.setState({ lang: 'eng' }) }
    // if (this.props.user.language === 'fr') { this.setState({ lang: 'fre' }) }
    if (this.props.user.language === 'en') { this.setState({ lang: 'eng' }) }
    if (this.props.user.language === 'fr') { this.setState({ lang: 'fre' }) }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  return = () =>{
    browserHistory.push('/app/movies');
  }

  componentWillReceiveProps = async(newProps) => {
    if (!this._mounted) return false;
	  if (newProps.movie && newProps.movie.errors === "noMovie") {
		 browserHistory.push('/app/movies');
		 return;

  componentWillReceiveProps = (newProps) => {
    if (!this._mounted) return false;
	if (newProps.movie && newProps.movie.errors){
		browserHistory.push('/app/movies');
		return;
	  }
    if (newProps.movie.results) {
  	  if (newProps.movie.results[0].torrents[0].quality === '3D') {
  		  const hash = newProps.movie.results[0].torrents[1].hash;
  		  this.setState({ quality: hash });
  	  } else {
  		  const hash = newProps.movie.results[0].torrents[0].hash;
  		  this.setState({ quality: hash });
    	}
      if (!this._mounted) return false;
      if (this.props.user.id) {
        this.onPlay(newProps.movie.results[0].id, this.props.user.id);
      }
      if (newProps.user.language === 'en') { await this.setState({ lang: 'eng' }) }
    else if (newProps.user.language === 'fr') { await this.setState({ lang: 'fre' }) }
      else { await this.setState({ lang: 'eng' }) };
      axios({
        method: 'POST',
        url: `${api}/movie/subtitles`,
        data: {
          sublanguageid: this.state.lang,
          hash: this.state.quality,
          imdbid: newProps.movie.results[0].imdb_code,
        }
      }).then((result) => {
        if (!this._mounted) return false;
		if (result.data.status === false ){
			console.log("NOM DE NOM",this.state.filename);
			this.setState({ filename: "error" });
			return;
		}
        this.setState({ filename: result.data });
		console.log("NOM DE NOM",this.state.filename);
      });
      if (newProps.movie && newProps.movie.results.path) {
        const hash = newProps.movie.results[0].torrents[0].hash;
        this.setState({ quality: hash });
      }
    }
  }

  toList = (list) => {
    if (this.props.movie) {
      const infos = list.reduce((accu, name) => accu ? `${accu}, ${name}` : name, '')
      if (infos) return infos;
      else return 'N/A';
    }
  }

  quality = (hash) => {
    if (!this._mounted) return false;
    this.setState({ quality: hash, redraw: true });
    setTimeout(() => {
      if (!this._mounted) return false;
      this.setState({ redraw: false });
    }, 0)
  }

  comments = (e) => {
    e.preventDefault();
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

  handleMedia = () => {
    let mimeType = this.props.movie.results[0].path[this.state.quality].path.split('.');
    mimeType = _.last(mimeType);
    if (mimeType === 'mkv' || mimeType === 'mp4') {
  	return `http://localhost:8080/public/Media/${this.props.movie.results[0].path[this.state.quality].path}`;
    } else {
  	return `${api}/stream/localStream/${this.props.movie.results[0].path[this.state.quality].path}`;
    }
  }

  goProfile = (id) =>{
    browserHistory.push(`/app/user/profile/${id}`)
  }

  onPlay = (movieId, userId) => {
    axios({
      method: 'POST',
      url: `${api}/movie/seenMovie`,
      data: {
        movieId,
        userId,
      }
    }).then((result) => {
      if (result.data.errors) {
        if (!this._mounted) return false;
        this.setState({ error: result.data.errors });
      }
    });
  }

  errorHandler = (error) => {
		const { translation } = this.props;
		return translation.current[error];
	}

  playThrough = (e) =>{
	  console.log(e.target);
	  e.target.play();
  }

  render() {
    let comments = [];
    if (this.props.movie.results && this.props.user && this.props.movie.results[0].comments) {
      comments = this.props.movie.results[0].comments.map((comment, key) =>
      <p className="userCommentMovie" onClick={()=> this.goProfile(comment.id)} key={key}>
        {comment.username} {comment.comment}</p>
      )
    }
    const { movie } = this.props;
    const { redraw } = this.state;
    return (
      <div>
        <div className="infoContainer">
          {this.props.movie.results &&
          <div className="allMoviesInfo">
            <div className="displayBigPoster" style={{
              backgroundImage: `url('${this.props.movie.results[0].largeImage}')`
            }}></div>
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
          </div>}
          <div className="return"><i onClick={this.return} className="fa fa-arrow-circle-left" aria-hidden="true"></i></div>
          <div className="media">
            {!redraw && this.state.quality && this.state.filename && <div className="videoPlayer">
              <video crossOrigin width="640" height="360" onCanPlayThrough={this.playThrough} controls  style={{
                textAlign: 'center',
              }}>
                {(((!this.props.movie.results[0].path) || (this.props.movie.results[0].path && !this.props.movie.results[0].path[this.state.quality])) && <source src={`${api}/stream/movie/${this.state.quality}/${this.props.id}/${this.props.user.id}`} type="video/mp4" />) ||
                (<source src={this.handleMedia()} type="video/mp4" />)}
            {this.state.filename !== "error" &&  <track src={`http://localhost:8080/public/subtitles/${this.state.filename}`} kind="subtitles" srcLang="fr" label="French" default/>}
              </video>
            </div>}
            <div className="buttons">
              {this.props.movie.results && this.props.movie.results[0].torrents.map((torrent, key) => {
                if (torrent.quality === '3D') return false;
                return (
                  <FlatButton key={key} className='oneButton' label={torrent.quality} onClick={() => this.quality(torrent.hash)}
                    style={{
                      marginTop: '10px',
                      marginLeft: '10px',
                      color: 'white',
                    }}>
                  </FlatButton>
                )
              })}
            </div>
            <div className="allCommentsMovie">
              <form onSubmit={this.comments} className="formCommentsMovie">
                <div className="commentsMovie">
                  {comments}
                </div>
                <input className="commentInputMovie" type="text" name="comment" placeholder="Write a comment..." />
              </form>
            </div>
            {movie && movie.errors && <div className="errorMovie">
              {this.errorHandler(movie.errors)}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}
