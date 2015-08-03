var React = require("react/addons"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup,
    Reflux = require("reflux"),
    Wish = require("./Wish.react.jsx"),
    WishlistStore = require("../stores/WishlistStore");

var Wishlist = React.createClass({

    mixins: [Reflux.connect(WishlistStore, 'wishlist')],

    getInitialState(){
        return WishlistStore.getWishlist();
    },

    render(){

        var wishes  = this.state.wishlist.map((v, i) => <Wish product={v} key={i}/>);
        return (
            <div id="wishlist-container">
                <h3>Your Wishlist</h3>
                <CSSTransitionGroup transitionName="fadeIn">
                {wishes}
                </CSSTransitionGroup>
            </div>
        );
    }
});

module.exports = Wishlist;
