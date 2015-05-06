var React = require("react");
var Reflux = require("reflux");
var Product = require("./Product.react.jsx");
var ProductsStore = require("../stores/ProductsStore");
var ProductsActions = require("../actions/ProductsActions");

var ProductsContainer = React.createClass({
    // We want to listen to the product store and update the products state
    mixins: [Reflux.connect(ProductsStore)],

    getInitialState: function(){
        return ProductsStore.getProductsState();
    },

    componentDidMount: function(){

        // We bind a listener for the infinite scroll
        $(window).scroll(function() {
            // we add 100 for a little buffer!
            if($(window).scrollTop() + $(window).height() + 100 >= $(document).height()) {
                ProductsActions.doIncrementCurrentIndex();
            }
        });
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
