var React = require('react/addons');
var ProductStore = require('../stores/ProductStore');
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var ProductActions = require('../actions/ProductActions');
var SideBar = require("./SideBar.react.jsx");
var ReviewBox = require("./ReviewBox.react.jsx");
var ProductsContainer = require("./ProductsContainer.react.jsx");
var assign = require('object-assign');

var ReviewApp = React.createClass({
    getInitialState: function(){
        ProductStore.init(this.props.products, this.props.tags);
        ReviewBoxStore.init();
        ProductStore.shuffleProducts();
        return null;
    },
    render: function(){
        return(
            <div className="review-app clearfix" id="review-app-inner">
                <ReviewBox reviewElements={this.props.reviewElements}/>
                <SideBar/>
                <ProductsContainer reviewElements={this.props.reviewElements}/>
            </div>
        );
    }
});

module.exports = ReviewApp;
