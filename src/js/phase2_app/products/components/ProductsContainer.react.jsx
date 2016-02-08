import React from 'react';
import Reflux from 'reflux';
import Product from './Product.react.jsx';
import ProductsStore from '../stores/ProductsStore';
import ProductsActions from '../actions/ProductsActions';
import { Alert } from 'react-bootstrap';
import { isEmpty } from 'lodash';

const infiniteScrollCheck = function infiniteScrollCheck() {
  const $wishlistApp = $('#wishlist-app');
  const wishlistAppOffset = $wishlistApp.offset();

  // the bottom position of the products container
  const bottom = wishlistAppOffset.top + $wishlistApp.height();

  // if we can see all the products in the window, we can add some more!
  if (bottom <= $(window).scrollTop() + $(window).height() + 400) {
    ProductsActions.incrementCurrentIndex();
  }
};

export default React.createClass({

  // We want to listen to the product store and update the products state
  mixins: [Reflux.connect(ProductsStore)],

  getInitialState() {
    return ProductsStore.getProductsState();
  },

  componentDidMount() {
    infiniteScrollCheck();

    // when the images are done loading, so we get the correct height
    $(window).on('resize scroll', infiniteScrollCheck);
  },

  componentDidUpdate() {
    infiniteScrollCheck();
  },

  render() {
    if (!this.state || !this.state.products) {
      return null;
    }
    if (isEmpty(this.state.products)) {
      return (
        <Alert bsStyle="danger" className="no-products-warning">
          There are no products for your filtering criterias.
        </Alert>
      );
    }

    const products = this.state.products.map(e => (
        <div className="col-xs-15 product-container" key={e.name}>
          <Product data={e} currentPage={this.state.currentPage} key={e.name}/>
        </div>
    ));

    return (
      <div id="products-container">
        {products}
      </div>
    );
  },
});
