import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import './sass/SerieStreamingPage.sass';
import api from '../../apiURI';
import axios from 'axios';

export default class SerieStreamingPage extends Component {
  state = {
    redraw: false,
    quality: '',
    lang: '',
  }

  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    this.props.actions.serie.getEpisode({
      id: this.props.id,
      serieId: this.props.serieId,
    });
    console.log('DID MOUNT', this.props.user);
    if(this.props.user.language === 'en') { this.setState({ lang: 'eng' }) }
    if(this.props.user.language === 'fr') { this.setState({ lang: 'fre' }) }
    // Mettre le hash a cote du path dans l'objet
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentWillReceiveProps = async(newProps) => {
    if (!this._mounted) return false;
    if (newProps.serie && newProps.serie.torrents) {
      if(newProps.user.language === 'en') { this.setState({ lang: 'eng' }) }
      if(newProps.user.language === 'fr') { this.setState({ lang: 'fre' }) }
      const hash = newProps.serie.torrents[0].url;
      const splitHash = await hash.split(':', 4);
      const finalSplit = await splitHash[3].split('&', 1);
      this.setState({ quality: finalSplit[0] });
	  console.log('NEW PROPS FINAL', newProps);
	  console.log('NEW STATE FINAL', this.state);
      if (this.state.quality && this.state.lang) {
      axios({
        method: 'POST',
        url: `${api}/serie/subtitles`,
        data: {
          sublanguageid: this.state.lang,
          imdbid: this.props.serieId,
          season: newProps.serie.season,
          episode: newProps.serie.episode,
        }
      }).then((result) => {
        if (!this._mounted) return false;
        console.log('res front subtitles', result);
        this.setState({ filename: result.data });
      })
    }
  }
}

  return = () => {
    console.log("MES PROPS",this.props);
    const {serieId} = this.props;
    browserHistory.push(`/app/series/${serieId}`)
  }

  changeQuality = (hash) => {
    if (!this._mounted) return false;
    const splitHash = hash.split(':', 4);
    // console.log(splitHash);
    const finalSplit = splitHash[3].split('&', 1);
    this.setState({ quality: finalSplit[0] , redraw: true });
    setTimeout(() => this.setState({ redraw: false }), 0)
  }

  comments = (e) => {
    if (!this._mounted) return false;
    e.preventDefault();
    console.log(e.target.comment.value);
    const { comment } = e.target;
    const { username, id } = this.props.user;
    const episodeId = this.props.id;
    console.log(episodeId);
    const serieId = this.props.serieId;
    console.log(serieId);
    if (this.props.actions) {
      this.props.actions.serie.addCommentSerie(
        comment.value,
        username,
        id,
        serieId,
        episodeId,
      );
      comment.value = '';
    }
  }

  onPlay = (serieId, userId, episodeId) => {
    console.log('entereddddddd', userId);
    axios({
      method: 'POST',
      url: `${api}/serie/seenSerie`,
      data: {
        serieId,
        userId,
        episodeId,
      }
    }).then((result) => {
      console.log('yo', result);
      if (result.data.errors) {
        this.setState({ error: result.data.errors });
      }
    });
  }


  render() {
    // console.log('this.props', this.props);
	console.log("STATE REMDER", this.state);
	console.log("PROPS RENDER ", this.props);
    const { redraw } = this.state;
    let comments = [];
    if (this.props.serie && this.props.user && this.props.serie.comments) {
      comments = this.props.serie.comments.map((comment, key) =>
      <p className="userCommentSerie" onClick={()=> this.goProfile(comment.id)} key={key}>
        <img role="presentation" className="picUser" src={`http://localhost:8080/public/${this.props.user.picture}`} />
        {comment.username} {comment.comment}</p>
    )
    console.log("Comment",comments);
    }
    return (
      <div className="streamingSerie">
        {this.props.serie && <div>
          <div className="episodeTitle">{this.props.serie.title}</div>
          <div className="episodeSummary">{this.props.serie.overview}</div>
        </div>}
        <div className="return"><i onClick={this.return} className="fa fa-arrow-circle-left" aria-hidden="true"></i></div>

        {!redraw && this.state.quality && this.state.filename && <div className="videoPlayer">
          <video crossOrigin width="640" height="360" onPlay={this.onPlay(this.props.serieId, this.props.user.id, this.props.serie.tvdb_id)} autoPlay controls style={{
          textAlign: 'center',
        }}>
        {(((!this.props.serie.path) || (this.props.serie.path && !this.props.serie.path[this.state.quality])) && <source src={`${api}/stream/serie/${this.state.quality}/${this.props.serieId}/${this.props.id}`} type="video/mp4" />) ||
          (<source src={`http://localhost:8080/public/Media/${this.props.serie.path[this.state.quality].path}`} type="video/mp4" />)
        }
        <track src={`http://localhost:8080/public/subtitles/${this.state.filename}`} kind="subtitles" srcLang="fr" label="French" default/>

        </video>
        </div>
        }
          <div className="buttonsSerie">
          {this.props.serie && _.map(this.props.serie.torrents, (torrent, key) => {
            if(key === '0') return ;
            return(
              <div key={key}>
                <FlatButton key={key}
                  className='oneButton'
                  label={key}
                  onClick={() => { this.changeQuality(torrent.url) } }
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    color: 'white',
                  }}>

                </FlatButton>
              </div>
            )
          })}
        </div>
          <div className="allCommentsSerie">
            <form onSubmit={this.comments} className="formCommentsSerie">
              <div className="commentsSerie">
                {comments}
              </div>
              <input className="commentInputSerie" type="text" name="comment" placeholder="Write a comment..." />
            </form>
          </div>
        </div>
  )
  }

}
