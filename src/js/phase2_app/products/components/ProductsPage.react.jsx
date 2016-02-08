import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SideBar from './SideBar.react.jsx';
import TopMenu from './TopMenu.react.jsx';
import ProductsContainer from './ProductsContainer.react.jsx';
import ProductWidget from '../../widget/components/ProductWidget.react.jsx';
import ProductsActions from '../actions/ProductsActions';
import track from '../../tracking';


export default React.createClass({

  componentDidMount() {
    track('ITEMS_PAGE_VISITED');
    ProductsActions.resetIndex();
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
  },

  componentWillUnmount() {
    $('#return-to-top').off('click');
    $(window).off('scroll');
  },

  render() {
    return (
      <div id="product-page">
        <a id="return-to-top" className="animated fadeOut">
          <i className="fa fa-chevron-up"></i>
        </a>
        <ProductWidget/>
        <Row>
          <Col xs={3}>
            <SideBar/>
          </Col>
          <Col xs={9}>
            <Row>
              <div className="col-xs-12">
                <TopMenu />
              </div>
            </Row>
            <Row>
              <Col xs={12} id="outer-products-container">
                <ProductsContainer/>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  },
});
