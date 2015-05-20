var Reflux = require("reflux");
var WidgetActions = require("../actions/WidgetActions");

var _showWidget = false,
    _productData = undefined;

var WidgetStore = Reflux.createStore({

    listenables: [WidgetActions],

    init: function(){
        
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
            productData: _productData
        };
    },

    onDoShowWidget: function(productData){
        // we set the product data
        _productData = productData;
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
        $overlay.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){
                $(this).removeClass();
                $(this).hide();
            });

        // When the bounce out animation is done
        $productWidget.one(
            'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function(){

                _showWidget = false;

                // We remove the class
                $productWidget.removeClass("bounceOutUp");

                // Now we can trigger to notify the wishlist app that the widget
                // isnt showing anymore
                this.trigger(this.getShowWidgetState());

            }.bind(this)
        ).bind(this);
    }
});

module.exports = WidgetStore;
