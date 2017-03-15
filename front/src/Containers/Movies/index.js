import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MoviesDisplay from '../../Components/MoviesDisplay';

const Movies = ({ movies, translation, actions }) =>
  <div>
    <MoviesDisplay movies={movies} translation={translation} actions={actions} />
  </div>

Movies.propTypes = {
  movies: PropTypes.array.isRequired
};
//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

const mapStateToProps = ({ movies , translation }) => ({ movies, translation });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
