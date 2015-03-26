var AppDispatcher = require('../dispatcher/AppDispatcher');
var MovieConstants = require('../constants/MovieConstants');

var MovieActions = {
    getInitialData: function(){
        AppDispatcher.dispatch({
            actionType: movieConstants.GET_MOVIES
        });
        
    },
    /**
     * @param  {object} data
     */
    create: function(data) {
        AppDispatcher.dispatch({
            actionType: MovieConstants.REVIEW_CREATE,
            data: data
        });
    },
    /**
     * @param  {object} sort_data
     */
    sort: function(sort_data) {
        AppDispatcher.dispatch({
            actionType: MovieConstants.MOVIES_SORT,
            data: sort_data
        });
    },

    shuffleMovies: function(){
        AppDispatcher.dispatch({
            actionType: MovieConstants.SHUFFLE_MOVIES
        });
    },
    reviewIt: function(movie){
        AppDispatcher.dispatch({
            actionType: MovieConstants.OPEN_REVIEW_BOX,
            data: movie
        });
    },
    closeReviewBox: function(){
        AppDispatcher.dispatch({
            actionType: MovieConstants.CLOSE_REVIEW_BOX
        });
    },
    submitReview: function(movie, reviewData){
        AppDispatcher.dispatch({
            actionType: MovieConstants.SUBMIT_REVIEW,
            movie: movie,
            reviewData: reviewData
        });
        
    },
    doSearch: function(query, tags, sortBy){
        AppDispatcher.dispatch({
            actionType: MovieConstants.SEARCH_MOVIES,
            data: {
                query: query,
                tags: tags,
                sortBy: sortBy
            }
        });
    }
};

module.exports = MovieActions;
