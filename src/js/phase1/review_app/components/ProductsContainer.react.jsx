var React = require('react');
var Product = require("./Product.react.jsx");
var { Col } = require('reat-bootstrap');
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');
var ReviewBox = require("./ReviewBox.react.jsx");

//Return the products
function getProductsState(){
  let products = ProductStore.getProducts();
  return products;
}

var infiniteScrollCheck = function(){
  var $reviewApp = $("#reviewapp");
  var reviewAppOffset = $reviewApp.offset();

  // the bottom position of the products container
  var bottom = reviewAppOffset.top + $reviewApp.height();

  // if we can see all the products in the window, we can add some more!
  // the integer is a buffer to fix firefox and safari
  if (bottom <= $(window).scrollTop() + $(window).height() + 150) {
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

  componentWillUnmount: function(){
    ProductStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(getProductsState());
  },

  render: function(){

    if(!this.state.products) { return null; }

    var products = this.state.products.map(function(m, i){
      return(
        <Product data={m} key={i}/>
      );
    })

      return(
        <Col xs={9} className="product-pages">
           <div id="products" className="will-fade">
              {products}
           </div>
        </Col>
      );
  }
});

module.exports = ProductsContainer;
