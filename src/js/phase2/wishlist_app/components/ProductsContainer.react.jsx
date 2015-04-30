var React = require("react");
var Product = require("./Product.react.jsx");
var ProductsStore = require("../stores/ProductsStore");

// Get the products
var getProducts = function(){
    return ProductsStore.getProducts(); 
};

var ProductsContainer = React.createClass({

    getInitialState: function(){
        return getProducts();
    },

    render: function(){
        var products = this.state.products.map(function(e, i){
            return (
               <div className="col-xs-3 product-container">
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
