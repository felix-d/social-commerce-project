var React = require('react');
var ReviewFormTab = require('./ReviewFormTab.react.jsx');
var ProductActions = require('../actions/ProductActions');
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var StarsRating = require('./StarsRating.react.jsx');

var ReviewForm = React.createClass({

  propTypes: {
    product: React.PropTypes.object,
  },

  // We only need to set initial state since
  // component gets unmounted each time the box closes
  getInitialState() {
    return ReviewBoxStore.getReviewData();
  },

  submitReview() {
    // We get the updated data, no need to use an event for that
    var reviewData = ReviewBoxStore.getReviewData();

    // Submit the review via Ajax
    ProductActions.submitReview(this.props.product, reviewData);

    // Close the review box
    ProductActions.closeReviewBox();
  },

  // Toggle 'recommendIt' between true and false
  toggleRecommendIt() {
    ProductActions.toggleRecommendIt();
  },

  // When the comment is changing, set the store
  // (we could not make use of the store, but still,
  // it's good practice)
  commentChanged() {
    ProductActions.commentChanged(this.refs.comment.value);
  },

  // Delete the review
  deleteReview() {
    ProductActions.deleteReview(this.props.product);
    // Close the review box
    ProductActions.closeReviewBox();
  },

  render() {
    // The tabs
    var tabs = this.state.tabs.map((re, i) => {
      var href = '#tab' + i;
      return (
        <li className={i === 0 ? 'active' : ''} key={i}>
          <a href={href} data-toggle="tab">
            {re.name}
          </a>
        </li>
      );
    });

    // the tab content
    var tabContent = this.state.tabs.map((re, i) => {
      var id = 'tab' + i;
      return (
        <ReviewFormTab active={i === 0 ? true : false} data={re.categories} id={id} key={i}/>
      );
    });

    // are we editing
    var editing = this.props.product.review ? true : false;
    var deleteBtn = null;
    var submitBtnTxt = 'Submit';

    // if we are editing
    if (editing) {
      // we set the delete button
      deleteBtn = (
      <button className="btn btn-danger bottom-btn"
              onClick={this.deleteReview}>
        Delete
      </button>
      );
      // we change the button text to edit
      submitBtnTxt = 'Edit';
    }

    return (
      <div>
        <div role="tabpanel" className="tab-panel">
          <ul className="nav nav-tabs" role="tablist">
            {tabs}
          </ul>
          <div className="tab-content" ref="tabContent">
            {tabContent}
          </div>
        </div>
        <hr />
        <textarea className="form-comments"
                  placeholder="Your comments"
                  ref="comment" rows="3"
                  onChange={this.commentChanged}
                  defaultValue={this.state.comment}>
        </textarea>
        <StarsRating rating={this.state.rating}/>
        <div id="submit-container">
          <button className="btn btn-primary bottom-btn" id="submit-button" onClick={this.submitReview}>{submitBtnTxt}</button>
          {deleteBtn}
        </div>
      </div>
    )
  }
});

module.exports = ReviewForm;
