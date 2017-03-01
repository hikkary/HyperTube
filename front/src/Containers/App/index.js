import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MovieDisplay from '../../Components/MovieDisplay';

const App = ({ movies, actions }) =>
  <div>
    <MovieDisplay movies={movies} actions={actions} />
  </div>

App.propTypes = {
  movies: PropTypes.array.isRequired
};
//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

const mapStateToProps = ({ movies }) => ({ movies });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
