var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductActions = require('../actions/ProductActions');
var ProductConstants = require('../constants/ProductConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _reviewBox = {
  product: {
    id: null,
    name: '',
    image_path: '',
    caracteristic_1: '',
    caracteristic_2: '',
    tags: [],
    description: '',
    cropDescription: '',
    doCropDescription: false
  },
  // is it opened
  open: false
},
    // The max length of the description
    _cropLength = 150,

    // The jQuery element containing the elements that will fade
    // The element we will prepend the overlay to
    $reviewApp,

    // The clickable overlay
    // Already present
    $overlay,

    // the toggles
    _reviewElementsOriginal,
    _reviewElements,

    // comment, ratings and checked elements
    _reviewData;


function setAllReviewElementsFalse(){
  for(var i=0, l=_reviewElements.length; i<l;i++){
    for(var j=0,m=_reviewElements[i].categories.length;j<m;j++){
      for(var k=0, n=_reviewElements[i].categories[j].elements.length;k<n;k++){
        _reviewElements[i].categories[j].elements[k].isChecked = false;
      }
    }
  }
  
}

var ReviewBoxStore = assign({}, EventEmitter.prototype, {

  // Called from root component
  init(reviewElements) {

    // Put the reference in private var
    _reviewElements = reviewElements;

    // We set all elements' isChecked to false
    setAllReviewElementsFalse();

    _reviewData = {
      comment: "",
      tabs: _reviewElements,
      rating: 0
    };
  },

  setInitialData(reviewElements) {
    // Put the reference in private var
    _reviewElements = reviewElements;

    // We set all elements' isChecked to false
    setAllReviewElementsFalse();

    _reviewData = {
      comment: "",
      tabs: _reviewElements,
      rating: 0
    };
  },
    
  getReviewData: function(){
    return _reviewData;
  },
  // When the user wants to review a movie
  openReviewBox: function(product){

    // We set the data
    _reviewBox.product = product;

    // if it's already reviewed 
    if(product.review){

      // we want to set the data of the review widget
      // so that its the same as the last time it was
      // reviewed
      var r = product.review;

      //we build updated review data
      _reviewData.comment = r.comment;
      _reviewData.rating = r.rating;

      // we need isChecked to correspond to bool value
      for(var i=0, l=_reviewElements.length; i<l;i++){
        for(var j=0,m=_reviewElements[i].categories.length;j<m;j++){
          for(var k=0, n=_reviewElements[i].categories[j].elements.length;k<n;k++){
            for(var z = 0; z < r.boolAnswers.length; z++) {
              if(_reviewElements[i]
                 .categories[j]
                 .elements[k].id ===
                 r.boolAnswers[z].id){
                _reviewElements[i]
                  .categories[j]
                  .elements[k]
                  .isChecked = r.boolAnswers[z].val;
              }
            }
          }
        }
      }
    }

    // We set open to true
    _reviewBox.open = true;

    // Do we crop?
    if(_reviewBox.product.description.length > _cropLength){
      _reviewBox.product.doCropDescription= true;
      _reviewBox.product.cropDescription =
        _reviewBox.product.description.substring(0, _cropLength) +
        "...";
    } else {
      _reviewBox.product.doCropDescription = false;
    }
  },

  closeReviewBox: function(){
    _reviewBox.open = false;
    this.resetReviewData();
  },

  resetReviewData: function(){
    _reviewData.rating = 0;
    _reviewData.comment = "";
    setAllReviewElementsFalse();
  },

  getReviewState: function(){
    return _reviewBox;
  },

  setRating: function(rating){
    _reviewData.rating = rating;
  },

  toggleRecommendIt: function(comment){
    _reviewData.recommendIt = !_reviewData.recommendIt;
  },

  commentChanged: function(comment){
    _reviewData.comment = comment;   
  },
  
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action){
  switch(action.actionType) {
    case ProductConstants.OPEN_REVIEW_BOX:
      ReviewBoxStore.openReviewBox(action.data);
      ReviewBoxStore.emitChange();
      break;
    case ProductConstants.CLOSE_REVIEW_BOX:
      ReviewBoxStore.closeReviewBox();
      ReviewBoxStore.emitChange();
      break;
    case ProductConstants.AGGREGATE_DATA:
      ReviewBoxStore.aggregateReviewData(action.data);
      break;
    case ProductConstants.TOGGLE_RECOMMEND:
      ReviewBoxStore.toggleRecommendIt();
      break;
    case ProductConstants.COMMENT_CHANGED:
      ReviewBoxStore.commentChanged(action.data);
      break;
    case ProductConstants.SET_RATING:
      ReviewBoxStore.setRating(action.rating);
      break;
    case ProductConstants.SET_INITIAL_DATA:
      ReviewBoxStore.setInitialData(action.data.reviewElements);
      break;
      
    default:
      break;
  }
});
module.exports = ReviewBoxStore;
