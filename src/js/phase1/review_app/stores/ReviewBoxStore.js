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
    _reviewElementsOriginal,
    _reviewElements,
    _recommendIt = false,
    _reviewData,
    _comment = '';


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
    init: function(reviewElements){

        // Put the reference in private var
        _reviewElements = reviewElements;

        // We set all elements' isChecked to false
        setAllReviewElementsFalse();


        // Deep copy
        // _reviewElementsOriginal = $.extend(true, [], reviewElements);

        _reviewData = {
            comment: _comment,
            tabs: _reviewElements,
            recommendIt: _recommendIt
        };


        // We set up the overlay for closing the review box
        // and the elements that need to fade on review box
        // opening
        $(function(){
            $reviewApp = $('#review-app-inner');
            $overlay = $('#overlay');
        });

    },
    getReviewData: function(){
        console.log(_reviewData);
        return _reviewData;
    },
    // When the user wants to review a movie
    openReviewBox: function(product){
        console.log("opened");

        // The clickable overlay is shown
        $overlay.show();
        $overlay.addClass("animated fadeIn");

        // We fade the elements with class will-fade
        // $willFade.addClass('fade');

        // We set the data
        _reviewBox.product = product;

        // if it's already reviewed 
        if(product.review){
            var reviewData = product.review;

            //we build update review data
            _reviewData.comment = reviewData.comment;
            _reviewData.recommendIt = reviewData.recommendIt;

            // we need isChecked to correspond to bool value
            for(var i=0, l=_reviewElements.length; i<l;i++){
                for(var j=0,m=_reviewElements[i].categories.length;j<m;j++){
                    for(var k=0, n=_reviewElements[i].categories[j].elements.length;k<n;k++){
                        for(var z = 0; z < reviewData.boolAnswers.length; z++) {
                            if(_reviewElements[i].categories[j].elements[k].id ===
                               reviewData.boolAnswers[z].id){
                                _reviewElements[i].categories[j].elements[k].isChecked = reviewData.boolAnswers[z].val;
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
            _reviewBox.product.cropDescription =_reviewBox.product.description.substring(0, _cropLength) + "...";
        } else {
            _reviewBox.product.doCropDescription = false;
        }
    },

    closeReviewBox: function(){
        $overlay.addClass("animated fadeOut");
        $overlay.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).hide();
                $(this).removeClass();
            });
        _reviewBox.open = false;
        this.resetReviewData();
    },
    resetReviewData: function(){
        _reviewData.recommendIt = false;
        _reviewData.comment = "";
        setAllReviewElementsFalse();
        // deep copy
        // _reviewData.tabs = $.extend(true, [], _reviewElementsOriginal);
    },
    getReviewState: function(){
        return _reviewBox;
    },
    toggleRecommendIt: function(comment){
        _reviewData.recommendIt = !_reviewData.recommendIt;
    },
    commentChanged: function(comment){
        _reviewData.comment = comment;   
    },
    emitChange: function() {
        console.log("change emitted");
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
    default:
        break;
    }
});
module.exports = ReviewBoxStore;
