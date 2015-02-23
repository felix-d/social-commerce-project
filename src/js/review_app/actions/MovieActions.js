var AppDispatcher = require('../dispatcher/AppDispatcher');
var ReviewConstants = require('../constants/MovieConstants');

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
    }
};

module.exports = MovieActions;
