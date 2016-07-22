import Reflux from 'reflux';
import _ from 'lodash';
import ProductsActions from '../actions/ProductsActions';
import APIActions from '../actions/APIActions';
import FiltersStore from './FiltersStore';
import WishlistActions from '../../me/actions/WishlistActions';
import { A, F, FOF, MF, ML } from '../constants/ProductsConstants';
import track from '../../tracking';

const debug = require('debug')(__filename);

const CURRENTINDEX = 10;
const INCREMENTINDEX = 10;

let _products = null;

let _productsOriginal = null;
let _currentIndex = null;
let _cache = {};

function _resetCurrentIndex() {
  _currentIndex = CURRENTINDEX;
}

function setNumReviewers(products) {
  const _currentTab = FiltersStore.getCurrentTab();

  products.map(v => {
    switch (_currentTab) {
      case A:
        var allr = v.all_reviewers;
        v.numReviewers = allr ? allr.length : 0;
        break;
      case F:
        var fr = v.f_reviewers;
        v.numReviewers = fr ? fr.length : 0;
        break;
      case FOF:
        var fofr = v.fof_reviewers;
        v.numReviewers = fofr ? fofr.length : 0;
        break;
      case MF:
        var mf = v.mf_reviewers;
        v.numReviewers = mf ? mf.length : 0;
        break;
      case ML:
        var ml = v.ml_reviewers;
        v.numReviewers = ml ? ml.length : 0;
        break;
      default:
        break;
    }
  });
}


export default Reflux.createStore({

  listenables: [ProductsActions, APIActions],

  init() {
    _resetCurrentIndex();
  },

  getProductsState() {
    if (!_products) { return null; }
    setNumReviewers(_products.slice(0, _currentIndex));
    return {
      products: _products.slice(0, _currentIndex),
      currentPage: FiltersStore.getCurrentTab(),
    };
  },

  onFetchInitialDataCompleted(data) {
    debug('onFetchInitialDataCompleted');
    const { products } = data;
    _products = _.shuffle(products);
    _productsOriginal = _products.slice();
    WishlistActions.setWishlist(_productsOriginal.filter(p => p.iswish));
    track('WISHLIST_APP_LOADED');
    this.trigger(this.getProductsState());
  },

  onSetCache(tab) {
    debug('onSetCache');
    _cache[tab] = _products;
  },

  onResetCache() {
    debug('resetCache');
    _cache = {};
  },

  // search products with text search, tags and sort
  onSearch(textSearch, sortBy, tags, tab, checkCache) {

    debug('onSearch', textSearch, sortBy, tags, tab, checkCache);

    if (checkCache && _cache[tab]) {
      debug('Getting products from cache.');
      _products = _cache[tab];
      _resetCurrentIndex();
      this.trigger(this.getProductsState());
      return true;
    }

    // The subset of products for the current tab
    let tabSubset = null;

    // what we are returning
    let queryResult = [];

    // are the tags a subset?
    let isSubset = null;

    // the text we are searching
    const regex = new RegExp(textSearch, 'i');

    // an array of tag names that are checked
    const filteredTags = tags.filter(t => t.isChecked).map(t => t.name);

    // We filter the products for the current tab
    switch (tab) {

        // All reviewers
      case A:
        tabSubset = _productsOriginal;
        break;

        // Friends reviewers
      case F:
        tabSubset = _productsOriginal.filter(e => {
          let res = null;
          if (e.f_reviewers && e.f_reviewers.length > 0) {
            res = true;
          } else {
            res = false;
          }
          return res;
        });
        break;

        // Friends of friend reviewers
      case FOF:
        tabSubset = _productsOriginal.filter(e => {
          let res = null;
          if (e.fof_reviewers && e.fof_reviewers.length > 0) {
            res = true;
          } else {
            res = false;
          }
          return res;
        });
        break;

        // Friends with mutual friends
      case MF:
        tabSubset = _productsOriginal.filter(e => {
          let res = null;
          if (e.mf_reviewers && e.mf_reviewers.length > 0) {
            res = true;
          } else {
            res = false;
          }
          return res;
        });
        break;

        // Friends with mutual likes
      case ML:
        tabSubset = _productsOriginal.filter(e => {
          let res = null;
          if (e.ml_reviewers && e.ml_reviewers.length > 0) {
            res = true;
          } else {
            res = false;
          }
          return res;
        });
        break;
      default:
    }

    // for all products, do check if regex match
    // and intersection for tags
    if (tabSubset) {
      tabSubset.forEach(product => {
        isSubset = filteredTags.length === _.intersection(filteredTags, product.tags).length;
        if ((!textSearch || regex.test(product.name)) && isSubset) {
          queryResult.push(product);
        }
      });
    }

    // sort the results
    switch (sortBy) {

        // Random sort
      case 'Random':
        queryResult = _.shuffle(queryResult);
        break;

        // Sort by title
      case 'Title':
        queryResult.sort((a, b) => {
          // Compare the 2 titles
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        break;

        // Sort by release year
      case 'Release Year':
        queryResult.sort((a, b) => {
          // Compare the 2 dates
          if (a.caracteristic_1 > b.caracteristic_1) return -1;
          if (a.caracteristic_1 < b.caracteristic_1) return 1;
          return 0;
        });
        break;

      default:
        break;
    }

    // the products that will be returned
    _products = queryResult;
    _resetCurrentIndex();
    this.trigger(this.getProductsState());
  },

  onShuffle() {
    debug('onShuffle');
    if (!_products) { return; }
    _resetCurrentIndex();
    _products = _.shuffle(_products);
    this.trigger(this.getProductsState());
  },

  onIncrementCurrentIndex() {
    // debug('onIncrementCurrentIndex');
    if (!_products) { return; }
    _currentIndex += INCREMENTINDEX;
    if (_currentIndex > _products.length) {
      _currentIndex = _products.length;
    }
    this.trigger(this.getProductsState());
  },

  onSetIsNotWish(id) {
    debug('onSetIsNotWish');
    for (var i = 0; i < _productsOriginal.length; i++) {
      if (_productsOriginal[i].id === id) {
        _productsOriginal[i].iswish = false;
        break;
      }
    }
    for (var j = 0; j < _products.length; j++) {
      if (_products[j].id === id) {
        _products[j].iswish = false;
        break;
      }
    }
  },

  onSetIsWish(id) {
    debug('onSetIsWish');
    for (var i = 0; i < _productsOriginal.length; i++) {
      if (_productsOriginal[i].id === id) {
        _productsOriginal[i].iswish = true;
        break;
      }
    }
    for (var j = 0; j < _products.length; j++) {
      if (_products[j].id === id) {
        _products[j].iswish = true;
        break;
      }
    }
  },

  onResetIndex() {
    debug('onResetIndex');
    _resetCurrentIndex();
    this.trigger(this.getProductsState());
  },

});
