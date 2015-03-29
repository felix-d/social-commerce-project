var Reflux = require("reflux");
var SideBarActions = require("../actions/SideBarActions");

var _tags;

function addIsCheckedFalse(tags){
    return tags.map(function(t){
        return {name: t, isChecked: false};
    });
}

var SideBarStore = Reflux.createStore({
    listenables: [SideBarActions],
    setup: function(tags){
        _tags = addIsCheckedFalse(tags);
    },
    getTags: function(tags){
        return {
            tags: _tags
        };
    }
});


module.exports = SideBarStore;
