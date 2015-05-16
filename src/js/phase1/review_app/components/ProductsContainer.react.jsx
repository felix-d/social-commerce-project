var React = require('react');
var Product = require("./Product.react.jsx")
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');
var ReviewBox = require("./ReviewBox.react.jsx");

//Return the products
function getProductsState(){
    return ProductStore.getProducts();
}

var infiniteScrollCheck = function(){
    var $reviewApp = $("#reviewapp");
    var reviewAppOffset = $reviewApp.offset();

    // the bottom position of the products container
    var bottom = reviewAppOffset.top + $reviewApp.height();

    // if we can see all the products in the window, we can add some more!
    if (bottom <= $(window).scrollTop() + $(window).height()) {
        ProductActions.infiniteScroll();
    }
};
/**
 * PRODUCTS CONTAINER COMPONENT
 * The right-most container of the review app containing the products
 */
var ProductsContainer = React.createClass({

    getInitialState: function(){
        return getProductsState();
    },

    componentDidUpdate: function(){
        infiniteScrollCheck();
    },

    componentDidMount: function(){
        // We listen to the product store
        ProductStore.addChangeListener(this._onChange);

        infiniteScrollCheck();
        $(window).on("resize scroll", infiniteScrollCheck);
    },

    componentWillUpdate: function(){
    },

    componentWillUnmount: function(){
        ProductStore.removeChangeListener(this._onChange);
    },

    _onChange: function(){
        this.setState(getProductsState());
    },

    render: function(){

        var products = this.state.products.map(function(m, i){
            return(
                <Product data={m} key={i}/>
            );
        })

        return(
            <div className="product-pages col-xs-9">
                <div id="products" className="will-fade">
                    {products}
                </div>
            </div>
        );
    }
});

module.exports = ProductsContainer;
