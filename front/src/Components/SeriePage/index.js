import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './sass/seriePage.sass';

export default class SeriePage extends Component {
  state = {
    divDisplay: 'seasonDisplay',
    currentSeason: null,
  }

  componentDidMount() {
    // console.log('this.props.id', this.props.id);
    this.props.actions.serie.getSeriePage({
      id: this.props.id,
    })
  }

  serieStreaming = (episode) => {
    const id = episode.tvdb_id;
    const serieId = this.props.id;
    browserHistory.push(`/app/series/${serieId}/${id}`);
  }

  return = () => {
    if(this.state.divDisplay === "seasonDisplay"){
      browserHistory.push('/app/series')
    } else {
      this.setState({divDisplay: 'seasonDisplay', currentSeason: null})
    }
  }

  seen = (serie) => {
    // console.log('MY ID', this.props.user.id);
    // console.log('MY PROPS', this.props);
    if (serie && serie.seenBy) {
      const seen = serie.seenBy.map((user) => {
        if(user === this.props.user.id)
        {
          return "Seen";
        }
      });
      seen = seen.filter((see) => {
        if (see){
          return see
          }
      })

      console.log("SEEEN" ,seen);
      if (seen.length !== 0) return <i className="fa fa-eye" aria-hidden="true"></i>;
      else return ;
    }
  }


  episodesList = (season) => {
    if (this.props.serie.content) {
      const episodes = this.props.serie.content.map((episode, key) => {
        if(episode.season === season){
          let divName = episode.episode % 2 !== 0 ? 'episodes one' : 'episodes two';
          return(
            <div key={key} className={divName} onClick={() => { this.serieStreaming(episode) } }>
              <p> E {episode.episode} S {season} {episode.title} {this.seen(episode)}</p>
            </div>
          )}
          return null;
      });
      return episodes;
    }
  }

  changeSeason = (season) =>{
    this.setState({ currentSeason: season, divDisplay: 'seasonNone' });
  }

  seasonDisplay = () => {
    let seasons = this.props.serie.content.map((serie) => serie.season);
    seasons = _.uniq(seasons)
    return seasons.map((season, key) =>
      <div key={key} className="season" >
      {this.props.serie && this.props.serie.images &&  <div onClick={() => { this.changeSeason(season) } } className="poster" style={{
          backgroundImage: `url('${this.props.serie.images.poster}')`
        }}>
        </div>
      }
        <p>Season {season}</p>
      </div>
    )
  }
  render() {
    return (
      <div>
        <div className="infoContainer">
        {this.props.serie && this.props.serie.images &&
			<div className="allSerieInfo">
			<div className="displayBigPoster" style={{
            backgroundImage: `url('${this.props.serie.images.poster}')`
          }}>
		   </div>

            <div className="serieTitle">
              <p>{this.props.serie.title}</p>
            </div>
            <div className="serieInfo">
              <p>Rate: {Math.floor(this.props.serie.rating)}</p>
            </div>
			<div className="serieReleased">
              <p>Released: {this.props.serie.released}</p>
		   </div>
		   <div className="serieDuration">
				<p>Released: {this.props.serie.duration}</p>
		  </div>
            <div className="serieSummary">
              <p>{this.props.serie.description}</p>
            </div>
			<div className="serieGenre">
			  <p>Genres: {this.props.serie.genres}</p>
			</div>
			<div className="serieCast">
			  <p>With: {this.props.serie.cast}</p>
			</div>
			<div className="serieDirectors">
			  <p>Directors: {this.props.serie.directors}</p>
			</div>
		</div>}
          <div className="return"><i onClick={this.return} className="fa fa-arrow-circle-left" aria-hidden="true"></i></div>

          <div className={this.state.divDisplay}>
            {this.props.serie && this.props.serie.content && (this.seasonDisplay())}
          </div>
          <div className="listEpisodes">
              {this.props.serie && this.props.serie.content && this.state.currentSeason && this.episodesList(this.state.currentSeason)}
          </div>
        </div>
      </div>
    )
  }
}
