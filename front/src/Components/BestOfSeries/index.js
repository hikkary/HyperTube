import React, { Component } from 'react';
import '../MovieDisplay/MovieDisplay.sass';

export default class BestOfSeries extends Component {
  state = {
    ready : false,
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({ tenBestSeries: newProps.series, ready: true });
  }

  componentDidMount = () => {
    const { actions } = this.props;
    actions.series.TenBestSeries();
    console.log(this.props);
  }

  render(){
    const {current} = this.props.translation;
    return(
      <div>
      <div className="BestSeries">
        <p>{current.bestSeries}</p>
      </div>
      <div className="TenBestSeries">
          {this.state.ready && this.state.tenBestSeries.map((src, key) => {
            return (
              <div key={key} className="displaySeries">
                <div className="Serie" style={{ backgroundImage: `url('${src.images.poster}')` }}>
                  <div className="rateYear">
                    <p>Year: {src.year}</p>
                    <p>Seasons: {src.num_seasons}</p>
                    <p>Rating: {src.rating || '-'}</p>
                    </div>
                </div>
                <div className="SerieTitles">
                  <p>{src.title}</p>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    )
  }
}
