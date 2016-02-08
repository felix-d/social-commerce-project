import Reflux from 'reflux';
import request from 'superagent';
import UserActions from '../actions/UserActions';
import APIActions from '../../products/actions/APIActions';

const debug = require('debug')(__filename);


let _userInfo = {
  user: {
    pic: null,
    username: null,
  },
  friends: null,
  products: null,
};

let initModalClosed = false;
let nextStepModalClosed = false;

let _showUsersPics = null;
let _networkTraversing = null;
let _displayReviewsInUserPages = null;
let _displayAllReviews = null;

function getState() {
  return {
    ..._userInfo,
    initModalClosed,
    nextStepModalClosed,
    showUsersPics: _showUsersPics,
    networkTraversing: _networkTraversing,
    displayReviewsInUsersPages: _displayReviewsInUserPages,
    displayAllReviews: _displayAllReviews,
  };
}

export default Reflux.createStore({

  listenables: [UserActions, APIActions],

  init() {
    request.get('/phase2/userpage/')
      .end((err, res) => {
        if (res !== undefined) {
          _userInfo = JSON.parse(res.text);
          debug('Got user info', _userInfo);
          this.trigger(getState());
        }
      });
  },

  isNetworkTraversingAllowed() {
    return _networkTraversing;
  },

  displayReviewsInUsersPages() {
    return _displayReviewsInUserPages;
  },

  showUsersPics() {
    return _showUsersPics;
  },

  displayAllReviews() {
    return _displayAllReviews;
  },

  onFetchInitialDataCompleted(data) {
    const {
      showUserPics,
      displayReviewsInUserPages,
      networkTraversing,
      displayAllReviews,
    } = data;
    _showUsersPics = showUserPics;
    _displayReviewsInUserPages = displayReviewsInUserPages;
    _networkTraversing = networkTraversing;
    _displayAllReviews = displayAllReviews;
    this.trigger(getState());
  },

  getInitialState() {
    return _userInfo;
  },

  onCloseInitModal() {
    debug('Init modal closed');
    initModalClosed = true;
    this.trigger(getState());
  },

  onCloseNextStepModal() {
    debug('Next step modal closed');
    nextStepModalClosed = true;
    this.trigger(getState());
  },

});
