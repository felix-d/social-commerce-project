var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductConstants = require('../constants/ProductConstants');
var ReviewBoxStore = require('./ReviewBoxStore');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

// The initial sorting order
var _sortBy = 'Random',
    _productsOriginal,
    _num,
    _tags,
    _numberOfReviews,
    _products,
    _currentIndex = 20,
    _lastReviewedId;

// Return the number of reviewed products by the current user
function getNumberOfReviewedProducts(products) {
  var count = 0;
  for (var i = 0, l = products.length; i < l; i++) {
    if (products[i].review) count++;
  }
  return count;
}

// The number of products that are currently visible
function resetCurrentIndex() {
  _currentIndex = 20;
}

var ProductStore = assign({}, EventEmitter.prototype, {

  // called by root component at startup
  init(products, tags, num) {

    _productsOriginal = products;

    // We add a field to every tags
    _tags = tags.map(t => ({name: t, isChecked: false}));

    _numberOfReviews = getNumberOfReviewedProducts(_productsOriginal);

    // We do a shallow copy to _products, which is the rendered array
    _products = _productsOriginal.slice();

    // The number of reviews
    _num = num;
  },

  // Sets the initial data after having called fetchInitialData()
  setInitialData({ products, numberReviews, tags }) {

    _productsOriginal = products;

    // We add a field to every tags
    _tags = tags.map(t => ({name: t, isChecked: false}));

    _numberOfReviews = getNumberOfReviewedProducts(_productsOriginal);

    // We do a shallow copy to _products, which is the rendered array
    _products = _productsOriginal.slice();

    // The number of reviews
    _num = numberReviews;

    this.shuffleProducts();
  },

  getLastReviewedId() {
    return _lastReviewedId;
  },

  resetReviewedId() {
    _lastReviewedId = undefined;
  },

  // get the product from id
  getProductFromId(id) {
    for (var i = 0, l = _productsOriginal.length; i < l; i++) {
      if (_productsOriginal[i].id === id) {
        return _productsOriginal[i];
      }
    }
    return null;
  },

  // Used by the ProductsContainer component to set its state
  getProducts() {
    // preload images by chunks of 15
    return {
      products: _products && _products.slice(0, _currentIndex),
    };
  },

  // Used by the SideBar component to set its state
  getTags() {
    return {
      tags: _tags,
    };
  },

  // We execute a search query
  doSearch(query, sortBy) {
    const regex = new RegExp(query, 'i');

    // what will be returned
    let queryResult = [];
    let subset = null;
    let tags = null;

    // an array of tag names that are checked
    tags = _tags.filter(t => t.isChecked).map(t => t.name);

    // for all products, do check if regex match
    // and intersection for tags
    _productsOriginal.forEach(product => {
      subset = tags.length === _.intersection(tags, product.tags).length;
      if (regex.test(product.name) && subset) {
        queryResult.push(product);
      }
    });

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
    resetCurrentIndex();
  },

  shuffleProducts() {
    resetCurrentIndex();
    _products = _.shuffle(_products);
  },

  getNumReviews() {
    return _num;
  },

  // Increment the current number of products
  incrementCurrentIndex() {
    _currentIndex += 10;
    if (_currentIndex > _products.length) {
      _currentIndex = _products.length;
    }
  },

  deleteReviewWithId(product) {
    for (var i = 0; i < _products.length; i++) {
      if (_products[i].id === product.id) {
        _products[i].review = false;
      }
    }
    _num--;
    _lastReviewedId = product.id;

    ReviewBoxStore.resetReviewData();
  },

  // optimistic rendering
  submit_review(product, reviewData) {

    // if we were not editing the product
    if (!product.review) {
      // we increment the number of reviews!
      _num++;
    }
    // we update review state
    var boolAnswers = [];
    for (var i = 0; i < reviewData.tabs.length; i++) {
      for (var j = 0; j < reviewData.tabs[i].categories.length; j++) {
        for (var k = 0; k < reviewData.tabs[i].categories[j].elements.length; k++) {
          var elem = reviewData.tabs[i].categories[j].elements[k];
          boolAnswers.push({
            id: elem.id,
            val: elem.isChecked,
          });
        }
      }
    }
    product.review = {
      boolAnswers,
      comment: reviewData.comment,
      rating: reviewData.rating,
    };

    _lastReviewedId = product.id;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

AppDispatcher.register(function handler(action) {
  switch (action.actionType) {
    case ProductConstants.SHUFFLE_PRODUCTS:
      ProductStore.shuffleProducts();
      ProductStore.emitChange();
      break;
    case ProductConstants.SEARCH_PRODUCTS:
      ProductStore.doSearch(action.data.query, action.data.sortBy);
      ProductStore.emitChange();
      break;
    case ProductConstants.SUBMIT_REVIEW:
      ProductStore.submit_review(action.product, action.reviewData);
      ProductStore.emitChange();
      break;
    case ProductConstants.DELETE_REVIEW:
      ProductStore.deleteReviewWithId(action.product);
      ProductStore.emitChange();
      break;
    case ProductConstants.INFINITE_SCROLL:
      ProductStore.incrementCurrentIndex();
      ProductStore.emitChange();
      break;
    case ProductConstants.SET_INITIAL_DATA:
      ProductStore.setInitialData(action.data);
      ProductStore.emitChange();
      break;
    default:
      break;
  }
});
module.exports = ProductStore;
