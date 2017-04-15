import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MoviePage from '../../Components/MoviePage';

const Movie = ({ translation, actions, id, movie, user }) =>
  <div>
    <MoviePage movie={movie} user={user} id={id} translation={translation} actions={actions} />
  </div>

const mapStateToProps = (state, ownProps) => ({
  translation: state.translation,
  id: ownProps.params.id,
  movie: state.movie,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    movie: bindActionCreators(allTheActions.movie, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
