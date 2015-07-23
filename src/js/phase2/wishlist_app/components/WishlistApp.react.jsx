var React = require("react");
var Reflux = require("reflux");
var ProductWidget = require("../widget/components/ProductWidget.react.jsx");
var SideBarStore = require("../products/stores/SideBarStore");
var WidgetStore = require("../widget/stores/WidgetStore");
var MainMenu = require("./MainMenu.react.jsx");
var { Row, Col } = require("react-bootstrap");
var { RouteHandler, Route } = require("react-router");

var WishlistApp = React.createClass({

    mixins: [Reflux.listenTo(WidgetStore, 'showOrHideWidget')],
    
    getInitialState: function(){
        return {
            showWidget: false
        };
    },

    showOrHideWidget(state){
        this.setState(state);
    },

    componentDidMount: function(){
        
    },

    render: function(){
        return(
            <div>
                {this.state.showWidget ? <ProductWidget/> : undefined}
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
