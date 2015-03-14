var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProductConstants = require('../constants/ProductConstants');

// We want to set the Cross Site Request Forgery token on each request
// https://docs.djangoproject.com/en/1.7/ref/contrib/csrf/#ajax
//**************************************************************
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var csrftoken = getCookie('csrftoken');
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
//**************************************************************

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
        $.post(
            '/phase1/review/',
            JSON.stringify({product: product.id, reviewData: reviewData}),
            function(data){
                console.log("success");
            });
        AppDispatcher.dispatch({
            actionType: ProductConstants.SUBMIT_REVIEW,
            product: product,
            reviewData: reviewData
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
