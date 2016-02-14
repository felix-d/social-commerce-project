import React from 'react';
import WishlistActions from '../actions/WishlistActions';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import track from '../../tracking';

const maxLength = 11;

function isNotLatin(name) {
  if (name.charCodeAt(0) > 127) {
    return true;
  } else {
    return false;
  }
}
export default React.createClass({

  propTypes: {
    product: React.PropTypes.object,
  },

  getInitialState() {
    const fullname = this.props.product.name;
    let thisMaxLength = maxLength;
    let cropped = false;
    let name = null;
    if (isNotLatin(fullname)) {
      thisMaxLength = 7;
    }
    if (this.props.product.name.length > thisMaxLength) {
      cropped = true;
      name = this.props.product.name.substring(0, thisMaxLength - 3) + '...';
    } else {
      name = this.props.product.name;
    }
    return {
      cropped,
      fullname,
      name,
    };
  },
  _remove() {
    track('ITEM_REMOVED_FROM_WISHLIST', {itemId: this.props.product.id});
    WishlistActions.remove(this.props.product);
  },

  render() {

    let name = <h5>{this.state.name}</h5>;

    if (this.state.cropped) {
      name = (
        <div>
          <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={<Popover id={`popover-${this.name}`}>{this.state.fullname}</Popover>}>
            {name}
          </OverlayTrigger>
        </div>
      );
    }

    return (
      <div className="wishlist-container__wish">
        <div className="wishlist-container__wish__inner effect6">
        {name}
        <div className="sm-img-container">
          <img src={this.props.product.sm_image_path} alt=""/>
        </div>
        <Button bsStyle="danger" bsSize="xs" onClick={this._remove}>Remove</Button>
        </div>
      </div>
    );
  },
});
