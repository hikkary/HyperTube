import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MovieDisplay from '../../Components/MovieDisplay';
import Header from '../../Components/Header';

const App = ({ movies, translation, actions }) =>
  <div>
    <Header/>
    <MovieDisplay movies={movies} translation={translation} actions={actions} />
  </div>

App.propTypes = {
  movies: PropTypes.array.isRequired
};
//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

const mapStateToProps = ({ movies, translation }) => ({ movies, translation });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
