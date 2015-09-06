"use strict";

let React = require("react/addons"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup,
    Reflux = require("reflux"),
    Wish = require("./Wish.react.jsx"),
    Slider = require("react-slick"),
    WishlistStore = require("../stores/WishlistStore"),
    slickOptions = require("../../utils/Config").slickOptionsWishList;

let _$wishlist;

let Wishlist = React.createClass({

    mixins: [Reflux.connect(WishlistStore, 'wishlist')],

  getInitialState(){
    return WishlistStore.getWishlist();
  },

    render(){

      // Wrapping wish with div to workaround a bug with react slider
      let wishes = this.state.wishlist && this.state.wishlist.map(
        (v, i) => <div key={v.id}><Wish product={v} key={v.id} /></div>);

      let settings = {
        dots: true,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 7
      };

      wishes = wishes ? <Slider {...settings}>{wishes}</Slider> : null;


      return (
        <div id="wishlist-container">
           <h3>Your Wishlist</h3>
           <div id="wishlist-container__inner">
              {wishes}
           </div>
        </div>
      );
    }
});

module.exports = Wishlist;
