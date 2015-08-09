var Reflux = require("reflux"),
    ProductActions = require("../actions/ProductsActions"),
    FiltersActions = require("../actions/FiltersActions"),
    FiltersStore = require("./FiltersStore"),
    WishlistActions = require("../../me/actions/WishlistActions"),
    {ALL, FRIENDS, FOF} = require("../constants/ProductsConstants"),
    _ = require("lodash"),
    debug = require("debug")(__filename);

// Protected variables
// the products
var _products,
    _productsOriginal,
    // the current index for infinite scroll
    CURRENTINDEX = 10,
    INCREMENTINDEX = 10,
    _currentIndex,
    _cache = {
    },
    _currentPage;

function _resetCurrentIndex(){
  _currentIndex = CURRENTINDEX;
}

function setNumReviewers(products){
  // We set the number of reviewers given the current page
  // as a product property

  products.map(function(v){
    switch(_currentPage){
      // ALL REVIEWERS
    case 0:
      var allr = v.all_reviewers;
      v.numReviewers = allr ? allr.length : 0;
      break;

      // FRIENDS
    case 1:
      var fr = v.f_reviewers;
      v.numReviewers = fr ? fr.length : 0;
      break;

      // FRIENDS OF FRIENDS
    case 2:
      var fofr = v.fof_reviewers;
      v.numReviewers = fofr ? fofr.length : 0;
      break;
    default:
      break;
    }
  });
  return products;
}


var ProductsStore = Reflux.createStore({
  listenables: [ProductActions],

  init() {
    // initialization
    _currentPage = ALL;
    _resetCurrentIndex();
  },

  // setup called by us
  setup(products) {
    _products = products;
    _productsOriginal = _products.slice();
    WishlistActions.setWishlist(_productsOriginal.filter(p => p.iswish));
  },

  getCurrentPage() {
    return _currentPage;
  },

  // get the products
  getProductsState() {
    var products = setNumReviewers(_products.slice(0, _currentIndex));

    return {
      products: _products.slice(0, _currentIndex),
      currentPage: _currentPage
    };
  },
  onSetCache(tab){
    debug("onSetCache");
    _cache[tab] = _products;
  },

  onResetCache(){{
    _cache = {};
  }},

  // search products with text search, tags and sort
  onSearch(textSearch, sortBy, tags, tab, checkCache) {

    debug("onSearch", textSearch, sortBy, tags, tab, checkCache);

    if(checkCache && _cache[tab]) {
      debug("Getting products from cache.");
      _products = _cache[tab];
      _resetCurrentIndex();
      this.trigger(this.getProductsState());
      return true;
    }

    // The subset of products for the current tab
    var tabSubset = null,

        // what we are returning
        queryResult = [],

        // the text we are searching
        regex = new RegExp(textSearch, "i"),

        // are the tags a subset?
        isSubset = null,

        // an array of tag names that are checked
        filteredTags = tags.filter(function(t){
          return t.isChecked;
        }).map(function(t){
          return t.name;
        });

    // We filter the products for the current tab
    switch(tab){

    // All reviewers
    case ALL:
      tabSubset = _productsOriginal;
      break;

    // Friends reviewers
    case FRIENDS:
      tabSubset = _productsOriginal.filter(function(e, i){
        if(e.f_reviewers && e.f_reviewers.length > 0){
          return true;
        } else {
          return false;
        }
      });
      break;

    // Friends of friend reviewers
    case FOF:
      tabSubset = _productsOriginal.filter(function(e, i){
        if(e.fof_reviewers && e.fof_reviewers.length > 0){
          return true;
        } else {
          return false;
        }
      });
      break;
    default:
    }

    // for all products, do check if regex match
    // and intersection for tags
    tabSubset.forEach(function(product){
      isSubset = filteredTags.length ===  _.intersection(filteredTags, product.tags).length;
      if(regex.test(product.name) && isSubset){
        queryResult.push(product);
      }
    });

      // sort the results
      switch(sortBy){

        // Random sort
      case "Random":
        queryResult = _.shuffle(queryResult);       
        break;

        // Sort by title
      case "Title":
        queryResult.sort(function(a, b){
          // Compare the 2 titles
          if(a.name < b.name) return -1;
          if(a.name > b.name) return 1;
          return 0;
        });
        break;

        // Sort by release year
      case "Release Year":
        queryResult.sort(function(a, b){
          // Compare the 2 dates
          if(a.caracteristic_1 > b.caracteristic_1) return -1;
          if(a.caracteristic_1 < b.caracteristic_1) return 1;
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

  // shuffle products
  onShuffle(tab){
    debug("onShuffle");
    _resetCurrentIndex();
    _products = _.shuffle(_products);
    this.trigger(this.getProductsState());
  },

  // Increment the current index of visible products
  onIncrementCurrentIndex: function(){
    debug("onIncrementCurrentIndex");
    _currentIndex += INCREMENTINDEX;
    if(_currentIndex > _products.length){
      _currentIndex = _products.length;
    }
    this.trigger(this.getProductsState());
  },

  onSetIsNotWish(id){
    debug("onSetIsNotWish");
    for(var i = 0; i < _productsOriginal.length; i++) {
      if(_productsOriginal[i].id === id){
        _productsOriginal[i].iswish = false;
        break;
      }
    }
    for(var i = 0; i < _products.length; i++) {
      if(_products[i].id === id){
        _products[i].iswish = false;
        break;
      }
    }
  },

  onSetIsWish(id){
    debug("onSetIsWish");
    for(var i = 0; i < _productsOriginal.length; i++) {
      if(_productsOriginal[i].id === id){
        _productsOriginal[i].iswish = true;
        break;
      }
    }
    for(var i = 0; i < _products.length; i++) {
      if(_products[i].id === id){
        _products[i].iswish = true;
        break;
      }
    }
  },

  onResetIndex() {
    debug("onResetIndex");
    _resetCurrentIndex();
    this.trigger(this.getProductsState());
  }

});

module.exports = ProductsStore;
