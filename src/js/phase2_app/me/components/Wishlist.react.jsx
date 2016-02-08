import React from 'react';
import { Badge, Glyphicon } from 'react-bootstrap';
import Reflux from 'reflux';
import Slider from 'react-slick';

import Wish from './Wish.react.jsx';
import WishlistStore from '../stores/WishlistStore';
import { isEmpty } from 'lodash';

const settings = {
  dots: true,
  infinite: false,
  arrows: true,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 7,
};

export default React.createClass({

  mixins: [Reflux.connect(WishlistStore, 'wishlist')],

  getInitialState() {
    return WishlistStore.getWishlist();
  },

  render() {

    let wishes = null;

    if (this.state.wishlist) {
      wishes = this.state.wishlist.map(
        v => <div key={v.id}><Wish product={v} key={v.id} /></div>);
    }

    if (this.state.wishlist && !isEmpty(this.state.wishlist)) {
      wishes = <Slider {...settings}>{wishes}</Slider>;
    }

    const placeholders = Array.apply(null, Array(settings.slidesToShow)).map((v, i) =>
      <div key={i} className="emptywish"/>
    );

    return (
      <div id="wishlist-container">
        <h3>
          <Glyphicon glyph="star"/>
          Your Wishlist
          <Badge>{this.state.wishlist && this.state.wishlist.length}</Badge></h3>
        <div id="wishlist-container__inner">
          <div className="emptywishes">
            {placeholders}
          </div>
          {wishes}
        </div>
      </div>
    );
  },
});
