var React = require("react"),
    Reflux = require("reflux"),
    FiltersActions = require("../actions/FiltersActions"),
    FiltersStore = require("../stores/FiltersStore"),
    classNames = require("classnames"),
    ProductActions = require("../actions/ProductsActions");

var TopMenu = React.createClass({

    
    mixins: [Reflux.connect(FiltersStore)],

    // We only need the initial state,
    // the tabs dont change because of external
    // actions. 
    getInitialState(){
        return {
            activeTab: FiltersStore.getActiveTab()
        } 
    },

    render: function(){

        var tabs = ["All", "Friends", "Friends of friends", "Friends with mutual friends", "Friends with mutual likes"];

        tabs = tabs.map(function(t, i){
            function tabClicked(){
                FiltersActions.changeTab(i);
            }

            var classes = classNames("tab", {
                "active": i === this.state.activeTab,
                "no-active": i !== this.state.activeTab
            });

            return(
                <div id={i+"-tab"} key={i} className={classes}><div onClick={tabClicked}><span>{t}</span></div></div>
            );
        }.bind(this))

        return (
            <div id="topmenu">
                {tabs}
            </div>
        );
    }
})

module.exports = TopMenu;
