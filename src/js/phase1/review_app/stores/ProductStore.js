var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductConstants = require('../constants/ProductConstants');
var ReviewBoxStore = require("./ReviewBoxStore");
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var REVIEWCHANGE_EVENT = 'change_review';

// Number of product per page
var _perPage = 10,
    // The initial sorting order
    _sortBy = 'Random',
    // will set to true when a review gets submitted
    // to disallow reslicking the whole thing
    _dontSlick = false,
    // The number of the page just reviewed
    _reviewedPage = null,

    // these will be set in init
    _productsOriginal,
    _tags,
    _numberOfReviews,
    _products;

// Takes an array of products and a number and
// returns the paginated array
function getPaginatedProducts(products, perPage){
    var result = [];
    for(var i=0, l= products.length ;i<l;i+= perPage){
        var inner = [];
        for(var j = 0; j < perPage; j++){
            if(products[i+j])
                inner.push(products[i+j]);
        }
        result.push(inner);
    } 
    return result;
}

// Return the number of reviewed products by the current user
function getNumberOfReviewedProducts(products){
    var count = 0;
    for(var i=0,l=products.length;i<l;i++){
        if(products[i].reviewed === true) count++;
    }
    return count;
}

// Get the page number for a given product
// Will be used to only update the current page
// When a user submits a review
function getPageNumber(product){
    for(var i=0,l=_products.length;i<l;i++){
        if(product.id===_products[i].id){
            var page = Math.floor(i/_perPage);
            return page;
        }
    }
}

var ProductStore = assign({}, EventEmitter.prototype, {

    //called by root component at startup
    init: function(products, tags){
        _productsOriginal = products;

        // We add a field to every tags
        _tags = tags.map(function(t){
            return {name: t, isChecked: false}; 
        });

        _numberOfReviews = getNumberOfReviewedProducts(_productsOriginal);

        // We do a shallow copy to _products, which is the rendered array
        _products = _productsOriginal.slice();
        
    },
    getReviewedPage: function(){
        return _reviewedPage;
    },
    setReviewedPage: function(val){
        _reviewedPage = val;  
    },
    getProductFromId: function(id){
        for(var i=0, l=_productsOriginal.length;i<l;i++){
            if(_productsOriginal[i].id === id){
                return _productsOriginal[i];
            }
        }
    },
    // Used by the ProductsContainer component to set its state
    getProducts: function(){
        return {
            products: getPaginatedProducts(_products, _perPage),
            dontSlick: _dontSlick
        };
    },
    // Used by the SideBar component to set its state
    getTags: function(){
        return {
            tags: _tags
        };
    },
    // We execute a search query
    doSearch: function(query, tags, sortBy) {

        // what will be returned
        var queryResult = [];
        var regex = new RegExp(query, "i");
        var subset;

        // we set the tags to change isChecked values
        assign(_tags, tags);

        // an array of tag names that are checked
        tags = _tags.filter(function(t){
            return t.isChecked;
        }).map(function(t){
            return t.name;
        });

        // for all products, do check if regex match and intersection for tags
        _productsOriginal.forEach(function(product){
            subset = tags.length ===  _.intersection(tags, product.tags).length;
            if(regex.test(product.name) && subset){
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
                if(a.caracteristic_1 < b.caracteristic_1) return -1;
                if(a.caracteristic_1 > b.caracteristic_1) return 1;
                return 0;
            });
            break;

        default:
            break;
        }
        // the products that will be returned
        _products = queryResult;
    },
    shuffleProducts: function(){
        _products = _.shuffle(_products);       
    },
    setDontSlick: function(val){
        _dontSlick  = val; 
    },
    submit_review: function(product, reviewData){
        // because we will only update one page
        _dontSlick = true;
        _reviewedPage = getPageNumber(product);
        product.reviewed = true;
        ReviewBoxStore.resetReviewData();
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(action){
    switch(action.actionType) {
    case ProductConstants.SHUFFLE_PRODUCTS:
        ProductStore.shuffleProducts();
        ProductStore.emitChange();
        break;
    case ProductConstants.SEARCH_PRODUCTS:
        ProductStore.doSearch(action.data.query, action.data.tags,action.data.sortBy);
        ProductStore.emitChange();
        break;
    case ProductConstants.SUBMIT_REVIEW:
        ProductStore.submit_review(action.product, action.reviewData);
        ProductStore.emitChange();
        break;
    default:
        break;
    }
});
module.exports = ProductStore;
