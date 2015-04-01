var React = require('react');
var Product = require("./Product.react.jsx")
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');
var ReviewBox = require("./ReviewBox.react.jsx");

//Return the products
function getProductsState(){
    return ProductStore.getProducts();
}

/**
 * PRODUCTS CONTAINER COMPONENT
 * The right-most container of the review app containing the products
 */
var ProductsContainer = React.createClass({

    getInitialState: function(){
        return getProductsState();
    },

    componentDidMount: function(){
        // We listen to the product store
        ProductStore.addChangeListener(this._onChange);

        // We bind a listener for the infinite scroll
        $(window).scroll(function() {
            // we add 100 for a little buffer!
            if($(window).scrollTop() + $(window).height() + 100 >= $(document).height()) {
                ProductActions.infiniteScroll();
            }
        });
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
