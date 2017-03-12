import React, { Component } from 'react';
// import './moviePage.sass';

export default class SeriePage extends Component {
  state = {
  }

  componentDidMount() {
    this.props.actions.movie.getSeriePage({
      id: this.props.id,
    })
  }

  render() {
    console.log("PROPS",this.props.serie)
    return (
    <div>
          <div className="infoContainer">
            <div className="displayBigPoster" style={{
              backgroundImage: `url('${this.props.serie.images}')`
            }}>
              <div className="serieTitle">
                <p>{this.props.serie.title}</p>
              </div>
              <div className="serieInfo">
                <p>{this.props.serie.rating}</p>
              </div>
              <div className="serieSummary">
                <p>{this.props.serie.summary}</p>
              </div>
            </div>
          </div>
        )
      </div>
    )
  }
}
