var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProductConstants = require('../constants/ProductConstants');

var ProductActions = {
    getInitialData: function(){
        AppDispatcher.dispatch({
            actionType: productConstants.GET_PRODUCTS
        });
        
    },
    /**
     * @param  {object} data
     */
    create: function(data) {
        AppDispatcher.dispatch({
            actionType: ProductConstants.REVIEW_CREATE,
            data: data
        });
    },
    /**
     * @param  {object} sort_data
     */
    sort: function(sort_data) {
        AppDispatcher.dispatch({
            actionType: ProductConstants.PRODUCTS_SORT,
            data: sort_data
        });
    },

    shuffleProducts: function(){
        AppDispatcher.dispatch({
            actionType: ProductConstants.SHUFFLE_PRODUCTS
        });
    },
    reviewIt: function(product){
        AppDispatcher.dispatch({
            actionType: ProductConstants.OPEN_REVIEW_BOX,
            data: product
        });
    },
    closeReviewBox: function(){
        AppDispatcher.dispatch({
            actionType: ProductConstants.CLOSE_REVIEW_BOX
        });
    },
    submitReview: function(product, reviewData){
        AppDispatcher.dispatch({
            actionType: ProductConstants.SUBMIT_REVIEW,
            product: product,
            reviewData: reviewData
        });
        
    },
    doSearch: function(query, tags, sortBy){
        AppDispatcher.dispatch({
            actionType: ProductConstants.SEARCH_PRODUCTS,
            data: {
                query: query,
                tags: tags,
                sortBy: sortBy
            }
        });
    }
};

module.exports = ProductActions;
