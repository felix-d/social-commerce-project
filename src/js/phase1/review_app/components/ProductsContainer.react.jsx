var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
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
        $(window).scroll(function() {
            // we add 100 for a little buffer!
            if($(window).scrollTop() + $(window).height() >= ($(document).height() - 100)) {
                ProductActions.infiniteScroll();
            }
        });
    },
    componentWillUnmount: function(){
        ProductStore.removeChangeListener(this._onChange);
    },
    _onChange: function(){
        this.setState(getProductsState());
    },
    render: function(){
        var productss = [];

        for(var i=0; i<this.state.currentIndex;i++){
            if(i >= this.state.products.length) break;
            productss.push(<Product data={this.state.products[i]} key={i}/>);
        }
        var products = this.state.products.map(function(m, i){
            return(
                <Product data={m} key={i}/>
            );
        }.bind(this));

        return(
            <div className="product-pages col-xs-9">
                <div id="products" className="will-fade">
                    {productss}
                </div>
            </div>
        );
    }
});

module.exports = ProductsContainer;
