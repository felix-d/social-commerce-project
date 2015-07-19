var React = require("react");
var SideBarActions = require("../actions/SideBarActions");
var ProductActions = require("../actions/ProductsActions");

var TopMenu = React.createClass({
    render: function(){

        var tabs = ["All", "Friends", "Friends of friends"];

        tabs = tabs.map(function(t, i){
            function tabClicked(){
                ProductActions.doChangePage(i);
                SideBarActions.doResetSideBar();
            }

            var _class = i === 0 ? "tab active" : "tab no-active";
            return(
                <div id={i+"-tab"} key={i} className={_class}><div onClick={tabClicked}><span>{t}</span></div></div>
            );
        })

        return (
            <div id="topmenu">
                {tabs}
            </div>
        );
    }
})

module.exports = TopMenu;
