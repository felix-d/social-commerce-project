import React from 'react';
import Reflux from 'reflux';
import Reviewer from './Reviewer.react.jsx';
import Slider from 'react-slick';
import UserStore from '../../me/stores/UserStore';
import { A, F, FOF, MF, ML } from '../../products/constants/ProductsConstants';


const ReviewersCarousel = React.createClass({

  propTypes: {
    currentPage: React.PropTypes.string,
    productData: React.PropTypes.object,
  },

  mixins: [Reflux.listenTo(UserStore, 'onUserStoreChange')],

  getInitialState() {
    return {
      displayAllReviews: UserStore.displayAllReviews(),
    };
  },

  onUserStoreChange() {
    this.setState({
      displayAllReviews: UserStore.displayAllReviews(),
    });
  },

  render() {
    let reviewers;
    if (this.state.displayAllReviews) {
      if (this.props.productData.all_reviewers) {
        reviewers = this.props.productData.all_reviewers.map((e, i) => {
          return (
            <div className="sm-reviewer" key={i}>
              <Reviewer key={i} user={e} productData={this.props.productData}/>
            </div>
          );
        });
      }
    } else {
      switch (this.props.currentPage) {
        case A:
          if (this.props.productData.all_reviewers) {
            reviewers = this.props.productData.all_reviewers.map((e, i) => {
              return (
                <div className="sm-reviewer" key={i}>
                  <Reviewer key={i} user={e} productData={this.props.productData}/>
                </div>
              );
            });
          }
          break;

        case F:
          if (this.props.productData.f_reviewers) {
            reviewers = this.props.productData.f_reviewers.map((e, i) => {
              return (
                <div className="sm-reviewer" key={i}>
                  <Reviewer key={i} user={e} productData={this.props.productData}/>
                </div>
              );
            });
          }
          break;

        case FOF:
          if (this.props.productData.fof_reviewers) {
            reviewers = this.props.productData.fof_reviewers.map((e, i) => {
              return (
                <div className="sm-reviewer" key={i}>
                  <Reviewer key={i} user={e} productData={this.props.productData}/>
                </div>
              );
            });
          }
          break;
        case MF:
          if (this.props.productData.fof_reviewers) {
            reviewers = this.props.productData.mf_reviewers.map((e, i) => {
              return (
                <div className="sm-reviewer" key={i}>
                  <Reviewer key={i} user={e} productData={this.props.productData}/>
                </div>
              );
            });
          }
          break;
        case ML:
          if (this.props.productData.fof_reviewers) {
            reviewers = this.props.productData.ml_reviewers.map((e, i) => {
              return (
                <div className="sm-reviewer" key={i}>
                  <Reviewer key={i} user={e} productData={this.props.productData}/>
                </div>
              );
            });
          }
          break;
        default:
          break;
      }
    }

    const settings = {
      dots: false,
      infinite: false,
      arrows: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
    };

    if (reviewers) {
      reviewers = <Slider {...settings}>{reviewers}</Slider>;
    } else {
      reviewers = <span>No user reviewed this product.</span>;
    }

    return (
      <div className="reviewers-inner">
         {reviewers}
      </div>
    );
  },
});

module.exports = ReviewersCarousel;
