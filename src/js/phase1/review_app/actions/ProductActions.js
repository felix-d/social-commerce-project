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
    review: function(product){
        var $overlay = $("#overlay");
        $overlay.show();
        $overlay.addClass("animated fadeIn");
        AppDispatcher.dispatch({
            actionType: ProductConstants.OPEN_REVIEW_BOX,
            data: product
        });
    },

    // The name says it all...
    closeReviewBox: function(){
        var $overlay = $("#overlay");
        var $reviewWidget = $("#review-widget");
        $overlay.addClass("fadeOut");
        $overlay.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).hide();
                $(this).removeClass();
            });
        
        $reviewWidget.addClass("bounceOutUp");
        $reviewWidget.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                AppDispatcher.dispatch({
                    actionType: ProductConstants.CLOSE_REVIEW_BOX
                });
            });
    },

    infiniteScroll: function(){
        AppDispatcher.dispatch({
            actionType: ProductConstants.INFINITE_SCROLL
        });
    },

    // Submit a review with Ajax and optimistic rendering
    submitReview: function(product, reviewData){
        $.post(
            '/phase1/review/',
            JSON.stringify({productId: product.id, reviewData: reviewData}),
            function(data){
                console.log("success");
            });
        AppDispatcher.dispatch({
            actionType: ProductConstants.SUBMIT_REVIEW,
            product: product,
            reviewData: reviewData
        });
    },
    deleteReview: function(product){
        $.post(
            '/phase1/review/',
            JSON.stringify({productId: product.id}),
            function(data){
                console.log("success");
            });
        AppDispatcher.dispatch({
            actionType: ProductConstants.DELETE_REVIEW,
            product: product
        });
    },
    toggleRecommendIt: function(){
        AppDispatcher.dispatch({
            actionType: ProductConstants.TOGGLE_RECOMMEND
        });
    },
    commentChanged: function(comment){
        AppDispatcher.dispatch({
            actionType: ProductConstants.COMMENT_CHANGED,
            data: comment
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
