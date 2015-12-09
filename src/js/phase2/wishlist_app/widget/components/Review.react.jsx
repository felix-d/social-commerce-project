import React from 'react';
import Reflux from 'reflux';
import { trim } from 'lodash';
import { Link } from 'react-router';
import ReviewStore from '../stores/ReviewStore';


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


  render() {

    const revData = [];

    let review = null;
    let comment = null;
    let rating = null;

    // If the state is empty, lets return rectangles
    if (this.state === null) {
      review = rectangles;
    } else {
      this.state.answers.forEach((elem, i) => {
        revData.push(
          <div key={i}>
            <span key={i}><strong>{i}</strong>: </span>
            <span>
              {elem}
            </span>
          </div>
        );

      });

      if (trim(this.state.comment) !== '') {
        comment = (
          <span><strong>Comment: </strong> {this.state.comment}</span>
        );
      }

      rating = this.state.rating ? null : (<span><strong>Rating: </strong> {this.state.rating}</span>);

      review = (
        <div key="">
          <div>
            {revData}
          </div>
          <div>
            {comment}
          </div>
          <div>
            {rating}
          </div>
          <Link to={`/users/${this.state.reviewer.id}`}>
            See {this.state.reviewer.username} profile
          </Link>
        </div>
      );
    }

    return (
      <div className="review-inner">
        <h4>Review</h4>
        <div id="review-text">
          {review}
        </div>
      </div>
    );
  },
});
