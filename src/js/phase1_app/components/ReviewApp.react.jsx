import React from 'react';

import PureRenderMixin from 'react-addons-pure-render-mixin';

import ProductStore from '../stores/ProductStore';
import ProductActions from '../actions/ProductActions';
import SideBar from './SideBar.react.jsx';
import ReviewBox from './ReviewBox.react.jsx';
import ProductsContainer from './ProductsContainer.react.jsx';
import InitModal from './InitModal.react.jsx';
import MenuBar from './MenuBar.react.jsx';

export default React.createClass({

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      showProducts: false,
    };
  },

  componentDidMount() {
    ProductStore.addChangeListener(this._onChange);
    // Lets fetch initial data
    ProductActions.fetchInitialData();
  },

  componentDidUpdate(lastProps, lastState) {
    // When we receive the response, we bind the infinite scrolling
    // listener.
    if (this.state.showProducts && !lastState.showProducts) {

      // We show the arrow to scroll back up fast!
      $(window).scroll(function handler() {
        if ($(this).scrollTop() >= 500) {
          $('#return-to-top').css('display', 'block');
          $('#return-to-top').addClass('fadeIn');
          $('#return-to-top').removeClass('fadeOut');
        } else {
          $('#return-to-top').addClass('fadeOut');
          $('#return-to-top').removeClass('fadeIn');
        }
      });

      // we bind the scrolling animation
      $('#return-to-top').click(function handler() {
        $('body,html').animate({scrollTop: 0}, 500);
      });
    }
  },

  componentWillUnmount() {
    ProductStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState({
      showProducts: !!ProductStore.getProducts(),
    });
  },

  render() {
    if (!this.state.showProducts) { return null; }
    return (
      <div>
        <MenuBar/>
      <div className="review-app clearfix" id="review-app-inner">
        <InitModal />
        <ReviewBox/>
        <SideBar/>
        <ProductsContainer/>
        <a id="return-to-top" className="animated fadeOut">
          <i className="fa fa-chevron-up"></i>
        </a>
      </div>
      </div>
    );
  },
});
