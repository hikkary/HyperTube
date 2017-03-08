import React, { Component } from 'react';
import './SeriesDisplay.sass';
import axios from 'axios';
import apiURI from '../../apiURI';

export default class SeriesDisplay extends Component {

  state={
    ready: false,
  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    this.props.actions.series.getSerie();
  }

  componentWillReceiveProps = (newProps) => {
    console.log(newProps.series.slice(0, 30));
    this.setState({ series: newProps.series.slice(0, 30), ready: true });
  }

  getInfo = (imdb) => {
    axios(
    {
      method : 'POST',
      url : `${apiURI}/series/getInfo`,
      data: {
        imdb,
      },
      })
    .then((data) => {
      // this.setState({ rating : data. })
        console.log('data axios imdb', data.data);
      });
  }
  render() {
    return(
      <div className="allSeries">
          {this.state.ready && this.state.series.map((src, key) => {
            console.log(src.rating);
            return (
              <div key={key} className="displaySeries">
              <div className="Serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
                <div className="rateYear">
                  <p>Year: {src.year}</p>
                  <p>Seasons: {src.num_seasons}</p>
                  <p>Rating: {src.rating === -1 && '-' || src.rating}</p>
                  </div>
              </div>
              <div className="SerieTitles">
                <p>{src.title}</p>
              </div>
              </div>
            )
          })}
      </div>
    )
  }
}
