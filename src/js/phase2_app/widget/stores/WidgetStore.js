import Reflux from 'reflux';

import WidgetActions from '../actions/WidgetActions';
import APIActions from '../../products/actions/APIActions';
import FiltersStore from '../../products/stores/FiltersStore';

const debug = require('debug')(__filename);

const _cropLength = 150;

let _productData = null;
let _reviewElements = null;
let _showWidget = false;

export default Reflux.createStore({

  listenables: [WidgetActions, APIActions],

  // for the widget component
  getWidgetState() {

    if (_productData === null) {
      return {
        showWidget: _showWidget,
      };
    }

    const currentPage = FiltersStore.getCurrentTab();
    let numReviewers = null;

    switch (currentPage) {
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
      currentPage: FiltersStore.getCurrentTab(),
      showWidget: _showWidget,
      numReviewers,
    };
  },

  onFetchInitialDataCompleted(data) {
    debug('onFetchInitialDataCompleted');
    const { reviewElements } = data;
    _reviewElements = reviewElements;
  },

  onDoShowWidget(productData) {

    debug('Showing widget with data', productData);

    // we set the product data
    _productData = productData;

    _showWidget = true;

    // we show the widget
    this.trigger(this.getWidgetState());
  },


  onDoHideWidget() {
    debug('onDoHideWidget');
    _showWidget = false;
    this.trigger(this.getWidgetState());
  },
});
