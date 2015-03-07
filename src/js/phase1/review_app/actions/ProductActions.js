var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProductConstants = require('../constants/ProductConstants');

var ProductActions = {

    // Shuffle the products!
    shuffleProducts: function(){
        AppDispatcher.dispatch({
            actionType: ProductConstants.SHUFFLE_PRODUCTS
        });
    },

    // Review a product!
    reviewIt: function(product){
        AppDispatcher.dispatch({
            actionType: ProductConstants.OPEN_REVIEW_BOX,
            data: product
        });
    },

    // The name says it all...
    closeReviewBox: function(){
        AppDispatcher.dispatch({
            actionType: ProductConstants.CLOSE_REVIEW_BOX
        });
    },

    // Submit a review with Ajax and optimistic rendering
    submitReview: function(product, reviewData){
        AppDispatcher.dispatch({
            actionType: ProductConstants.SUBMIT_REVIEW,
            product: product,
            reviewData: reviewData
        });
        
    },

    // Search for products
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
