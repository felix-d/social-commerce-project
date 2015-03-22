var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductConstants = require('../constants/ProductConstants');
var ReviewBoxStore = require("./ReviewBoxStore");
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
    $doneOrNot = $("#done-or-not"),
    $numReviews = $('#num-reviews'),
    _currentIndex = 15,
    _lastReviewedId,
    _firstLaunch = true;

function imageLoaded(){
    // console.log("image preloaded");
}
// lets preload the images (the ones not on first screen)
function preload(sources, chunkSize) {
    chunkSize = chunkSize || sources.length;
    var sourcesChunked = _.chunk(sources, chunkSize);
    var steps = sourcesChunked.length;
    var current = 0;
    var inner = function(_current){
        var imagesTemp = [];
        var l = sourcesChunked[_current].length;
        var counter = 0;
        var callback = function(){
            console.log("updated counter");
                counter++;
                if(counter == l - 1){
                    if(_current < steps - 1){
                        inner(++_current);
                    }
                    else {
                        // preloading done
                    }
                }
        };
        for (var i = 0; i < l; i++) {
           
            imagesTemp[i] = new Image();
	    imagesTemp[i].src = sourcesChunked[_current][i].image_path;
            imagesTemp[i].onload = callback;
        }
    };
    inner(current);
}


// Return the number of reviewed products by the current user
function getNumberOfReviewedProducts(products){
    var count = 0;
    for(var i=0,l=products.length;i<l;i++){
        if(products[i].review) count++;
    }
    return count;
}

function resetCurrentIndex(){
    _currentIndex = 15; 
}

var ProductStore = assign({}, EventEmitter.prototype, {

    //called by root component at startup
    init: function(products, tags, num){
        
        _productsOriginal = products;

        // We add a field to every tags
        _tags = tags.map(function(t){
            return {name: t, isChecked: false}; 
        });

        _numberOfReviews = getNumberOfReviewedProducts(_productsOriginal);

        // We do a shallow copy to _products, which is the rendered array
        _products = _productsOriginal.slice();

        // The number of reviews
        _num = num;
    },

    // update the text that informs the user about the reviewing state
    updateReviewText: function(){
        $numReviews.text(_num);
        if(_num < 3){
            $doneOrNot.text("Please review "+
                               (3 - _num) +
                               " more before moving on to the next step.");
        }
        else {
            $doneOrNot.text("You can move on to the next step when you're done!");
            $doneOrNot.append('<div id="icon-wrapper">'+
                              '<a href="/phase1/step2/"><i id="next-icon" class="fa fa-hand-o-right">'+
                              '</i></a></div>');
            var done = true;
            $("#next-icon").mouseover(function(){
                if(done){
                    done = false;
                    $(this).effect('bounce', {direction: "right", times: 3}, 1000, function(){
                        done = true;
                    });
                }
            });
        }
    },
    getLastReviewedId: function(){
        return _lastReviewedId;
    },
    resetReviewedId: function(id){
        _lastReviewedId = undefined;
    },
    // get the product from id
    getProductFromId: function(id){
        for(var i=0, l=_productsOriginal.length;i<l;i++){
            if(_productsOriginal[i].id === id){
                return _productsOriginal[i];
            }
        }
        return null;
    },

    // Used by the ProductsContainer component to set its state
    getProducts: function(){
        //preload images by chunks of 15
        if(_firstLaunch){
            preload(_products, 15);
            _firstLaunch = false;
        }
        return {
            products: _products.slice(0, _currentIndex)
        };
    },

    // Used by the SideBar component to set its state
    getTags: function(){
        return {
            tags: _tags
        };
    },
    // We execute a search query
    doSearch: function(query, sortBy) {
        // what will be returned
        console.log(sortBy);
        var queryResult = [];
        var regex = new RegExp(query, "i");
        var subset,
            tags;

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
        resetCurrentIndex();
    },
    shuffleProducts: function(){
        resetCurrentIndex();
        _products = _.shuffle(_products);       
    },
    incrementCurrentIndex: function(){
        _currentIndex += 10;
        if(_currentIndex > _products.length){
            _currentIndex = _products.length;
        }
    },
    triggerNextIconBounce: function(){
    },
    deleteReviewWithId: function(product){
        for(var i = 0; i < _products.length; i++) {
            if(_products[i].id === product.id){
                _products[i].review = false;
            }
        }
        _num--;
        _lastReviewedId = product.id;

        ReviewBoxStore.resetReviewData();
        this.updateReviewText();
    },
    submit_review: function(product, reviewData){

        if(!product.review)
        // we increment the number of reviews!
            _num++;
        
        // we update review state
        var boolAnswers = [];
        for(var i = 0; i < reviewData.tabs.length; i++) {
            for(var j = 0; j < reviewData.tabs[i].categories.length; j++) {
                for(var k = 0; k < reviewData.tabs[i].categories[j].elements.length; k++) {
                    var elem = reviewData.tabs[i].categories[j].elements[k];
                    boolAnswers.push({
                        id: elem.id,
                        val: elem.isChecked
                    });
                }
            }
        }
        product.review = {
            boolAnswers:boolAnswers,
            comment: reviewData.comment,
            recommendIt: reviewData.recommendIt
        };

        _lastReviewedId = product.id;

        ReviewBoxStore.resetReviewData();
        this.updateReviewText();
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
    default:
        break;
    }
});
module.exports = ProductStore;
