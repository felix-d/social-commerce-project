import React from 'react';
import Reflux from 'reflux';
import Slider from 'react-slick';

import Wish from './Wish.react.jsx';
import WishlistStore from '../stores/WishlistStore';

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

    // Wrapping wish with div to workaround a bug with react slider
    if (this.state.wishlist) {
      wishes = this.state.wishlist.map(
        v => <div key={v.id}><Wish product={v} key={v.id} /></div>);
    }

    wishes = wishes ? <Slider {...settings}>{wishes}</Slider> : null;

    return (
      <div id="wishlist-container">
        <h3>Your Wishlist</h3>
        <div id="wishlist-container__inner">
          {wishes}
        </div>
      </div>
    );
  },
});
