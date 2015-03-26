var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductActions = require('../actions/ProductActions');
var ProductConstants = require('../constants/ProductConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var _reviewBox = {
    product: {
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
    $willFade,
    // The element we will prepend the overlay to
    $reviewApp,
    // The clickable overlay
    $overlay;


var ReviewBoxStore = assign({}, EventEmitter.prototype, {

    // Called from root component
    init: function(){

        // We set up the overlay for closing the review box
        // and the elements that need to fade on review box
        // opening
        $(function(){
            $willFade = $('.will-fade');
            $reviewApp = $('#review-app-inner');
            $overlay = $('<div id="overlay"></div>');
            $overlay.click(function(){
                ProductActions.closeReviewBox(); 
            });
            $overlay.hide();
            $reviewApp.prepend($overlay);
        });

    },

    // When the user wants to review a movie
    openReviewBox: function(data){

        // The clickable overlay is shown
        $overlay.show();

        // We fade the elements with class will-fade
        $willFade.addClass('fade');

        // We set the data
        _reviewBox.product = data;

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
        $willFade.removeClass('fade');
        $overlay.hide();
        _reviewBox.open = false;
    },
    getReviewState: function(){
        return _reviewBox;
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
    default:
        break;
    }
});
module.exports = ReviewBoxStore;
