import React from 'react';
import classnames from 'classnames';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Reflux from 'reflux';

import WidgetActions from '../../widget/actions/WidgetActions';
import WishlistStore from '../../me/stores/WishlistStore';
import WishlistActions from '../../me/actions/WishlistActions';

// The crop length for the product name
const cropLength = 11;

export default React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    currentPage: React.PropTypes.number,
  },

  mixins: [Reflux.connect(WishlistStore)],

  componentDidMount() {
    // We hide the image, because it'll show onload
    $(this.refs.img).hide();
  },

  shouldComponentUpdate(nextProps) {
    // we update if the id is not the same for the component
    // and if we're not on the same page (all, f, fof)
    // or if the product just got add or removed from whishlist
    if (nextProps.data.id !== this.props.data.id ||
       nextProps.currentPage !== this.props.currentPage ||
       WishlistStore.getIdLastSetProduct() === this.props.data.id) {

      WishlistActions.resetIdLastSetProduct();

      return true;
    }
    return false;
  },

  componentDidUpdate(prevprops) {
    // we dont hide the picture if we only update the checkmark sign
    if (prevprops.data.id !== this.props.data.id) {
      $(this.refs.img).hide();
    }
  },

  // called on onload
  _showImage() {
    $(this.refs.img).fadeIn(200);
  },

  _showProductWidget() {
    WidgetActions.doShowWidget(this.props.data);
  },

  render() {

    let numReviewersTag = null;
    let textClassName = null;
    let imgContainerClassName = null;
    let starIcon = null;
    let name = null;

    // Name cropping
    if (this.props.data.name.length > cropLength) {
      const popover = (<Popover>{this.props.data.name}</Popover>);
      name = (
        <OverlayTrigger trigger="hover"
                        ref="trigger"
                        placement="top"
                        overlay={popover}>
           <h5>
              {this.props.data.name.substring(0, cropLength) + '...'}
           </h5>
        </OverlayTrigger>
      );
    } else {
      name = (<h5>{this.props.data.name}</h5>);
    }

    // Control of the opacity changes
    textClassName = classnames({
      'low-opacity': !!this.props.data.iswish,
    });

    imgContainerClassName = classnames('sm-img-container', {
      'low-opacity': !!this.props.data.iswish,
    });

    starIcon = this.props.data.iswish ? (<i className="fa fa-star"></i>) : null;

    // The little message under the picture
    switch (this.props.data.numReviewers) {
      case 0:
        numReviewersTag = 'Nobody reviewed this product';
        break;
      case 1:
        numReviewersTag = `${this.props.data.numReviewers} user reviewed this product`;
        break;
      default:
        numReviewersTag = `${this.props.data.numReviewers} users reviewed this product`;
    }

    const buttonClassnames = classnames('btn', {
      'btn-info': !this.props.data.iswish,
      'btn-danger': this.props.data.iswish,
    });

    return (
        <div className="product effect6 animated fadeIn">

        {/* The product name */}
           {name}

        {/* The product image */}
        <div className="star-container">
            {starIcon}
            <div className={imgContainerClassName}>
                <img ref="img"
            src={this.props.data.sm_image_path}
            onLoad={this._showImage}/>
            </div>
        </div>

        {/* The product date */}
        <p className={textClassName}>{this.props.data.caracteristic_1}</p>

        {/* How many people reviewed this product */}
        <p className={textClassName}>{numReviewersTag}</p>

        {/* Open the box */}
        <button className={buttonClassnames} onClick={this._showProductWidget}>
           {this.props.data.iswish ? 'Remove' : 'More Info'}
        </button>
        </div>
    );
  },
});
