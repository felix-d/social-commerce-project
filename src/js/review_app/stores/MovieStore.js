var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/MovieConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _movies = {};

/**
* Create a review
* @param {object} data 
*/
function create(data){
    // AJAX CALL TO CREATE A NEW REVIEW
}

/**
* Update a movie
* @param {number} id
* @param {object} updates
*/
function updateMovie(id, updates){
    _movies[id] = assign({}, _movies[id], updates);
}

/**
* Update all movies
* @param {object} updates
*/
function updateAllMovies(updates){
    for(var id in _movies){
        update(id, updates);
    }
}

var MovieStore = assign({}, EventEmitter.prototype, {
    getAllMovies: function() {
        return _movies;
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
        
    case MovieConstants.GET_MOVIES :
        if (!location.origin)
            location.origin = location.protocol + "//" + location.host;
        jQuery.get(location.origin+'/api/movies', function(data){
            console.log(data);
            _movies = data;
        }, 'json');

        break;
        

    default:
        break;
    }
});
module.exports = MovieStore;
