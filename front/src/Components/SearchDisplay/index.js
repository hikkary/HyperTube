import React, { Component } from 'react';
import _ from 'lodash';
import SearchMenu from '../SearchMenu';
import './SearchDisplay.sass';
// import axios from 'axios';
// import apiURI from '../../apiURI';

export default class SearchDisplay extends Component {
  state={
    ready: false,
    genres: '',
    year: {
      min: 1900,
      max: 2017,
    },
    rate: {
      min: 0,
      max: 10,
    },
    filter: {
      name: 'title',
      sorted: 1,
    },
    title_search: '',
  }

  componentDidMount = () => {
    console.log("PROPS",this.props);
    // this.props.actions.series.getSeries();
  }

  componentWillReceiveProps = (newProps) => {
    if(newProps.search){
      console.log("NOUVELLE PROPS SA MERE",newProps.search.slice(0, 30));
      this.setState({ series: newProps.search.slice(0, 30), ready: true });
    }
  }

  seriesDisplay = (src, key) =>(
  <div className="allInfo">
     <div
       key={key}
       className="Serie"
       style={{ backgroundImage: `url('${src.images.poster}')` }}
       >
         <div className="textContainer">
           <p>Year: {src.year}</p>
           {src.num_seasons && <p>Seasons: {src.num_seasons}</p>}
           <p>Rating: {(src.rating === -1 && '-') || src.rating}</p>
           </div>

     </div>
     <div className="title">
       <p>{src.title}</p>
     </div>
   </div>
  )

  moviesDisplay = (src, key) => (
    <div className="allInfo">
    <div
      className="movie"
      key={key}
      style={{ backgroundImage: `url('${src.largeImage}')` }}
    >
      <div className="textContainer">
        <p>Rate: {src.rating} </p>
        <p>{src.year} </p>
      </div>

</div>
<div className="title">
  <p>{src.title} </p>
</div>
</div>
  )

  render() {
    console.log("PROPS", this.props);
    return(
      <div className="searchContainer">

        <div className="moviesAndSeries">
          {this.state.ready && this.props.search.map((src, key) => {
            return (
                (src.images && src.images.poster && this.seriesDisplay(src,key)) ||
                this.moviesDisplay(src, key)
              )
  })
}
  </div>
</div>
)

}
}
