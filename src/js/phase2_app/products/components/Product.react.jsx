import React from 'react';
import classnames from 'classnames';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Reflux from 'reflux';

import { A, F, FOF, MF, ML } from '../../products/constants/ProductsConstants';
import WidgetActions from '../../widget/actions/WidgetActions';
import WishlistStore from '../../me/stores/WishlistStore';
import UserStore from '../../me/stores/UserStore';
import WishlistActions from '../../me/actions/WishlistActions';

// The crop length for the product name
const cropLength = 11;

export default React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    currentPage: React.PropTypes.string,
  },

  mixins: [
    Reflux.listenTo(WishlistStore, 'onWishlistChange'),
    Reflux.listenTo(UserStore, 'onUserStoreChange'),
  ],

  getInitialState() {
    return {
      imgActive: false,
      displayAllReviews: UserStore.displayAllReviews(),
    };
  },


  shouldComponentUpdate(nextProps, nextState) {
    // we update if the id is not the same for the component
    // and if we're not on the same page (all, f, fof)
    // or if the product just got add or removed from whishlist
    // or if displayAllReviews has changed
    if (nextProps.data.id !== this.props.data.id ||
        nextProps.currentPage !== this.props.currentPage ||
        WishlistStore.getIdLastSetProduct() === this.props.data.id ||
        nextState.imgActive !== this.state.imgActive ||
        nextState.displayAllReviews !== this.state.displayAllReviews
    ) {

      WishlistActions.resetIdLastSetProduct();

      return true;
    }
    return false;
  },

  onUserStoreChange() {
    this.setState({
      displayAllReviews: UserStore.displayAllReviews(),
    });
  },

  onWishlistChange() {
    this.setState({});
  },

  _showImage() {
    this.setState({
      imgActive: true,
    });
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

    const imgClass = classnames('show-image', {
      active: this.state.imgActive,
    });

    // Control of the opacity changes
    textClassName = classnames({
      'low-opacity': !!this.props.data.iswish,
    });

    imgContainerClassName = classnames('sm-img-container', {
      'low-opacity': !!this.props.data.iswish,
    });

    starIcon = this.props.data.iswish ? (<i className="fa fa-star"></i>) : null;

    // Name cropping
    if (this.props.data.name.length > cropLength) {
      const id = `popover-${this.props.data.name}`;
      const popover = (<Popover id={id}>{this.props.data.name}</Popover>);
      name = (
        <OverlayTrigger trigger={['hover', 'focus']}
                        ref="trigger"
                        placement="top"
                        overlay={popover}>
           <h5 className={textClassName}>
              {this.props.data.name.substring(0, cropLength) + '...'}
           </h5>
        </OverlayTrigger>
      );
    } else {
      name = (<h5 className={textClassName}>{this.props.data.name}</h5>);
    }


    // The little message under the picture
    let numReviewers = null;
    if (this.state.displayAllReviews) {
      numReviewers = this.props.data.all_reviewers && this.props.data.all_reviewers.length || 0;
    } else {
      switch (this.props.currentPage) {
        case A:
          numReviewers = this.props.data.all_reviewers && this.props.data.all_reviewers.length || 0;
          break;
        case F:
          numReviewers = this.props.data.f_reviewers && this.props.data.f_reviewers.length || 0;
          break;
        case FOF:
          numReviewers = this.props.data.fof_reviewers && this.props.data.fof_reviewers.length || 0;
          break;
        case MF:
          numReviewers = this.props.data.mf_reviewers && this.props.data.mf_reviewers.length || 0;
          break;
        case ML:
          numReviewers = this.props.data.ml_reviewers && this.props.data.ml_reviewers.length || 0;
          break;
        default:
      }
    }

    switch (numReviewers) {
      case 0:
        numReviewersTag = 'Nobody reviewed this product';
        break;
      case 1:
        numReviewersTag = `${numReviewers} user reviewed this product`;
        break;
      default:
        numReviewersTag = `${numReviewers} users reviewed this product`;
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
                   className={imgClass}
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
           {this.props.data.iswish ? 'Remove' : 'Click'}
        </button>
        </div>
    );
  },
});
