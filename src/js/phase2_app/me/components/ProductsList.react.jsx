import React from 'react';
import Reflux from 'reflux';
import classnames from 'classnames';
import Slider from 'react-slick';
import UserPageProductModal from './UserPageProductModal.react.jsx';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import track from '../../tracking';
import WidgetActions from '../../widget/actions/WidgetActions';
import WishlistStore from '../stores/WishlistStore';

const cropMax = 10;

// track('REVIEW_VIEWED_IN_REVIEWER_PAGE', {

const ProductsList = React.createClass({

  propTypes: {
    numSlides: React.PropTypes.number,
    review: React.PropTypes.bool,
    products: React.PropTypes.array,
    userid: React.PropTypes.number,
    showCheck: React.PropTypes.bool,
    imgClass: React.PropTypes.string,
  },

  mixins: [Reflux.connect(WishlistStore)],


  getDefaultProps() {
    return {
      numSlides: 5,
      showCheck: false,
    };
  },

  seeMore(p) {
    track('ITEM_VISITED', {itemId: p.id});
    WidgetActions.doGetReview(this.props.userid, p.id);
    this.setState({
      showDetails: true,
      data: p,
    });
  },

  hideDetails() {
    WidgetActions.doHideWidget();
    track('ITEM_CLOSED', {itemId: this.state.data.id});
    this.setState({
      showDetails: false,
    });
  },

  render() {

    let slider = null;

    if (this.props.products) {

      const settings = {
        dots: false,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: this.props.numSlides,
        slidesToScroll: 1,
      };

      const products = this.props.products.map(p => {

        let original = null;
        let name = p.name;
        let shortName = null;

        if (p.name.length > cropMax) {
          original = p.name;
          shortName = original.substring(0, cropMax - 3) + '...';
          name = (
            <OverlayTrigger trigger={['hover', 'focus']}
                            placement="top"
                            overlay={<Popover>{original}</Popover>}>
               <span>{shortName}</span>
            </OverlayTrigger>
          );
        }

        let imgClass = 'product-list__product__img';
        imgClass = this.props.imgClass ? `${imgClass}--${this.props.imgClass}` : imgClass;

        let textClassName = null;
        let starIcon = null;
        let imgContainerClassName = null;
        let button = null;
        // Control of the opacity changes
        textClassName = classnames({
          'low-opacity': !!p.iswish,
        });

        imgContainerClassName = classnames('sm-img-container', {
          'low-opacity': !!p.iswish,
        });
        const starClass = classnames('fa fa-star', {
          'small': !this.props.showCheck,
        });
        starIcon = p.iswish ? (<i className={starClass}></i>) : null;
        button = p.iswish ? (
          <Button
              className="user-page-check-btn"
              bsStyle="danger"
              onClick={this.seeMore.bind(this, p)}>
            Remove
          </Button>
        ) : (
          <Button
              className="user-page-check-btn"
              bsStyle="info"
              onClick={this.seeMore.bind(this, p)}>
            Click
          </Button>
        );

        return (
          <div key={p.id}>
            <div className="product-list__product">
              <div className="product-list__product__inner effect6">
                <h5 className={textClassName}>{name}</h5>
                <div className="star-container">
                  {starIcon}
                  <div className={imgContainerClassName}>
                    <img className={imgClass}
                         src={p.sm_image_path}
                         className={imgClass}
                         alt=""/>
                  </div>
                </div>
                {this.props.showCheck ? button : null}
              </div>
            </div>
          </div>
        );
      });
      slider = <Slider {...settings}>{products}</Slider>;
    }
    return (
      <div>
      {this.state ? (
        <UserPageProductModal
            className="col-xs-12"
            data={this.state.data}
            show={this.state.showDetails}
            review={this.props.review}
            hide={this.hideDetails}/>
      ) : null}
        {slider}
      </div>
    );
  },
});

module.exports = ProductsList;

