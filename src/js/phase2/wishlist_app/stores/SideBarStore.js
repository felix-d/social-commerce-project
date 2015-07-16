var Reflux = require("reflux");
var SideBarActions = require("../actions/SideBarActions");
var ProductsStore = require("./ProductsStore");
var _ = require("lodash");

var _tags,
    _textSearch,
    _sortBy;

function addIsCheckedFalse(tags){
    return tags.map(function(t){
        return {name: t, isChecked: false};
    });
}

function resetTagsToFalse(tags){
    return tags.map(function(t){
        t.isChecked = false;
    });
}

function shuffle(){
    _products = _.suffle(_products);
}

var SideBarStore = Reflux.createStore({

    listenables: [SideBarActions],

    init: function(){
        _textSearch = "";
        _sortBy = "Random";
    },

    // setup by us in app.jsx
    setup: function(tags){
        _tags = addIsCheckedFalse(tags);
    },

    // returns the tags as state
    getTagsState: function(){
        return {
            tags: _tags
        };
    },


    getSideBarState: function(){
        return {
            tags: _tags,
            sortBy: _sortBy,
            textSearch: _textSearch
        };
    },

    // return the tags
    getTags: function(){
        return _tags;
    },

    // get text search value
    getTextSearch: function(){
        return _textSearch;
    },

    // get sort by
    getSortBy: function(){
        return _sortBy;
    },

    // when the user inputs in text search
    onDoTextSearch: function(text){
        _textSearch = text;
        ProductsStore.search(_textSearch, _sortBy, _tags);
    },

    // when the user changes the sort method
    onDoSortBy: function(sortBy){
        _sortBy = sortBy;
        ProductsStore.search(_textSearch, _sortBy, _tags);
    },

    // shuffle the products
    onDoShuffle: function(){
        _sortBy = "random";
        console.log(ProductsStore);
        ProductsStore.shuffle();
    },

    // search with tags
    onDoSearch: function(){
        ProductsStore.search(_textSearch, _sortBy, _tags);
    },

    // reset everything
    onDoResetSideBar: function(){
        resetTagsToFalse(_tags);
        _sortBy = "random";
        _textSearch = "";
        $('.tags-group label').removeClass('active');
        this.trigger(this.getSideBarState());
    }
});


module.exports = SideBarStore;
