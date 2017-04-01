import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MoviesDisplay from '../../Components/MoviesDisplay';

const Movies = ({ movies, translation, actions, user }) =>
  <div>
    <MoviesDisplay movies={movies} user={user} translation={translation} actions={actions} />
  </div>

Movies.propTypes = {
  movies: PropTypes.array.isRequired,
};

const mapStateToProps = ({ movies , user, translation }) => ({ movies, user, translation });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
