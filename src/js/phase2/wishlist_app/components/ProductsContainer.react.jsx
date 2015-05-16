var React = require("react");
var Reflux = require("reflux");
var Product = require("./Product.react.jsx");
var ProductsStore = require("../stores/ProductsStore");
var ProductsActions = require("../actions/ProductsActions");

var infiniteScrollCheck = function(){
    var $wishlistApp = $("#wishlist-app");
    var wishlistAppOffset = $wishlistApp.offset();

    // the bottom position of the products container
    var bottom = wishlistAppOffset.top + $wishlistApp.height();

    // if we can see all the products in the window, we can add some more!
    if (bottom <= $(window).scrollTop() + $(window).height()) {
        ProductsActions.doIncrementCurrentIndex();
    }
};

var ProductsContainer = React.createClass({
    // We want to listen to the product store and update the products state
    mixins: [Reflux.connect(ProductsStore)],

    imagesUpdate: true,

    getInitialState: function(){
        return ProductsStore.getProductsState();
    },
    componentDidUpdate: function(){
       infiniteScrollCheck(); 
    },
    componentDidMount: function(){
        infiniteScrollCheck();

        // when the images are done loading, so we get the correct height
        $(window).on("resize scroll", infiniteScrollCheck);
    },

    render: function(){
        var products = this.state.products.map(function(e, i){
            return (
               <div className="col-xs-15 product-container" key={i}>
                   <Product data={e} key={i}/>
               </div>
            );
        });

        return (
            <div id="products-container">
                {products}
            </div>
        );
    }
})

module.exports = ProductsContainer;
