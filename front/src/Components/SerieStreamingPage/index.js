import React, { Component } from 'react';
import _ from 'lodash';
import './sass/SerieStreamingPage.sass';
import api from '../../apiURI';
import axios from 'axios';

export default class SerieStreamingPage extends Component {
  state = {
    redraw: false,
    quality: '',
    lang: '',
  }

  componentDidMount() {
    this.props.actions.serie.getEpisode({
      id: this.props.id,
      serieId: this.props.serieId,
    });
    console.log('DID MOUNT', this.props.user);
    if(this.props.user.language === 'en') { this.setState({ lang: 'eng' }) }
    if(this.props.user.language === 'fr') { this.setState({ lang: 'fre' }) }
    // Mettre le hash a cote du path dans l'objet
  }

  componentWillReceiveProps = async(newProps) => {
    if (newProps.serie && newProps.serie.torrents) {
      if(newProps.user.language === 'en') { this.setState({ lang: 'eng' }) }
      if(newProps.user.language === 'fr') { this.setState({ lang: 'fre' }) }
      const hash = newProps.serie.torrents[0].url;
      const splitHash = await hash.split(':', 4);
      const finalSplit = await splitHash[3].split('&', 1);
      this.setState({ quality: finalSplit[0] });
      if (this.state.quality && this.state.lang) {
      axios({
        method: 'POST',
        url: `${api}/serie/subtitles`,
        data: {
          sublanguageid: this.state.lang,
          imdbid: this.props.serieId,
        }
      }).then((result) => {
        console.log('res front subtitles', result);
        this.setState({ filename: result.data });
      })
    }
  }
}

  changeQuality = (hash) => {
    const splitHash = hash.split(':', 4);
    // console.log(splitHash);
    const finalSplit = splitHash[3].split('&', 1);

    this.setState({ quality: finalSplit[0] , redraw: true });
    setTimeout(() => this.setState({ redraw: false }), 0)
  }

  comments = (e) => {
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
    }
  }

  render() {
    // console.log('this.props', this.props);

    const { redraw } = this.state;
    let comments = [];
    if (this.props.serie && this.props.serie.comments) {
      comments = this.props.serie.comments.map((comment, key) =>
      <p className="userComment" onClick={()=> this.goProfile(comment.id)} key={key}>{comment.username}: {comment.comment}</p>
    )
    // console.log("Comment",comments);
    }
    return (
      <div className="streamingSerie">
        {this.props.serie && <div>
          <div className="episodeTitle">{this.props.serie.title}</div>
          <div className="episodeSummary">{this.props.serie.overview}</div>
        </div>}

        {!redraw && this.state.quality && this.state.filename && <div className="videoPlayer">
          <video crossOrigin width="720" height="540" autoPlay controls style={{
          textAlign: 'center',
        }}>
        {(!this.props.serie.path && <source src={`${api}/stream/serie/${this.state.quality}/${this.props.serieId}/${this.props.id}`} type="video/mp4" />) ||
          (<source src={`http://localhost:8080/public/Media/${this.props.serie.path[this.state.quality].path}`} type="video/mp4" />)
        }
        <track src={`http://localhost:8080/public/subtitles/${this.state.filename}`} kind="subtitles" srcLang="fr" label="French" default/>

        </video>
        </div>
        }

          {this.props.serie && _.map(this.props.serie.torrents, (torrent, key) => {
            return(
              <div key={key}>
                <button onClick={() => { this.changeQuality(torrent.url) } }>{key}</button>
              </div>
            )
          })}
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
