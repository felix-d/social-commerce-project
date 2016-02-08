import React from 'react';
import Reflux from 'reflux';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import Wishlist from './Wishlist.react.jsx';
import FriendsList from './FriendsList.react.jsx';
import ProductsList from './ProductsList.react.jsx';
import UserStore from '../stores/UserStore';
import { getPic } from '../../utils/Utils.jsx';
import track from '../../tracking';

import { capitalize } from 'lodash';

export default React.createClass({

  mixins: [Reflux.connect(UserStore)],

  componentWillMount() {
    track('PROFILE_VIEWED');
  },

  _trackFriendClicked(id) {
    track('CLICK_REVIEWER_FROM_PROFILE', {
      toUserId: id,
    });
  },

  render() {
    return (
      <div>
        <Row>
          {/* Profile picture */}
          <Col xs={3}>
            <h3 className="username">
              {capitalize(this.state.user.username)}
            </h3>
            <div className="profile-pic-container">
              {getPic(this.state.user.pic, true)}
            </div>
            <div>
            </div>
          </Col>

          {/* Whish List */}
          <Col xs={9}>
            <Wishlist/>
          </Col>
        </Row>
        <Row className="profile__lower-row">
          <div className="profile__lower-row__friends">
            {/* Your friends */}
            <Col xs={6} className="xs-padding">
              <h3 className="your-friends-title">
                <i className="fa fa-users"></i>
                Your friends
              </h3>
              <FriendsList slidesToShow={5}
                           trackFriendClicked={this._trackFriendClicked}
                           friends={this.state.friends}/>
            </Col>
          </div>
          {/* Shit you've reviewed */}
          <div className="profile__lower-row__products">
            <Col xs={6} className="xs-padding">
              <h3 className="products-reviewed-title">
                <Glyphicon glyph="ok"/>
                Products you have reviewed.
              </h3>
              <ProductsList imgClass="profile" products={this.state.products}/>
            </Col>
          </div>
        </Row>
      </div>
    );
  },
});
