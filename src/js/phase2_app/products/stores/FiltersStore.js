import Reflux from 'reflux';

import ProductsActions from '../actions/ProductsActions';
import FiltersActions from '../actions/FiltersActions';
import APIActions from '../actions/APIActions';

import { A, F, FOF, MF, ML } from '../constants/ProductsConstants';

const debug = require('debug')(__filename);

let _tags = null;
let _textSearch = null;
let _sortBy = 'Random';
let _tab = A;
let _tabs = null;

function addIsCheckedFalse(tags) {
  return tags.map(t => ({name: t, isChecked: false}));
}

function resetTagsToFalse(tags) {
  return tags.forEach(t => t.isChecked = false);
}

export default Reflux.createStore({

  listenables: [FiltersActions, APIActions],

  getTagsState() {
    return {
      tags: _tags,
    };
  },

  getFiltersState() {
    const state = {
      activeTab: _tab,
      tabs: _tabs,
      tags: _tags,
      sortBy: _sortBy,
      textSearch: _textSearch,
    };
    return state;
  },

  getActiveTab() {
    return _tab;
  },

  getTabs() {
    return _tabs;
  },

  getCurrentTab() {
    return _tab;
  },

  // return the tags
  getTags() {
    return _tags;
  },

  // get text search value
  getTextSearch() {
    return _textSearch;
  },

  // get sort by
  getSortBy() {
    return _sortBy;
  },

  onFetchInitialDataCompleted(data) {
    debug('onFetchInitialDataCompleted', data);
    const { tags, tabs } = data;
    _tags = addIsCheckedFalse(tags);
    _tabs = tabs || [];
    this.trigger(this.getFiltersState());
  },

  // when the user inputs in text search
  onTextSearch(text) {
    debug('onTextSearch');
    _textSearch = text;
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab);
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
  },

  // when the user changes the sort method
  onSortBy(sortBy) {
    debug('onSortBy');
    _sortBy = sortBy;
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab);
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
  },

  // shuffle the products
  onShuffle() {
    debug('onShuffle');
    _sortBy = 'Random';
    ProductsActions.shuffle();
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
    this.trigger(this.getFiltersState());
  },

  // search with tags
  onSearch() {
    debug('onSearch');
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab);
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
  },

  // When the user changes the current tab
  onChangeTab(tab) {
    debug('onChangePage', tab);

    // We create the products subset
    switch (tab) {
      case A:
        _tab = A;
        break;
      case F:
        _tab = F;
        break;
      case FOF:
        _tab = FOF;
        break;
      case MF:
        _tab = MF;
        break;
      case ML:
        _tab = ML;
        break;
      default:
    }
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab, true);
    ProductsActions.setCache(_tab);
    this.trigger(this.getFiltersState());
  },

  onResetSideBar() {
    debug('onResetSideBar');
    resetTagsToFalse(_tags);
    _sortBy = 'random';
    _textSearch = '';
    // $('.tags-group label').removeClass('active');
    this.trigger(this.getFiltersState());
  },
});

