var React = require("react");

var TopMenu = React.createClass({
    render: function(){

        var tabs = ["All", "Friends"];

        tabs = tabs.map(function(t, i){
            var _class = i === 0 ? "tab active" : "tab no-active";
            return(
                <div id={t+"-tab"} className={_class}><div>{t}</div></div>
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
