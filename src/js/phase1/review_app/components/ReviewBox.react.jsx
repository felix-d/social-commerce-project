import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';

import ReviewForm from './ReviewForm.react.jsx';
import ReviewBoxStore from '../stores/ReviewBoxStore';
import ProductActions from '../actions/ProductActions';

function getReviewState() {
  return ReviewBoxStore.getReviewState();
}

// Popover options for the product description
const popoverOptions = {
  trigger: 'hover',
  placement: 'left',
  container: '#review-widget',
  delay: {
    show: 400,
    hide: 100,
  },
};

export default React.createClass({

  getInitialState() {
    return getReviewState();
  },

  componentDidMount() {
    ReviewBoxStore.addChangeListener(this._onChange);
  },

  componentWillUpdate() {
    // we remove the popover if the state is open (not yet updated)
    if (this.state.open &&
       this.refs.description &&
       this.state.product.doCropDescription) {
      $(this.refs.description.getDOMNode()).popover('destroy');
    }
  },

  componentDidUpdate() {
    // we add the popover
    if (this.state.open && this.state.product.doCropDescription) {
      $(this.refs.description.getDOMNode()).popover(popoverOptions);
    }
  },

  componentWillUnmount() {
    ReviewBoxStore.removeReviewChangeListener(this._onChange);
  },


  _onChange() {
    this.setState(getReviewState());
  },

  _closeReviewBox() {
    ProductActions.closeReviewBox();
  },

  render() {
    let description = '';

    // Do we crop the description
    if (this.state.product.doCropDescription) {
      description = this.state.product.cropDescription;
    } else {
      description = this.state.product.description;
    }

    return (
      <Modal id="review-widget" show={this.state.open} onHide={this._closeReviewBox} bsSize="large">
        <Modal.Body>
          <Row>
            <Col xs={12} className="text-right">
              <button className="btn btn-default" onClick={this._closeReviewBox}><i className="fa fa-times"></i></button>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className="text-center">
              <h2 className="product-name">{this.state.product.name}</h2>
            </Col>
          </Row>

          <Row className="inner">
            <Col xs={3}>
              <img src={this.state.product.image_path} alt={this.state.product.name} className="product-image"/>
            </Col>

            <Col xs={3}>
              <h4>Release date</h4>
              <p>{this.state.product.caracteristic_1}</p>
              <h4>Tags</h4>
              <p>{this.state.product.tags.join(', ')}</p>
              <h4>Overview</h4>
              <p className="description" id="review-widget__description" ref="description" data-toggle="popover" data-content={this.state.product.description}>{description}</p>
            </Col>

            <Col xs={6}>
              <ReviewForm product={this.state.product}/>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  },
});
