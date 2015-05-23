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
    slidesToShow: 6,
    arrows: true,
    prevArrow: '<button type="button" class="btn btn-default slick-prev"><i class="fa fa-2x fa-caret-left"></i></button>',
          nextArrow: '<button type="button" class="btn btn-default slick-next"><i class="fa fa-2x fa-caret-right"></i></button>',
          slidesToScroll: 6,
          responsive: [
              {
                  breakpoint: 900,
                  settings: {
                      slidesToShow: 5,
                      slidesToScroll: 5,
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

        // we slick for the reviewers
        $(".reviewers-inner").slick(slickOptions);
    },

    componentWillUnmount: function(nextProps, nextState){
        //we remove the popover if the description is cropped
        if(this.state.productData.doCropDescription){
            $(this.refs.description.getDOMNode())
                  .popover('destroy');
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

        // TEMPORARY
        var reviewers = (
            <div className="reviewers-inner">
                <div><i className="fa fa-user fa-3x"></i><span className="username">Reviewer1</span></div>
                <div><i className="fa fa-user fa-3x"></i><span className="username">Reviewer2</span></div>
                <div><i className="fa fa-user fa-3x"></i><span className="username">Reviewer3</span></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
                <div><i className="fa fa-user fa-3x"></i></div>
            </div>
        );
        // if there are reviewers
        /* if(this.state.productData.all_reviewers){
           reviewers = this.state.productData.all_reviewers.map(function(e, i){
           return (
           <i className="fa fa-user fa-3x"></i>
           )
           });
           } */

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
                        <Review data={this.state.reviewElements}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 reviewers">
                        <h4>Reviewers</h4>
                        {reviewers}
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
