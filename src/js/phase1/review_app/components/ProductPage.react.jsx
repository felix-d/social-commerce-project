var React = require('react/addons');
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');
var Product = require('./Product.react.jsx');

var ProductPage = React.createClass({
    componentDidMount: function(){
    },
    componentWillUnmount: function(){
    },
    componentDidUpdate: function(){
    },
    componentWillUpdate: function(){
    },
    render: function(){
        var products = this.props.products.map(function(m, i){
            return(
                <Product data={m} key={i}/>
            );
        }.bind(this));
        return(
            <div className="product-page">
                {products}
            </div>
        );
    }
});

module.exports = ProductPage;
