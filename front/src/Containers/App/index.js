import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Header from '../../Components/Header';
import BestOfMovies from '../../Components/BestOfMovies';
import BestOfSeries from '../../Components/BestOfSeries';

const App = ({ translation, actions, movies, series }) =>
  <div>
    <Header/>
    <BestOfMovies movies={movies} actions={actions} translation={translation} />
    <BestOfSeries series={series} actions={actions} translation={translation} />
  </div>

App.propTypes = {
  movies: PropTypes.array.isRequired,
  series: PropTypes.array.isRequired,
};
//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

const mapStateToProps = ({ translation, movies, series }) => ({ translation, movies, series });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    series: bindActionCreators(allTheActions.series, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
