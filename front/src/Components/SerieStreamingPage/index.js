import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './sass/SerieStreamingPage.sass';
import api from '../../apiURI';

export default class SerieStreamingPage extends Component {
  state = {
    redraw: false,
    quality: '',
  }

  componentDidMount() {
    this.props.actions.serie.getEpisode({
      id: this.props.id,
      serieId: this.props.serieId,
    });
  }

  changeQuality = (hash) => {
    const splitHash = hash.split(':', 4);
    console.log(splitHash);
    const finalSplit = splitHash[3].split('&', 1);

    this.setState({ quality: finalSplit[0] , redraw: true });
    setTimeout(() => this.setState({ redraw: false }), 0)
  }

  render() {
    const { redraw } = this.state;

    return (
      <div className="streamingSerie">
        {this.props.serie && <div>
          <div className="episodeTitle">{this.props.serie.title}</div>
          <div className="episodeSummary">{this.props.serie.overview}</div>
        </div>}

        {!redraw && this.state.quality && <div className="videoPlayer">
          <video width="720" height="540" controls="false" style={{
          textAlign: 'center',
        }}>
        {(!this.props.serie.path && <source src={`${api}/stream/${this.state.quality}/${this.props.serieId}/${this.props.id}`} type="video/mp4" />) ||
          (<source src={`http://localhost:8080/public/Media/${this.props.serie.path}`} type="video/mp4" />)
        }
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
        </div>
  )
  }

}
