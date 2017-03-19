import React, { Component } from 'react';
import './sass/seriePage.sass';

export default class SeriePage extends Component {

  componentDidMount() {
    // console.log('this.props.id', this.props.id);
    this.props.actions.serie.getSeriePage({
      id: this.props.id,
    })
  }

  render() {
    console.log("PROPS",this.props.serie);
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
              <p>{this.props.serie.description}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
