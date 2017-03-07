import React, { Component } from 'react';
import './SeriesDisplay.sass';

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

  render() {
    // let i = 0;
    return(
      <div className="allSeries">
          {this.state.ready && this.state.series.map((src, key) => {
            return (
              <div key={key} className="displaySeries">
              <div className="Serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
                <div className="rateYear">
                  <p>Year: {src.year}</p>
                  <p>Seasons: {src.num_seasons}</p>
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
