import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

class App extends Component {
  render() {
    const {actions, user, translation } = this.props;
    return (
      <div className="parentOfEverything">
        <Header translation={translation} user={user} actions={actions} />
        <div className="middleOfEverything">
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
};

App.propTypes = {
  movies: PropTypes.array.isRequired,
  series: PropTypes.array.isRequired,
  search: PropTypes.array.isRequired,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(App);
