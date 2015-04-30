var Reflux = require("reflux");
var SideBarActions = require("../actions/SideBarActions");
var _ = require("lodash");

var _tags,
    _textSearch,
    // the default search method
    _sortBy = 'random';

function addIsCheckedFalse(tags){
    return tags.map(function(t){
        return {name: t, isChecked: false};
    });
}

function shuffle(){
    _products = _.suffle(_products);
}

var SideBarStore = Reflux.createStore({

    listenables: [SideBarActions],

    // setup by us in app.jsx
    setup: function(tags){
        _tags = addIsCheckedFalse(tags);
    },

    // returns the tags
    getTags: function(tags){
        return {
            tags: _tags
        };
    },

    // get text search value
    getTextSearch: function(){
        return _textSearch;
    },

    // when the user inputs in text search
    onTextSearch: function(text){
        _textSearch = text;
    },

    // when the user changes the sort method
    onSortBy: function(sortBy){
        _sortBy = sortBy;
    }

    

    

});


module.exports = SideBarStore;
