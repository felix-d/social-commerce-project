var React = require("react");
var MainMenu = require("./MainMenu.react.jsx");
var { Row, Col, Modal } = require("react-bootstrap");
var { RouteHandler, Route } = require("react-router");

var WishlistApp = React.createClass({

    render: function(){
        return(
            <div>
                <Row>
                    <Col xs={12}>
                        <MainMenu/>
                    </Col>
                </Row>
                <RouteHandler/>
            </div>
        );
    }
})

module.exports = WishlistApp;
