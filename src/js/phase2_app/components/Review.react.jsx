import React from 'react';
import { Glyphicon, Alert } from 'react-bootstrap';
import { isEmpty, isUndefined, trim } from 'lodash';

const Review = React.createClass({

  propTypes: {
    answers: React.PropTypes.object,
    rating: React.PropTypes.number,
    comment: React.PropTypes.string,
  },

  render() {

    const revData = [];
    let rating = null;
    let rendered = null;
    let comment = null;

    if ((isEmpty(this.props.answers) || isUndefined(this.props.answers)) &&
        isUndefined(this.props.rating) &&
        (trim(this.props.comment) === '' || isUndefined(this.props.comment))) {
      rendered = (
          <Alert className="warning-no-review" bsStyle="danger">
            This review is empty.
          </Alert>
        );
    } else {

      for (const k of Object.keys(this.props.answers)) {
        revData.push(
          <div key={k}>
            <span key={k}><strong>{k}</strong>: </span>
            <span>
              {this.props.answers[k]}
            </span>
          </div>
        );
      }

      if (this.props.rating) {
        rating = [...Array(this.props.rating).keys()].map(() =>
          <Glyphicon glyph="star"/>);
        const remaining = 5 - rating.length;
        rating = rating.concat([...Array(remaining).keys()].map(() =>
          <Glyphicon glyph="star-empty"/>));
      }
      if (this.props.comment) {
        comment = (<span><strong>Comment:</strong> {this.props.comment}</span>);
      }

      rendered = (
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
    return rendered;
  },
});

module.exports = Review;
