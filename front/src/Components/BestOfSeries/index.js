import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './sass/BestOfSeries.sass';

export default class BestOfSeries extends Component {

  componentDidMount = () => {
    const { actions } = this.props;
    actions.series.TenBestSeries();
  }

  goSeriePage = (id) => {
    browserHistory.push(`/app/series/${id}`);
  }

  render(){
    const { current } = this.props.translation;
    const { series } = this.props;
    return(
      <div>
        <div className="BestSeries">
          <p>{current.bestSeries}</p>
        </div>
        <div className="TenBestSeries">
            {series && series.map((src, key) => {
              return (
                <div key={key} className="displaySeries">
                  <div className="Serie"
                    onClick={() => this.goSeriePage(src.imdb_code)}
                    style={{ backgroundImage: `url('${src.images.poster}')` }}>
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
