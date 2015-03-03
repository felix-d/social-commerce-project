var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductConstants = require('../constants/ProductConstants');
var ReviewBoxStore = require("./ReviewBoxStore");
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var REVIEWCHANGE_EVENT = 'change_review';

// products_data is passed from global object
var _perPage,
    _sortBy,
    _productsOriginal,
    _tags,
    _numberOfReviews,
    _products,
    _dontSlick,
    _reviewedPage;

/**
* Takes an array of products and a number and
* returns the paginated array
*/
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

function getNumberOfReviewedProducts(products){
    var count = 0;
    for(var i=0,l=products.length;i<l;i++){
        if(products[i].reviewed === true) count++;
    }
    return count;
}

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
        _sortBy = 'Random';
        _perPage = 10;
        _dontSlick = false;
        _reviewedPage = null;
        _tags = tags.map(function(t){
            return {name: t, isChecked: false}; 
        });
        _numberOfReviews = getNumberOfReviewedProducts(_productsOriginal);
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
    getAllData: function() {
        return {
            products: getPaginatedProducts(_products, _perPage),
            tags: _tags,
            numberReviews: _numberOfReviews
        };
    },
    getProducts: function(){
        return {
            products: getPaginatedProducts(_products, _perPage),
            dontSlick: _dontSlick
        };
    },
    getTags: function(){
        return {
            tags: _tags
        };
    },
    doSearch: function(query, tags, sortBy) {
        var queryResult = [];
        var regex = new RegExp(query, "i");
        var subset;
        //we set the tags to change isChecked values
        assign(_tags, tags);

        //an array of tag names that are checked
        tags = _tags.filter(function(t){
            return t.isChecked;
        }).map(function(t){
            return t.name;
        });

        //for all products, do check
        _productsOriginal.forEach(function(product){
            subset = tags.length ===  _.intersection(tags, product.tags).length;
            if(regex.test(product.name) && subset){
                queryResult.push(product);
            }
        });

        //sort the results
        switch(sortBy){
        case "Random":
            queryResult = _.shuffle(queryResult);       
            break;
        case "Title":
            queryResult.sort(function(a, b){
                // Compare the 2 dates
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
            break;
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

        _products = queryResult;
    },
    shuffleProducts: function(){
        _products = _.shuffle(_products);       
    },
    setDontSlick: function(val){
        _dontSlick  = val; 
    },
    submit_review: function(product, reviewData){
        _dontSlick = true;
        _reviewedPage = getPageNumber(product);
        product.reviewed = true;
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    /**
     * @param {function} callback
     */
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
