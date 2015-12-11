import React from 'react';
import Product from './Product.react.jsx';
import { Col } from 'react-bootstrap';
import ProductStore from '../stores/ProductStore';
import ProductActions from '../actions/ProductActions';


function getProductsState() {
  return {
    ...ProductStore.getProducts(),
  };
}

function infiniteScrollCheck() {
  const $reviewApp = $('#reviewapp');
  const reviewAppOffset = $reviewApp.offset();

  const bottom = reviewAppOffset.top + $reviewApp.height();

  if (bottom <= $(window).scrollTop() + $(window).height() + 400) {
    ProductActions.infiniteScroll();
  }
}

export default React.createClass({

  getInitialState() {
    return getProductsState();
  },

  componentDidMount() {
    // We listen to the product store
    ProductStore.addChangeListener(this._onChange);
    infiniteScrollCheck();
    $(window).on('resize scroll', infiniteScrollCheck);
  },

  componentDidUpdate() {
    infiniteScrollCheck();
  },

  componentWillUnmount() {
    ProductStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(getProductsState());
  },

  render() {

    if (!this.state.products) { return null; }

    debugger;
    const products = this.state.products.map(m => <Product data={m} key={m.name}/>);

    return (
      <Col xs={9} className="product-pages">
        <div id="products" className="will-fade">
          {products}
        </div>
      </Col>
    );
  },
});
