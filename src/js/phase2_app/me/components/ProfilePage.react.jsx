'use strict';

var React = require("react"),
    Reflux = require("reflux"),
    {Row, Col} = require("react-bootstrap"),
    Wishlist = require("./Wishlist.react.jsx"),
    FriendsList = require("./FriendsList.react.jsx"),
    ProductsList = require("./ProductsList.react.jsx"),
    UserStore = require("../stores/UserStore"),
    getPic = require("../../utils/Utils.jsx").getPic,
    WishlistStore = require("../stores/WishlistStore");

let _$wishlist;

var ProfilePage = React.createClass({

    mixins: [Reflux.connect(UserStore)],

    render(){
        return (
            <div>
                <Row>
                    {/* Profile picture */}
                    <Col xs={3}>
                    <div className="profile-pic-container">
                    {getPic(this.state.user.pic)}
                    </div>
                        <div><h3>{this.state.user.username}</h3></div>
                    </Col>

                {/* Whish List */}
                    <Col xs={9}>
                    <Wishlist/>
                    </Col>
                </Row>
                <Row>
                    {/* Your friends */}
                    <Col xs={12}>
                    <h3>
                       Your friends
                    </h3>
                    <FriendsList friends={this.state.friends}/>
                    </Col>
                </Row>
                <Row>
                    {/* Shit you've reviewed */}
                    <Col xs={12}>
                    <h3>
                       Products you have reviewed.
                    </h3>
                    <ProductsList products={this.state.products}/>
                    </Col>
                </Row>
            </div>
        );
    }

});

module.exports = ProfilePage;


