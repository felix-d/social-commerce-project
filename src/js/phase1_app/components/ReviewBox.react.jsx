import React from 'react';
import { Modal, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';

import ReviewForm from './ReviewForm.react.jsx';
import ReviewBoxStore from '../stores/ReviewBoxStore';
import ProductActions from '../actions/ProductActions';

function getReviewState() {
  return ReviewBoxStore.getReviewState();
}

export default React.createClass({

  propTypes: {
    product: React.PropTypes.object,
  },

  getInitialState() {
    return getReviewState();
  },

  componentDidMount() {
    ReviewBoxStore.addChangeListener(this._onChange);
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
    let descriptionComponent = null;

    // Do we crop the description
    if (this.state.product.doCropDescription) {
      const popover = (
        <Popover id={this.state.product.name}>
          {this.state.product.description}
        </Popover>
      );
      descriptionComponent = (
        <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={popover}>
          <p>
            {this.state.product.cropDescription}
          </p>
        </OverlayTrigger>
      );
    } else {
      descriptionComponent = <span>{this.state.product.description}</span>;
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
              <div>{descriptionComponent}</div>
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
