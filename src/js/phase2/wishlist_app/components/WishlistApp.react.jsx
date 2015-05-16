var React = require("react");
var Reflux = require("reflux");
var ProductWidget = require("./ProductWidget.react.jsx");
var TopMenu = require("./TopMenu.react.jsx");
var SideBar = require("./SideBar.react.jsx");
var ProductsContainer = require("./ProductsContainer.react.jsx");
var SideBarStore = require("../stores/SideBarStore");
var WidgetStore = require("../stores/WidgetStore");

var WishlistApp = React.createClass({

    mixins: [Reflux.connect(WidgetStore)],
    
    getInitialState: function(){
        return WidgetStore.getShowWidgetState();
    },

    componentDidMount: function(){
        
    },
    render: function(){
        return(
            <div>
                {this.state.showWidget ? <ProductWidget/> : undefined}
                <div className="row">
                    <div className="col-xs-3">
                        <SideBar/>
                    </div>
                    <div className="col-xs-9">
                        <div className="row">
                            <div className="col-xs-12">
                                <TopMenu />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12" id="outer-products-container">
                                <ProductsContainer/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})

module.exports = WishlistApp;
