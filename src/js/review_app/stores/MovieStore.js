var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MovieConstants = require('../constants/MovieConstants');
var ReviewBoxStore = require("./ReviewBoxStore");
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var REVIEWCHANGE_EVENT = 'change_review';

// movies_data is passed from global object
var _perPage,
    _sortBy,
    _moviesOriginal,
    _tags,
    _numberOfReviews,
    _movies,
    _dontSlick,
    _reviewedPage;

/**
* Takes an array of movies and a number and
* returns the paginated array
*/
function getPaginatedMovies(movies, perPage){
    var result = [];
    for(var i=0, l= movies.length ;i<l;i+= perPage){
        var inner = [];
        for(var j = 0; j < perPage; j++){
            if(movies[i+j])
                inner.push(movies[i+j]);
        }
        result.push(inner);
    } 
    return result;
}

function getNumberOfReviewedMovies(movies){
    var count = 0;
    for(var i=0,l=movies.length;i<l;i++){
        if(movies[i].reviewed === true) count++;
    }
    return count;
}

function getPageNumber(movie){
    for(var i=0,l=_movies.length;i<l;i++){
        if(movie.id===_movies[i].id){
            var page = Math.floor(i/_perPage);
            return page;
        }
    }
}

var MovieStore = assign({}, EventEmitter.prototype, {
    //called by root component at startup
    init: function(movies, tags){
        _moviesOriginal = movies;
        _sortBy = 'Random';
        _perPage = 10;
        _dontSlick = false;
        _reviewedPage = null;
        _tags = tags.map(function(t){
            return {name: t, isChecked: false}; 
        });
        _numberOfReviews = getNumberOfReviewedMovies(_moviesOriginal);
        _movies = _moviesOriginal.slice();
        
    },
    getReviewedPage: function(){
        return _reviewedPage;
    },
    setReviewedPage: function(val){
        _reviewedPage = val;  
    },
    getMovieFromId: function(id){
        for(var i=0, l=_moviesOriginal.length;i<l;i++){
            if(_moviesOriginal[i].id === id){
                return _moviesOriginal[i];
            }
        }
    },
    getAllData: function() {
        return {
            movies: getPaginatedMovies(_movies, _perPage),
            tags: _tags,
            numberReviews: _numberOfReviews
        };
    },
    getProducts: function(){
        return {
            products: getPaginatedMovies(_movies, _perPage),
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

        //for all movies, do check
        _moviesOriginal.forEach(function(movie){
            subset = tags.length ===  _.intersection(tags, movie.tags).length;
            if(regex.test(movie.name) && subset){
                queryResult.push(movie);
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

        _movies = queryResult;
    },
    shuffleMovies: function(){
        _movies = _.shuffle(_movies);       
    },
    setDontSlick: function(val){
        _dontSlick  = val; 
    },
    submit_review: function(movie, reviewData){
        _dontSlick = true;
        _reviewedPage = getPageNumber(movie);
        movie.reviewed = true;
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
    case MovieConstants.SHUFFLE_MOVIES:
        MovieStore.shuffleMovies();
        MovieStore.emitChange();
        break;
    case MovieConstants.SEARCH_MOVIES:
        MovieStore.doSearch(action.data.query, action.data.tags,action.data.sortBy);
        MovieStore.emitChange();
        break;
    case MovieConstants.SUBMIT_REVIEW:
        MovieStore.submit_review(action.movie, action.reviewData);
        MovieStore.emitChange();
        break;
    default:
        break;
    }
});
module.exports = MovieStore;
