var React = require("react");
var SideBarActions = require("../actions/SideBarActions");
var ProductActions = require("../actions/ProductsActions");

var TopMenu = React.createClass({
    render: function(){

        var tabs = ["All", "Friends"];

        tabs = tabs.map(function(t, i){
            function tabClicked(){
                ProductActions.doChangePage(i);
                SideBarActions.doResetSideBar();
            }

            var _class = i === 0 ? "tab active" : "tab no-active";
            return(
                <div id={t+"-tab"} className={_class}><div onClick={tabClicked} clickable><span>{t}</span></div></div>
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
