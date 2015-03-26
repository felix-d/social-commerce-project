var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MovieConstants = require('../constants/MovieConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

// movies_data is passed from global object
var _perPage = 8;
var _sortBy = 'Random';
var _moviesOriginal = window.movies_data;
var _tags = window.tags_data.map(function(t){
    return {name: t, isChecked: false}; 
});

//The movies we will return, we start by copying the original movies
var _movies = _moviesOriginal.slice();

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

function createReview(data){
    // AJAX CALL TO CREATE A NEW REVIEW
}

function updateMovie(id, updates){
    
    _movies[id] = assign({}, _movies[id], updates);
}

function updateAllMovies(updates){
    for(var id in _movies){
        update(id, updates);
    }
}

var MovieStore = assign({}, EventEmitter.prototype, {
    getAllMoviesAndTags: function() {
        return {
            movies: getPaginatedMovies(_movies, _perPage),
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
    default:
        break;
    }
});
module.exports = MovieStore;
