var React = require('react');
var ProductStore = require('../stores/ProductStore');
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var ProductActions = require('../actions/ProductActions');
var SideBar = require("./SideBar.react.jsx");
var ReviewBox = require("./ReviewBox.react.jsx");
var ProductsContainer = require("./ProductsContainer.react.jsx");

var ReviewApp = React.createClass({

  _onChange(){
    
  },
  componentWillUnmount() {
    ProductsStore.removeChangeListener(this._onChange);
  },

  componentDidMount() {

    ProductStore.addChangeListener(this._onChange);

    // Lets fetch initial data
    ProductActions.fetchInitialData();

    // we init the stores
    /*     ProductStore.init(this.props.products, this.props.tags, this.props.number_reviews); */
    /*     ReviewBoxStore.init(this.props.reviewElements); */

    // lets shuffle the products
    ProductStore.shuffleProducts();

    // We update the text that displays the remaining reviews to do
    ProductStore.updateReviewText();

    var reviewAppOffset = $(".info-box").offset().top;
    // We show the arrow to scroll back up fast!
    $(window).scroll(function() {
      if ($(this).scrollTop() >= 500) {
        $('#return-to-top').css("display", "block");
        $('#return-to-top').addClass("fadeIn");
        $('#return-to-top').removeClass("fadeOut");
        
      } else {
        $('#return-to-top').addClass("fadeOut");
        $('#return-to-top').removeClass("fadeIn");
      }
    });

    // we bind the scrolling animation
    $('#return-to-top').click(function() {
      $('body,html').animate({
        scrollTop : reviewAppOffset
      }, 500);
    });
  },

  render: function(){
    return(
      <div className="review-app clearfix" id="review-app-inner"> 
         <ReviewBox/>
         <SideBar/>
         <ProductsContainer/>
         <a id="return-to-top" className="animated fadeOut"><i className="fa fa-chevron-up"></i></a>
      </div>
    );
  }
});

module.exports = ReviewApp;
