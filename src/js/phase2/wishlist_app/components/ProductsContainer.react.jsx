var React = require("react");
var Product = require("./Product.react.jsx");

var ProductsContainer = React.createClass({

    render: function(){

        var products = ["p1","p2","p3","p4","p5","p6","p7"];

        products = products.map(function(){
            return(
               <div className="col-xs-4 product-container">
                   <Product />
               </div>
            );
        })

        return (
            <div id="products-container">
                {products}
            </div>
        );
    }
})

module.exports = ProductsContainer;
