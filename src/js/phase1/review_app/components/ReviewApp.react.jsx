var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var ProductStore = require('../stores/ProductStore');
var ReviewBoxStore = require('../stores/ReviewBoxStore');
var ProductActions = require('../actions/ProductActions');
var SideBar = require("./SideBar.react.jsx");
var ReviewBox = require("./ReviewBox.react.jsx");
var ProductsContainer = require("./ProductsContainer.react.jsx");
var assign = require('object-assign');

var ReviewApp = React.createClass({
    getInitialState: function(){
        ProductStore.init(this.props.products, this.props.tags, this.props.number_reviews);
        ReviewBoxStore.init(this.props.reviewElements);
        ProductStore.shuffleProducts();
        ProductStore.updateReviewText();
        return null;
    },
    componentDidMount: function(){
        // ===== Scroll to Top ==== 
        var canChange = true;
        $(window).scroll(function() {
            if ($(this).scrollTop() >= 500) {        // If page is scrolled more than 50px
                    $('#return-to-top').css("display", "block");
                    $('#return-to-top').addClass("fadeIn");
                    $('#return-to-top').removeClass("fadeOut");
                
            } else {
                    $('#return-to-top').addClass("fadeOut");
                    $('#return-to-top').removeClass("fadeIn");
            }
        });
        $('#return-to-top').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
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
