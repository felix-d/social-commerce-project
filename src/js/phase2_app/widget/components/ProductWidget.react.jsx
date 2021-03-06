import React from 'react';
import Reflux from 'reflux';
import { Col, Row, Modal } from 'react-bootstrap';

import WidgetStore from '../stores/WidgetStore';
import WidgetActions from '../actions/WidgetActions';
import WishlistActions from '../../me/actions/WishlistActions';

import Review from './Review.react.jsx';
import ReviewersCarousel from './ReviewersCarousel.react.jsx';
import ProductDescription from '../../components/ProductDescription.react.jsx';
import track from '../../tracking';


export default React.createClass({

  mixins: [Reflux.connect(WidgetStore)],

  getInitialState() {
    return WidgetStore.getWidgetState();
  },

  componentDidUpdate(lastProps, lastState) {
    if (this.state.showWidget && !lastState.showWidget) {
      track('ITEM_VISITED', {itemId: this.state.productData.id});
    } else if (!this.state.showWidget && lastState.showWidget) {
      track('ITEM_CLOSED', {itemId: this.state.productData.id});
    }
  },

  _addToWishlist() {
    track('ITEM_ADDED_TO_WISHLIST', {itemId: this.state.productData.id});
    WishlistActions.add(this.state.productData);
    WidgetActions.doHideWidget();
  },

  _removeFromWishlist() {
    track('ITEM_REMOVED_FROM_WISHLIST', {itemId: this.state.productData.id});
    WishlistActions.remove(this.state.productData);
    WidgetActions.doHideWidget();
  },

  _hideWidget() {
    WidgetActions.doHideWidget();
  },

  render() {

    if (!this.state.productData) {
      return null;
    }

    let button = null;

    if (this.state.productData.iswish === true) {
      button = (<button className="btn btn-danger btn-margin" onClick={this._removeFromWishlist}>Remove from wishlist</button>);
    } else {
      button = (<button className="btn btn-add btn-margin" onClick={this._addToWishlist}>Add to wishlist</button>);
    }


    return (
      <Modal show={this.state.showWidget} onHide={this._hideWidget} bsSize="large" id="product-widget">
        <Modal.Header closeButton/>
        <Modal.Body>

          {/* Product name */}
          <Row>
            <Col xs={12} className="text-center">
              <h2 className="product-name">{this.state.productData.name}</h2>
            </Col>
          </Row>

          {/* Main content */}
          <Row>

            {/* Image */}
            <Col xs={3}>
              <img src={this.state.productData.image_path}
                   alt={this.state.productData.name}
                   className="product-image"/>
            </Col>

            {/* Product info */}
            <Col xs={3}>
              <ProductDescription data={this.state.productData}/>
            </Col>

            {/* Reviewers */}
            <Col xs={6} className="review-container">
              <div className="reviewers">
                <h4>Reviewers</h4>
                <ReviewersCarousel currentPage={this.state.currentPage}
                                   productData={this.state.productData}/>
              </div>

              {/* The Review */}
              <Review/>
            </Col>
          </Row>

          {/* Add to wishlist button */}
          <Row>
            <Col xs={12} className="text-center">
              {button}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  },
});
