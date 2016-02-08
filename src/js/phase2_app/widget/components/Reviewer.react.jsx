var React = require('react');
var WidgetActions = require('../actions/WidgetActions');
var classNames = require('classnames');
import track from '../../tracking';

export default React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    productData: React.PropTypes.object,
  },

  getReview() {
    track('REVIEW_VIEWED_IN_MOVIE_PAGE', {
      itemId: this.props.productData.id,
      userId: this.props.user.id,
    });
    WidgetActions.doGetReview(this.props.user, this.props.productData.id);
  },

  render() {
    const slicked = this.props.productData.numReviewers > 3;
    // We set the class
    const reviewerClass = classNames.call(this, 'reviewer', {
      'slicked': slicked,
      'not-slicked': !slicked,
    });

    return (
      <div className={reviewerClass} onClick={this.getReview}>
        <i className="fa fa-user fa-2x"></i>
        <span className="username">{this.props.user.username}</span>
      </div>
    );
  },
});
