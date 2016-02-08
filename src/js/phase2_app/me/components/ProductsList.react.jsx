import React from 'react';
import Slider from 'react-slick';
import Review from '../../components/Review.react.jsx';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import track from '../../tracking';

const cropMax = 10;

const PopoverButton = React.createClass({

  propTypes: {
    overlay: React.PropTypes.object,
    userid: React.PropTypes.number,
    itemid: React.PropTypes.number,
  },

  _seeingReview() {
    track('REVIEW_VIEWED_IN_REVIEWER_PAGE', {
      itemId: this.props.itemid,
      userId: this.props.userid,
    });
  },

  render() {
    return (
      <OverlayTrigger trigger="click"
                      placement="bottom"
                      rootClose
                      ref="trigger"
                      overlay={this.props.overlay}>
         <Button onClick={this._seeingReview} bsSize="xs" bsStyle="info" className="user-page__see-review-button">
            See review
         </Button>
      </OverlayTrigger>
    );
  },
});

const ProductsList = React.createClass({

  propTypes: {
    numSlides: React.PropTypes.number,
    review: React.PropTypes.object,
    products: React.PropTypes.array,
    userid: React.PropTypes.number,
    imgClass: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      numSlides: 5,
    };
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

      let review = this.props.review || false;
      let button = null;
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

        if (review) {
          const props = {
            answers: p.review.boolAnswers,
            rating: p.review.rating,
            comment: p.review.comment,
          };
          const key = `${p.id}:${this.props.userid}`;
          review = p.review.boolAnswers || p.review.rating || p.review.comment ?
                   <Review key={key} {...props}/> : 'The review is empty.';

          const popover = <Popover key={key}>{review}</Popover>;
          button = (
            <PopoverButton
                userid={this.props.userid}
                itemid={p.id}
                key={key}
                overlay={popover}/>
          );
        }
        let imgClass = 'product-list__product__img';
        imgClass = this.props.imgClass ? `${imgClass}--${this.props.imgClass}` : imgClass;
        return (
          <div key={p.id}>
            <div className="product-list__product">
              <div className="product-list__product__inner effect6">
                <h5>{name}</h5>
                <img src={p.sm_image_path} className={imgClass} alt=""/>
                {button}
              </div>
            </div>
          </div>
        );
      });
      slider = <Slider {...settings}>{products}</Slider>;
    }
    return slider;
  },
});

module.exports = ProductsList;

