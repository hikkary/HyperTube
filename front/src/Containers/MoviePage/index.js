import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import MoviePage from '../../Components/MoviePage';
import Header from '../../Components/Header';

const Movie = ({ translation, actions }) =>
  <div>
    <Header/>
    <MoviePage translation={translation} actions={actions} />
  </div>

//
// const mapStateToProps = (state) => ({
//   movies: state.movies,
// });

const mapStateToProps = ({ translation }) => ({ translation });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
