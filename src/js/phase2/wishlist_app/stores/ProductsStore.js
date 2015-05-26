var Reflux = require("reflux");
var ProductActions = require("../actions/ProductsActions");
var SideBarStore = require("./SideBarStore");
var _ = require("lodash");

// Protected variables
// the products
var _products,
    _productsOriginal,
    // the current index for infinite scroll
    CURRENTINDEX = 10,
    INCREMENTINDEX = 10,
    _currentIndex,
    ALL = 0,
    FRIENDS = 1,
    FOF = 2,
    _currentPage;

function resetCurrentIndex(){
    _currentIndex = CURRENTINDEX;
}

function setNumReviewers(products){
        // We set the number of reviewers given the current page
        // as a product property

        products.map(function(e){
            switch(_currentPage){
                // ALL REVIEWERS
            case 0:
                var allr = e.all_reviewers;
                e.numReviewers = allr ? allr.length : 0;
                break;

                // FRIENDS
            case 1:
                var fr = e.f_reviewers;
                e.numReviewers = fr ? fr.length : 0;
                break;

                // FRIENDS OF FRIENDS
            case 2:
                var fofr = e.fof_reviewers;
                e.numReviewers = fofr ? fofr.length : 0;
                break;
            default:
                break;
            }
        });
    return products;
}


var ProductsStore = Reflux.createStore({

    listenables: [ProductActions],

    // called for initialization
    init: function(){
        // initialization
        _currentPage = ALL;
        resetCurrentIndex();
    },

    // setup called by us
    setup: function(products){
        _products = products;
        _productsOriginal = _products.slice();
    },

    getCurrentPage: function(){
        return _currentPage;
    },

    // get the products
    getProductsState: function(){
        var products = setNumReviewers(_products.slice(0, _currentIndex));

        return {
            products: _products.slice(0, _currentIndex),
            currentPage: _currentPage
        };
    },

    // search products with text search, tags and sort
    search: function(textSearch, sortBy, tags){
        // what we are returning
        var queryResult = [];

        // the text we are searching
        var regex = new RegExp(textSearch, "i");

        // are the tags a subset?
        var isSubset;

        // an array of tag names that are checked
        var filteredTags = tags.filter(function(t){
            return t.isChecked;
        }).map(function(t){
            return t.name;
        });

        // for all products, do check if regex match
        // and intersection for tags
        _productsOriginal.forEach(function(product){
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
        resetCurrentIndex();

        this.trigger(this.getProductsState());
    },

    // shuffle products
    shuffle: function(){
        resetCurrentIndex();
        _products = _.shuffle(_products);
        this.trigger(this.getProductsState());
    },

    // Increment the current index of visible products
    onDoIncrementCurrentIndex: function(){
        _currentIndex += INCREMENTINDEX;
        if(_currentIndex > _products.length){
            _currentIndex = _products.length;
        }
        this.trigger(this.getProductsState());
    },

    // When the user changes the current page
    onDoChangePage: function(tab){

        // We set active and no-active classes
        $(".tab").each(function(i){
            if(i===tab) $(this).addClass("active").removeClass("no-active");
            else $(this).removeClass("active").addClass("no-active");
        });

        // We create the products subset
        switch(tab){

        // All the products
        case ALL:
            _currentPage = ALL;
            _products = _productsOriginal;
            break;

        // Products reviewed by friends
        case FRIENDS:
            _currentPage = FRIENDS;
            _products = _productsOriginal.filter(function(e, i){
                if(e.f_reviewers && e.f_reviewers.length > 0){
                    return true;
                } else {
                    return false;
                }
            });
            break;

        // Products reviewed by friends of friends
        case FOF:
            _currentPage = FOF;
            _products = _productsOriginal.filter(function(e, i){
                if(e.fof_reviewers && e.fof_reviewers.length > 0){
                    return true;
                } else {
                    return false;
                }
            });
            break;

        default:
            break;
        }

        this.trigger(this.getProductsState());
    }
});

module.exports = ProductsStore;
