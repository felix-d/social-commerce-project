import React from 'react';
import Reflux from 'reflux';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import { getPic } from '../../utils/Utils.jsx';
import UsersStore from '../stores/UsersStore';
import UserStore from '../../me/stores/UserStore';
import FriendsList from '../../me/components/FriendsList.react.jsx';
import UsersActions from '../actions/UsersActions';
import WidgetActions from '../../widget/actions/WidgetActions';
import ProductsList from '../../me/components/ProductsList.react.jsx';
import { capitalize } from 'lodash';
import Loader from 'react-loader';

import track from '../../tracking';

const UserPage = React.createClass({

  propTypes: {
    params: React.PropTypes.object,
  },

  mixins: [Reflux.connect(UsersStore), Reflux.listenTo(UserStore, 'onUserStoreChange')],


  getInitialState() {
    return {
      ready: false,
      networkTraversing: UserStore.isNetworkTraversingAllowed(),
      displayReviewsInUsersPages: UserStore.displayReviewsInUsersPages(),
    };
  },

  componentWillMount() {
    WidgetActions.doHideWidget();
    track('USER_VIEWED', {userId: this.props.params.userId});
  },

  componentDidMount() {
    UsersActions.getUserPage(this.props.params.userId);
  },

  componentWillUpdate(nextProps) {
    this._mayGetUserPage(nextProps);
  },

  componentDidUpdate(prevProps) {
    if (this.props.params.userId !== prevProps.params.userId) {
      // We are viewing a new user.
      track('USER_VIEWED', {userId: this.props.params.userId});
    }
  },

  onUserStoreChange() {
    this.setState({
      networkTraversing: UserStore.isNetworkTraversingAllowed(),
      displayReviewsInUsersPages: UserStore.displayReviewsInUsersPages(),
    });
  },


  _mayGetUserPage(checkProps) {
    // Means we are getting a new user.
    if (this.props.params.userId !== checkProps.params.userId) {
      UsersActions.getUserPage(checkProps.params.userId);
    }
  },

  _trackFriendClicked(id) {
    track('CLICK_REVIEWER_FROM_USER_PAGE', {
      fromUserId: this.state.user.id,
      toUserId: id,
    });
  },

  render() {
    const loaderOptions = {
      color: '#444',
      zIndex: 10,
    };
    let username = null;
    let pic = null;
    let friends = null;
    let products = null;

    if (this.state && this.state.user) {
      username = capitalize(this.state.user.username) || null;
      pic = getPic(this.state.user.pic) || null;
    }

    if (this.state && this.state.friends) {
      friends = (
        <FriendsList
            networkTraversing={this.state.networkTraversing}
            slidesToShow={5}
            trackFriendClicked={this._trackFriendClicked}
            friends={this.state.friends}/>
      );
    }

    if (this.state && this.state.products) {
      products = (
        <ProductsList
            numSlides={7}
            userid={this.state.user.id}
            products={this.state.products}
            review={this.state.displayReviewsInUsersPages}/>
      );
    }
    const backgroundZIndex = this.state.ready ? 0 : 100;
    return (
      <div className="user-page">
        <div className="user-page__background" style={{zIndex: backgroundZIndex}}>
          <i className="fa fa-user"/>
        </div>
        <Loader {...loaderOptions} loaded={this.state.ready} zIndex={99}>
          <div>
          <Row>
            {/* Profile picture */}
            <Col xs={3}>
                <div><h3 className="username">{username}</h3></div>
                <div className="profile-pic-container">
                    {pic}
                </div>
            </Col>
           {/* Shit the user has reviewed */}
            <Col xs={9}>
              <h3 className="products-reviewed-title">
                <Glyphicon glyph="ok"/>
                {username && `Products ${username} has reviewed.`}
              </h3>
              {products}
            </Col>
         </Row>
         <Row>
           <Col xs={6}>
             <h3 className="your-friends-title">
               <i className="fa fa-users"></i>
               {username && `${username}'s friends.`}
             </h3>
             {friends}
           </Col>
         </Row>
          </div>
        </Loader>
      </div>
    );
  },
});

module.exports = UserPage;
