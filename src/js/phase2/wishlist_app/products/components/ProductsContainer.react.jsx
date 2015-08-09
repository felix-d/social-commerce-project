var React = require("react"),
    Reflux = require("reflux"),
    Product = require("./Product.react.jsx"),
    ProductsStore = require("../stores/ProductsStore"),
    ProductsActions = require("../actions/ProductsActions");

// infiniteScrollCheck checks if more products
// should appear
var infiniteScrollCheck = function(){
    var $wishlistApp = $("#wishlist-app");
    var wishlistAppOffset = $wishlistApp.offset();

    // the bottom position of the products container
    var bottom = wishlistAppOffset.top + $wishlistApp.height();

    // if we can see all the products in the window, we can add some more!
    if (bottom <= $(window).scrollTop() + $(window).height() + 150) {
        ProductsActions.incrementCurrentIndex();
    }
};

var ProductsContainer = React.createClass({

    // We want to listen to the product store and update the products state
    mixins: [Reflux.connect(ProductsStore)],

    imagesUpdate: true,

    getInitialState(){
        return ProductsStore.getProductsState();
    },
    componentDidUpdate(){
        infiniteScrollCheck();
    },
    componentDidMount(){
        infiniteScrollCheck();

        // when the images are done loading, so we get the correct height
        $(window).on("resize scroll", infiniteScrollCheck);
    },

    render(){
        var products = this.state.products.map(function(e, i){
            return (
               <div className="col-xs-15 product-container" key={i}>
                   <Product data={e} currentPage={this.state.currentPage} key={i}/>
               </div>
            );
        }.bind(this));

        return (
            <div id="products-container">
                {products}
            </div>
        );
    }
})

module.exports = ProductsContainer;
