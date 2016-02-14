import React, { ComponenComponent, t, PropTypes } from 'react'; // eslint-disable-line
import Reflux from 'reflux';
import { Modal, Row, Col } from 'react-bootstrap';
import ProductDescription from '../../components/ProductDescription.react.jsx';
import Review from '../../components/Review.react.jsx';
import ReviewStore from '../../widget/stores/ReviewStore';
import WishlistActions from '../../me/actions/WishlistActions';
import track from '../../tracking';


export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    data: PropTypes.object,
    review: PropTypes.bool,
  },

  mixins: [Reflux.connect(ReviewStore)],

  _addToWishlist() {
    track('ITEM_ADDED_TO_WISHLIST', {itemId: this.props.data.id});
    WishlistActions.add(this.props.data);
    this.props.hide();
  },

  _removeFromWishlist() {
    track('ITEM_REMOVED_FROM_WISHLIST', {itemId: this.props.data.id});
    WishlistActions.remove(this.props.data);
    this.props.hide();
  },

  render() {
    let button = null;
    if (!this.props.data) {
      return null;
    }
    if (this.props.data.iswish === true) {
      button = (
        <button className="btn btn-danger btn-margin" onClick={this._removeFromWishlist}>
          Remove from wishlist
        </button>
      );
    } else {
      button = (
        <button className="btn btn-add btn-margin" onClick={this._addToWishlist}>
          Add to wishlist
        </button>
      );
    }
    return (
      <Modal bsSize="large" show={this.props.show} onHide={this.props.hide} id="product-widget">
        <Modal.Header closeButton/>
        <Modal.Body>

          {/* Product name */}
          <Row>
            <Col xs={12} className="text-center">
              <h2 className="product-name">{this.props.data.name}</h2>
            </Col>
          </Row>

          {/* Main content */}
          <Row>

            {/* Image */}
            <Col xs={3}>
              <img src={this.props.data.image_path}
                   alt={this.props.data.name}
                   className="product-image"/>
            </Col>

            {/* Product info */}
            <Col xs={this.props.review ? 3 : 9}>
              <ProductDescription data={this.props.data} cropLength={150}/>
            </Col>

            {this.props.review ? (
               <Col xs={6}>
                 <h4>Review</h4>
                 <Review
                     answers={this.state.answers}
                     comment={this.state.comment}
                     rating={this.state.rating}/>
               </Col>
             ) : null}

          </Row>
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
