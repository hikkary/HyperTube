import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import BestOfMovies from '../../Components/BestOfMovies';
import BestOfSeries from '../../Components/BestOfSeries';
import SearchDisplay from '../../Components/SearchDisplay';
import Search from '../../Components/SearchMenuHomePage';

class HomePage extends Component {
  state= {
    displaySearch: 'none',
    displayBest: '',
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
    id: '',
    page: {
      valueScroll: 0,
      valuePage: 0,
    }
  }

  resetValues = (key) => {
    if (key !== 'page') {
      this.setState({ page: { valuePage: 0, valueScroll: 0 } });
    }
    if (key === 'title') {
      this.setState({ genre: '' });
    }
  };

  handleChange = (key, value) => {
    this.resetValues(key);
    console.log("KEY SEARCH", key);
    console.log("VALUE SEARCH", value);
    this.setState({ [key]: value,  displaySearch: "", displayBest: 'none'  }, () => {
      const { year, rate, genre , sort = { name : 'title', value: 1 }, title, id, page } = this.state;
      this.props.actions.search.getAll({
        yearMin: year.min,
        yearMax: year.max,
        rateMax: rate.max,
        rateMin: rate.min,
        genre,
        sort: sort.name,
        asc: sort.value,
        title,
        id,
        page: page.valuePage,
        scroll: page.valueScroll,
      })
    })
  }

  displayNone = () => {
    this.setState({displayBest: '', displaySearch: 'none' });
  }

  render() {
    const { translation, actions, movies, series, search } = this.props;
    const { displaySearch, displayBest } = this.state;
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

const mapStateToProps = ({ translation, movies, series, search }) => ({ translation, movies, series, search });

const mapDispatchToProps = dispatch => ({
  actions: {
    movies: bindActionCreators(allTheActions.movies, dispatch),
    search: bindActionCreators(allTheActions.search, dispatch),
    series: bindActionCreators(allTheActions.series, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
