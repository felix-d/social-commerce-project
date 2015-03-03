var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProductActions = require('../actions/ProductActions');
var ProductConstants = require('../constants/ProductConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var _reviewBox,
    $willFade,
    $reviewApp,
    $overlay,
    _cropLength,
    _reviewButtons;

var ReviewBoxStore = assign({}, EventEmitter.prototype, {
    init: function(){
        _cropLength = 150;
        _reviewBox = {
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
            open: false,
            showChildBox: false,
            children: []
        };
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
    openReviewBox: function(data){
        $overlay.show();
        $willFade.addClass('fade');
        _reviewBox.product = data;
        _reviewBox.open = true;

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
    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
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
