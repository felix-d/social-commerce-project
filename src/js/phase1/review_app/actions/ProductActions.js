const AppDispatcher = require('../dispatcher/AppDispatcher');
const ProductConstants = require('../constants/ProductConstants');
const request =  require('superagent');

var ProductActions = {

  
  // We fetch the initial data
  fetchInitialData() {
    request.get('get-initial-data/')
      .end((err, data) => {
        AppDispatcher.dispatch({
          actionType: ProductConstants.SET_INITIAL_DATA,
          data: JSON.parse(data.text)
        });
      });
  },

  // Shuffle the products!
  shuffleProducts() {
    AppDispatcher.dispatch({
      actionType: ProductConstants.SHUFFLE_PRODUCTS
    });
  },

  // Review a product!
  review(product) {
    // we show the overlay (greyish background)
    AppDispatcher.dispatch({
      actionType: ProductConstants.OPEN_REVIEW_BOX,
      data: product
    });
  },

  // The name says it all...
  closeReviewBox() {
    AppDispatcher.dispatch({
      actionType: ProductConstants.CLOSE_REVIEW_BOX
    });
  },

  // We add some more products to the current view
  infiniteScroll() {
    // AppDispatcher.dispatch({
    AppDispatcher.dispatch({
      actionType: ProductConstants.INFINITE_SCROLL
    });
  },

  // Submit a review with Ajax and optimistic rendering
  submitReview(product, reviewData) {
    
    $.post(
      '/phase1/review/',
      JSON.stringify({productId: product.id, reviewData: reviewData}),
      function(data){
        console.log(data);
      });
    AppDispatcher.dispatch({
      actionType: ProductConstants.SUBMIT_REVIEW,
      product: product,
      reviewData: reviewData
    });
  },

  // set the star rating of the current reviewed product
  setRating(rating) {
    AppDispatcher.dispatch({
      actionType: ProductConstants.SET_RATING,
      rating: rating
    });
    
  },

  // delete a review with ajax and optimistic rendering
  deleteReview(product) {
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

  // The comment changed, we need to update the store!
  commentChanged(comment) {
    AppDispatcher.dispatch({
      actionType: ProductConstants.COMMENT_CHANGED,
      data: comment
    });
  },

  // Search for products
  doSearch(query, sortBy) {
    AppDispatcher.dispatch({
      actionType: ProductConstants.SEARCH_PRODUCTS,
      data: {
        query: query,
        sortBy: sortBy
      }
    });
  }
};

module.exports = ProductActions;
