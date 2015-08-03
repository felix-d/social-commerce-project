var WidgetActions = require("../actions/WidgetActions");
var ProductsStore = require("../../products/stores/ProductsStore");
var Reflux = require("reflux"),
    debug = require("debug")(__filename);

var _showWidget = {showWidget: false},
    _productData = undefined,
    // the maximum length for the description
    _cropLength = 150,
    // the review elements that make up the review tree
    _reviewElements;

var WidgetStore = Reflux.createStore({

  listenables: [WidgetActions],

  init: function(){
    
  },

  setup: function(reviewElements){
    _reviewElements = reviewElements;
  },

  // for the widget component
  getWidgetState: function(){

    var currentPage = ProductsStore.getCurrentPage();
    var numReviewers;
    switch(currentPage){
    case 0:
      numReviewers = _productData.all_reviewers ? _productData.all_reviewers.length : 0;
      break;
    case 1:
      numReviewers = _productData.f_reviewers ? _productData.f_reviewers.length : 0;
      break;
    case 2:
      numReviewers = _productData.fof_reviewers ? _productData.fof_reviewers.length : 0;
      break;
    default:
    }

    return {
      productData: _productData,
      reviewElements: _reviewElements,
      currentPage: ProductsStore.getCurrentPage(),
      numReviewers: numReviewers
    };
  },

  onDoShowWidget: function(productData){

    debug("Showing widget with data", productData);

    // we set the product data
    _productData = productData;

    // Do we crop?
    if(_productData.description.length > _cropLength){
      _productData.doCropDescription= true;
      _productData.cropDescription =
        _productData.description.substring(0, _cropLength) +
        "...";
    } else {
      _productData.doCropDescription = false;
    }

    // we show the widget
    this.trigger(true);
  },


  onDoHideWidget: function(){
    this.trigger(false);
  }
  });

module.exports = WidgetStore;
