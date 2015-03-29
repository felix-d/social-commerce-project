var React = require("react");
var ProductBox = require("./ProductBox.react.jsx");
var TopMenu = require("./TopMenu.react.jsx");
var SideBar = require("./SideBar.react.jsx");
var ProductsContainer = require("./ProductsContainer.react.jsx");
var SideBarStore = require("../stores/SideBarStore");

var WishlistApp = React.createClass({
    render: function(){
        return(
            <div>
                <ProductBox/>
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
                            <div className="col-xs-12">
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
