'use strict';

var React = require("react"),
    Reflux = require("reflux"),
    {Row, Col} = require("react-bootstrap"),
    Wishlist = require("./Wishlist.react.jsx"),
    UserStore = require("../stores/UserStore"),
    WishlistStore = require("../stores/WishlistStore");


var ProfilePage = React.createClass({

    mixins: [Reflux.connect(UserStore)],

    getInitialState(){
        return UserStore.getUserInfo();
    },

    render(){
        return (
            <div>
                <Row>
                    {/* Profile picture */}
                    <Col xs={3}>
                        <img src={this.state.pic} alt={this.state.username}/>
                        <div><h3>{this.state.username}</h3></div>
                    </Col>

                {/* Whish List */}
                    <Col xs={9}>
                    <Wishlist/>
                    </Col>
                </Row>
                <Row>
                    {/* Your friends */}
                    <Col xs={12}>
                    </Col>
                </Row>
                <Row>
                    {/* Shit you've reviewed */}
                    <Col xs={12}>
                    </Col>
                </Row>
            </div>
        );
    }

});

module.exports = ProfilePage;


