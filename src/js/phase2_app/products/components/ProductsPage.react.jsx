var React = require("react");
var { Row, Col } = require("react-bootstrap");
var SideBar = require("./SideBar.react.jsx");
var TopMenu = require("./TopMenu.react.jsx");
var ProductsContainer = require("./ProductsContainer.react.jsx");
var ProductWidgetContainer = require("../../widget/components/ProductWidgetContainer.react.jsx");

var ProductsPage = React.createClass({
    render(){
        return (
            <div>
                <ProductWidgetContainer/>
                <Row>
                    <Col xs={3}>
                    <SideBar/>
                </Col>
                <Col xs={9}>
                <Row>
                    <div className="col-xs-12">
                        <TopMenu />
                    </div>
                </Row>
                <Row>
                    <Col xs={12} id="outer-products-container">
                    <ProductsContainer/>
                    </Col>
                </Row>
                    </Col>
                </Row>
            </div>
        );
    }
})

module.exports = ProductsPage;
