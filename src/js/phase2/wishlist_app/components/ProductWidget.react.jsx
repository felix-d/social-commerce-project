var React = require("react");
var Reflux = require("reflux");
var WidgetStore = require("../stores/WidgetStore");
var WidgetActions = require("../actions/WidgetActions");
var Review = require("./Review.react.jsx");

var popoverOptions = {
    trigger: 'hover',
    placement: 'left',
    container: '#product-widget',
    delay: {
        show: 400,
        hide: 100
    }
};

var slickOptions = {
    dots: false,
    speed: 600,
    infinite: false,
    slidesToShow: 3,
    arrows: true,
    prevArrow: '<button type="button" class="btn btn-default slick-prev"><i class="fa fa-caret-left"></i></button>',
          nextArrow: '<button type="button" class="btn btn-default slick-next"><i class="fa fa-caret-right"></i></button>',
          slidesToScroll: 3,
          responsive: [
              {
                  breakpoint: 900,
                  settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      infinite: true,
                      dots: false
                  }
              }
          ]
};

var ProductWidget = React.createClass({

    mixins: [Reflux.connect(WidgetStore)],

    closeProductWidget: function(){
        WidgetActions.doHideWidget()
    },

    getInitialState: function(){
        return WidgetStore.getWidgetState();
    },

    componentDidMount: function(){

        //we add the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover(popoverOptions);
        }

        if(this.state.productData.numReviewers > 3){
        // we slick for the reviewers
            $(".reviewers-inner").slick(slickOptions);
        }
    },

    componentWillUnmount: function(nextProps, nextState){
        //we remove the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover('destroy');
        }

        if(this.state.productData.numReviewers > 3){
        // we slick for the reviewers
            $(".reviewers-inner").slick("unslick");
        }
    },

    render: function(){

        var description = '';

        // Do we crop the description
        if(this.state.productData.doCropDescription){
            description = this.state.productData.cropDescription;
        } 
        else{
            description = this.state.productData.description;
        } 

        // We set the class
        var reviewerClass = this.state.productData.numReviewers > 3 ?
                            "reviewer slicked" :
                            "reviewer not-slicked";
        
        var getReviewerHTML = function(username){
            return (
                <div className={reviewerClass}>
                    <i className="fa fa-user fa-2x"></i>
                    <span className="username">{username}</span>
                </div>
            );
        };

        var reviewers;
        switch(this.state.currentPage){
            case 0:
                if(this.state.productData.all_reviewers){
                    reviewers = this.state.productData.all_reviewers.map(function(e, i){
                        return getReviewerHTML(e.username);
                    });
                }
                break;

            case 1:
                if(this.state.productdata.f_reviewers){
                    reviewers = this.state.productData.f_reviewers.map(function(e, i){
                        return getReviewerHTML(e.username);
                    });
                }
                break;

            case 2:
                if(this.state.productData.fof_reviewers){
                    reviewers = this.state.productData.fof_reviewers.map(function(e, i){
                        return getReviewerHTML(e.username);
                    });
                }
                break;
            default:
                break;
        }

        reviewers = reviewers ? reviewers : <span>No user reviewed this product</span>;
        reviewers = <div className="reviewers-inner">{reviewers}</div>;

        return (
            <div id="product-widget" className="animated bounceInDown" ref="product-widget">
                <div className="row">
                    <div className="col-xs-12 text-right" style={{paddingRight: '0px', right: '-4px'}}>
                        <button className="btn btn-default" onClick={this.closeProductWidget}><i className="fa fa-times"></i></button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <h2 className="product-name">{this.state.productData.name}</h2>
                    </div>
                </div>
                <div className="row inner">

                    <div className="col-xs-3">
                        <img src={this.state.productData.image_path} alt={this.state.productData.name} className="product-image"/>
                    </div>

                    <div className="col-xs-3">
                        <h4>Release date</h4>
                        <p>{this.state.productData.caracteristic_1}</p>
                        <h4>Tags</h4>
                        <p>{this.state.productData.tags.join(", ")}</p>
                        <h4>Overview</h4>
                        <p className="description" ref="description" data-toggle="popover" data-content={this.state.productData.description}>{description}</p>
                    </div>

                    <div className="col-xs-6 review-container">
                        <div className="reviewers">
                            <h4>Reviewers</h4>
                            {reviewers}
                        </div>
                        <Review data={this.state.reviewElements}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <button className="btn btn-add">Add to wishlist</button>
                    </div>
                </div>
            </div>
        );
    }
})

module.exports = ProductWidget;
