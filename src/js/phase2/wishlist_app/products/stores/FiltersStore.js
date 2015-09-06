var Reflux = require("reflux"),
    FiltersActions = require("../actions/FiltersActions"),
    ProductsActions = require("../actions/ProductsActions"),
    { ALL, FRIENDS, FOF } = require("../constants/ProductsConstants"),
    debug = require("debug")(__filename),
    _ = require("lodash");

var _tags,
    _textSearch = "",
    _sortBy = "Random",
    _tab = ALL;

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

var FiltersStore = Reflux.createStore({

  listenables: [FiltersActions],

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

  getFiltersState(){
    return {
      activeTab: _tab,
      tags: _tags,
      sortBy: _sortBy,
      textSearch: _textSearch
    };
  },

  getActiveTab(){
    return _tab;
  },

  getCurrentTab() {
    return _tab;
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
    
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab);
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
  },

  // when the user changes the sort method
  onSortBy(sortBy){
    debug("onSortBy");
    _sortBy = sortBy;
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab);
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
  },

  // shuffle the products
  onShuffle(){
    debug("onShuffle");
    _sortBy = "Random";
    ProductsActions.shuffle();
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
    this.trigger(this.getFiltersState());
  },

  // search with tags
  onSearch(){
    debug("onSearch");
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab);
    ProductsActions.resetCache();
    ProductsActions.setCache(_tab);
  },

  // When the user changes the current tab
  onChangeTab(tab) {
    debug("onChangePage", tab);

    // We create the products subset
    switch(tab){

      // All the products
    case ALL:
      _tab = ALL;
      break;

      // Products reviewed by friends
    case FRIENDS:
      _tab = FRIENDS;
      break;

      // Products reviewed by friends of friends
    case FOF:
      _tab = FOF;
      break;

    default:
    }
    ProductsActions.search(_textSearch, _sortBy, _tags, _tab, true);
    ProductsActions.setCache(_tab);
    this.trigger(this.getFiltersState());
  },
    

  // reset everything
  onResetSideBar(){
    debug("onResetSideBar");
    resetTagsToFalse(_tags);
    _sortBy = "random";
    _textSearch = "";
    // $('.tags-group label').removeClass('active');
    this.trigger(this.getFiltersState());
  }
});


module.exports = FiltersStore;
