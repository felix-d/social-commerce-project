var Reflux = require("reflux");
var WidgetActions = require("../actions/WidgetActions");

var _showWidget = false,
    _productData = undefined,
    // the maximum length for the description
    _cropLength = 150,
    // the review elements that make up the review tree
    _reviewElements;

var WidgetStore = Reflux.createStore({

    listenables: [WidgetActions],

    init: function(){
        
    },

    setup: function(reviewElements){
        _reviewElements = reviewElements;
    },

    // for the wishlist app
    getShowWidgetState: function(){
        return {
            showWidget: _showWidget
        };
    },

    // for the widget component
    getWidgetState: function(){
        return {
            productData: _productData,
            reviewElements: _reviewElements
        };
    },

    onDoShowWidget: function(productData){
        // we set the product data
        _productData = productData;

        // Do we crop?
        if(_productData.description.length > _cropLength){
            _productData.doCropDescription= true;
            _productData.cropDescription =
                _productData.description.substring(0, _cropLength) +
                "...";
        } else {
            _productData.doCropDescription = false;
        }

        // we show the widget
        _showWidget = true;

        // we show the overlay
        var $overlay = $("#overlay");
        $overlay.show();
        $overlay.addClass("animated fadeIn");

        // we notify the wishlist app
        this.trigger(this.getShowWidgetState());
        
    },

    onDoHideWidget: function(){

        // The product widget
        var $productWidget = $("#product-widget");
        // the overlay
        var $overlay = $("#overlay");

        // The product widget bounces out
        $productWidget.addClass("bounceOutUp");
        // The overlay fades out
        $overlay.addClass("fadeOut");

        // When the overlay fade out animation is done
        //  we could have used one but there is a bug where the event
        // triggered when the widget appears is not the same
        // this caused the callback to be triggered twice
        // its better to just enforce unbinding
        $overlay.on(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).hide();
                $(this).removeClass();
                $(this).unbind();
            });

        // When the bounce out animation is done
        $productWidget.on(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){

                _showWidget = false;

                // We remove the class
                $productWidget.removeClass("bounceOutUp");
                $productWidget.unbind();

                // Now we can trigger to notify the wishlist app that the widget
                // isnt showing anymore
                this.trigger(this.getShowWidgetState());

            }.bind(this)
        ).bind(this);
    }
});

module.exports = WidgetStore;
