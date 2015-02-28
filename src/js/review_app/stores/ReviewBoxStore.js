var AppDispatcher = require('../dispatcher/AppDispatcher');
var MovieActions = require('../actions/MovieActions');
var EventEmitter = require('events').EventEmitter;
var MovieConstants = require('../constants/MovieConstants');
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';
var _reviewBox,
    $willFade,
    $reviewApp,
    $overlay;

var ReviewBoxStore = assign({}, EventEmitter.prototype, {
    init: function(){
        _reviewBox = {
            id: undefined,
            open: false
        };
        $(function(){
            $willFade = $('.will-fade');
            $reviewApp = $('#review-app-inner');
            $overlay = $('<div id="overlay"></div>');
            $overlay.click(function(){
                MovieActions.closeReviewBox(); 
            });
            $overlay.hide();
            $reviewApp.prepend($overlay);
        });

    },
    openReviewBox: function(id){
        $overlay.show();
        $willFade.addClass('fade');
        _reviewBox.id = id;
        _reviewBox.open = true;
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
    case MovieConstants.OPEN_REVIEW_BOX:
        ReviewBoxStore.openReviewBox(action.data);
        ReviewBoxStore.emitChange();
        break;
    case MovieConstants.CLOSE_REVIEW_BOX:
        ReviewBoxStore.closeReviewBox();
        ReviewBoxStore.emitChange();
        break;
    default:
        break;
    }
});
module.exports = ReviewBoxStore;
