import React from 'react';
import { Col, Popover, OverlayTrigger } from 'react-bootstrap';
import classnames from 'classnames';

import ProductActions from '../actions/ProductActions';
import ProductStore from '../stores/ProductStore';

const popoverOptions = {
  trigger: 'hover',
  placement: 'auto',
  container: 'body',
};

export default React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    cropLength: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      cropLength: 13,
    };
  },

  getInitialState() {
    let cropName = false;
    let displayName = null;

    if (this.props.data.name.length > this.props.cropLength) {
      cropName = true;
      displayName = this.props.data.name.substring(0, this.cropLength) + '...';
    } else {
      displayName = this.props.data.name;
    }
    return {
      imgActive: false,
      cropName,
      displayName,
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    // if the product is the same as the one that just got reviewed
    // OR if the product wasn't already there
    // OR the image is now loaded -> we update it
    if (nextProps.data.id === ProductStore.getLastReviewedId() ||
        nextProps.data.id !== this.props.data.id ||
        nextState.imgActive !== this.state.imgActive) {
      ProductStore.resetReviewedId();
      return true;
    }
    // no need to update the element!
    return false;
  },

  _openReviewBox() {
    ProductActions.review(this.props.data);
  },

  _showImage() {
    this.setState({
      imgActive: true,
    });
  },

  _editReview() {
    ProductActions.review(this.props.data);
  },

  render() {

    // the name of the movie
    let name = null;
    let opacityControl = null;
    let checkMark = null;
    let button = null;

    const imgClass = classnames('show-image', {
      active: this.state.imgActive,
    });

    // Do we crop the length?
    if (this.props.data.name.length > this.cropLength) {
      this.cropName = true;
      name = this.props.data.name.substring(0, this.cropLength) + '...';
    } else {
      this.cropName = false;
      name = this.props.data.name;
    }

    // Check if the product was reviewed
    if (this.props.data.review) {
      opacityControl = 'low-opacity';
      checkMark = <i className="fa fa-check-circle"></i>;
      button = <button className="btn btn-success btn-sm" onClick={this._editReview}>Edit</button>;
    } else {
      button = <button className="btn btn-info btn-sm" onClick={this._openReviewBox}>I've seen it!</button>;
    }

    return (
      <Col xs={15} className="product animated fadeIn">
        <div className="product-inner effect6">
          <h5 className={opacityControl}
              ref="name"
              data-toggle="popover"
              data-content={this.props.data.name}>
            {name}
          </h5>
          <div className="checkmark-container">
            {checkMark}
            <div className={opacityControl + ' img-container'}>
              <img
                  ref="img"
                  className={imgClass}
                  src={this.props.data.sm_image_path}
                  onLoad={this._showImage}></img>
            </div>
          </div>
          <p className={opacityControl}>{this.props.data.caracteristic_1}</p>
          {button}
        </div>
      </Col>
    );
  },
});
