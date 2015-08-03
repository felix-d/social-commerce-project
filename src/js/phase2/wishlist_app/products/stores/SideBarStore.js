var Reflux = require("reflux"),
    SideBarActions = require("../actions/SideBarActions"),
    ProductsStore = require("./ProductsStore"),
    ProductsActions = require("../actions/ProductsActions"),
    debug = require("debug")(__filename),
    _ = require("lodash");

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

  init(){
    _textSearch = "";
    _sortBy = "Random";
  },

  // setup by us in app.jsx
  setup(tags){
    _tags = addIsCheckedFalse(tags);
  },

  // returns the tags as state
  getTagsState(){
    return {
      tags: _tags
    };
  },


  getSideBarState(){
    return {
      tags: _tags,
      sortBy: _sortBy,
      textSearch: _textSearch
    };
  },

  // return the tags
  getTags(){
    return _tags;
  },

  // get text search value
  getTextSearch(){
    return _textSearch;
  },

  // get sort by
  getSortBy(){
    return _sortBy;
  },

  // when the user inputs in text search
  onTextSearch(text){
    debug("onTextSearch");
    _textSearch = text;
    
    ProductsActions.search(_textSearch, _sortBy, _tags);
  },

  // when the user changes the sort method
  onSortBy(sortBy){
    debug("onSortBy");
    _sortBy = sortBy;
    ProductsActions.search(_textSearch, _sortBy, _tags);
  },

  // shuffle the products
  onShuffle(){
    debug("onShuffle");
    _sortBy = "random";
    console.log(ProductsStore);
    ProductsActions.shuffle();
    ProductsStore.shuffle();
  },

  // search with tags
  onSearch(){
    debug("onSearch");

    ProductsActions.search(_textSearch, _sortBy, _tags);
  },

  // reset everything
  onResetSideBar(){
    debug("onResetSideBar");
    resetTagsToFalse(_tags);
    _sortBy = "random";
    _textSearch = "";
    $('.tags-group label').removeClass('active');
    this.trigger(this.getSideBarState());
  }
});


module.exports = SideBarStore;
