import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import BestOfMovies from '../../Components/BestOfMovies';
import BestOfSeries from '../../Components/BestOfSeries';
import SearchDisplay from '../../Components/SearchDisplay';
import Search from '../../Components/SearchMenu';

class HomePage extends Component {
  state={
    displaySearch: 'none',
    displayBest: '',
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

  // componentWillReceiveProps = (newProps) => {
  //   console.log("NEWPROSSS ", newProps);
  //   if(newProps.search){
  //     console.log(newProps.search.slice(0, 30));
  //     this.setState({ series: newProps.search.slice(0, 30), ready: true });
  //   }
  // }

  handleChange = (key, value) => {
    this.setState({ [key]: value, displaySearch: "", displayBest: 'none' }, () => {
      const { genres, year, rate, filter, title_search } = this.state;
      this.props.actions.search.getAll({
        genres,
        yearMin: year.min,
        yearMax: year.max,
        rateMin: rate.min,
        rateMax: rate.max,
        filter: filter.name,
        sorted: filter.value,
        title_search,
      })
    })
  }

  displayNone = () => {
    this.setState({displayBest: '', displaySearch: 'none' })
  }

  render() {
    const { translation, actions, movies, series, search, user } = this.props;
    const {displaySearch, displayBest} = this.state;
    return (
      <div>
        <Search onKeyDown={this.handleChange} onChange={this.displayNone}/>
        <div className="searchDiv" style={{
          display: displaySearch,
        }}>
        <SearchDisplay search={search} />
      </div>
        <div className="displayApp" style={{
          display: displayBest,
        }}>
          <BestOfMovies movies={movies} actions={actions} translation={translation} />
          <BestOfSeries series={series} actions={actions} translation={translation} />
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  movies: PropTypes.array.isRequired,
  series: PropTypes.array.isRequired,
  search: PropTypes.array.isRequired,
};
//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

const mapStateToProps = ({ translation, movies, series, search, user }) => ({ translation, movies, series, search, user });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    search: bindActionCreators(allTheActions.search, dispatch),
    series: bindActionCreators(allTheActions.series, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
    user: bindActionCreators(allTheActions.user, dispatch),
  },
});



export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
