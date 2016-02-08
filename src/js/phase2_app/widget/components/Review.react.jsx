import React from 'react';
import { Alert, Glyphicon } from 'react-bootstrap';
import Reflux from 'reflux';
import { trim } from 'lodash';
import { Link } from 'react-router';
import ReviewStore from '../stores/ReviewStore';
import { isEmpty } from 'lodash';
import track from '../../tracking';


const rectangles = (
    <div id="rects">
        <div className="rect" id="rect1"></div>
        <div className="rect" id="rect2"></div>
        <div className="rect" id="rect3"></div>
        <div className="rect" id="rect4"></div>
    </div>
);

export default React.createClass({

  mixins: [
    Reflux.listenTo(ReviewStore, '_setReview'),
  ],

  getInitialState() {
    return null;
  },

  componentWillUpdate() {
    $("#review-text").hide(); // eslint-disable-line
  },

  componentDidUpdate() {
    $("#review-text").fadeIn(); // eslint-disable-line
  },

  _setReview(review) {
    this.setState(review);
  },

  _clickedReviewer() {
    const id = this.state.reviewer.id;
    track('CLICK_REVIEWER_FROM_MOVIE_PAGE', {
      fromItemId: this.state.productid,
      toUserId: id,
    });
  },


  render() {
    let revData = null;
    let review = null;
    let comment = null;
    let rating = null;
    let innerReview = null;

    // If the state is empty, lets return rectangles
    if (this.state === null) {
      review = rectangles;
    } else {
      if (this.state &&
          isEmpty(this.state.answers) &&
          !this.state.rating &&
          trim(this.state.comment) === '') {
        innerReview = (
          <Alert className="warning-no-review" bsStyle="danger">
            This review is empty.
          </Alert>
        );
      } else {
        if (this.state.answers) {
          revData = Object.keys(this.state.answers).map((elem, i) =>
            <div key={i}>
              <span key={i}><strong>{elem}</strong>: </span>
              <span>
                {this.state.answers[elem]}
              </span>
            </div>
          );
        }
        if (trim(this.state.comment) !== '') {
          comment = (
            <span><strong>Comment: </strong> {this.state.comment}</span>
          );
        }
        if(this.state.rating){
          rating = [...Array(this.props.rating).keys()].map(() =>
            <Glyphicon glyph="star"/>);
          const remaining = 5 - rating.length;
          rating = rating.concat([...Array(remaining).keys()].map(() =>
            <Glyphicon glyph="star-empty"/>));
        }


        innerReview = (
          <div>
            <div className="rating-stars">
              {rating}
            </div>
            <div className="rating-data">
              {revData}
            </div>
            <div className="rating-comment">
              {comment}
            </div>
          </div>
        );
      }

      review = (
        <div key="">
          {innerReview}
        </div>
      );
    }

    return (
      <div className="review-inner">
        <h4 className="review-inner__review">Review</h4>
        {this.state && this.state.reviewer ? 
         <Link to={`/users/${this.state.reviewer.id}`} onClick={this._clickedReviewer}>
           <span className="see-profile-text">
             <Glyphicon glyph="eye-open"/> See <em>{this.state.reviewer.username}</em> profile
           </span>
         </Link> : null}
         <div id="review-text">
           {review}
        </div>
      </div>
    );
  },
});
