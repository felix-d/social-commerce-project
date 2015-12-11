var React = require("react");
var { Row, Col, Navbar, Nav } = require("react-bootstrap");
var { NavItemLink } = require("react-router-bootstrap");

var SearchPage = React.createClass({
    render(){
        return (
            <Navbar brand="Review It">
                <Nav>
                    <NavItemLink to="products">Products</NavItemLink>
                    <NavItemLink to="profile">My Profile</NavItemLink>
                </Nav>
            </Navbar>
        )
    }
})

    module.exports = SearchPage;
