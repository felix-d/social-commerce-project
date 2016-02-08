import React from 'react';
import Reflux from 'reflux';
import FiltersStore from '../stores/FiltersStore';
import FiltersActions from '../actions/FiltersActions';
import classnames from 'classnames';
import track from '../../tracking';

// are we typing in search field
let typingInSearchField = false;
// We are waiting some time before searching
let typingTimeout = null;
// to compare if new search is the same as old search.
// If it is, we dont refresh!
let oldSearchValue = null;

export default React.createClass({

  mixins: [Reflux.connect(FiltersStore)],

  getInitialState() {
    return FiltersStore.getFiltersState();
  },

  // sorting - select sort by
  _sort(e) {
    track('SORTED_BY', {sortedBy: e.target.value});
    this.setState({sortBy: e.target.value});
    FiltersActions.sortBy(e.target.value);
  },

  // text search
  _textSearch(e) {
    const val = e.target.value;
    this.setState({textSearch: val});
    // We only execute a search query when the user stops
    // typing for more than 0.2 seconds!
    if (typingInSearchField) {
      clearTimeout(typingTimeout);
    }

    typingInSearchField = true;
    typingTimeout = setTimeout(() => {
      typingInSearchField = false;
      const newSearchValue = val;
      if (oldSearchValue !== newSearchValue) {
        oldSearchValue = val;
        FiltersActions.textSearch(val);
      }
    }, 200);
  },


  // shuffle products
  _shuffle() {
    FiltersActions.shuffle();
  },

  render() {

    if (!this.state || !this.state.tags) { return null; }

    // the tag cloud
    const tagsCheckbox = this.state.tags.map((t, i) => {

      // Handler for clicking on tag toggles
      const toggleTag = () => {
        t.isChecked = !t.isChecked;
        FiltersActions.search();
        track('TAG_SELECTED', {tag: t.name});
      };

      var classes = classnames('btn', 'btn-default', {
        active: t.isChecked,
      });

      return (
        <label className={classes} onClick={toggleTag} key={i}>
          <input type="checkbox"/>
          {t.name}
        </label>
      );
    });
    return (
      <div id="sidebar">

        {/* Search box */}
        <h4><i className="fa fa-search"></i> Search</h4>
        <input id="input-search" ref="searchInput" type="text" value={this.state.textSearch} onChange={this._textSearch}/>

        {/* Sorting */}
        <h4><i className="fa fa-sort"></i> Sort by</h4>
        <select className="form-control"
                ref="selectSort"
                value={this.state.sortBy}
                onChange={this._sort}>
          <option>Random</option>
          <option>Title</option>
          <option>Release Year</option>
        </select>

        {/* Tag cloud */}
        <h4><i className="fa fa-tags"></i> Tags</h4>
        <div className="tags-group"
             data-toggle="buttons"
             ref="selectedTags">
          {tagsCheckbox}
        </div>

        {/* Shuffle button */}
        <button className="btn btn-primary"
                id="shuffle-button"
                onClick={this._shuffle}>
          Shuffle
        </button>
      </div>
    );
  },
});
