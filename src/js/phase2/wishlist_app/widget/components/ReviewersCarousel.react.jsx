var React = require('react'),
    Reviewer = require("./Reviewer.react.jsx"),
    Slider = require("react-slick");

var _$reviewersInner = null;

var ReviewersCarousel = React.createClass({

  render(){
    var reviewers;
    switch(this.props.currentPage){
      case 0:
        if(this.props.productData.all_reviewers){
          reviewers = this.props.productData.all_reviewers.map(function(e, i){
            return (<div><Reviewer key={i} user={e} productData={this.props.productData}/></div>);
          }.bind(this));
        }
        break;

      case 1:
        if(this.props.productData.f_reviewers){
          reviewers = this.props.productData.f_reviewers.map(function(e, i){
            return (<div><Reviewer key={i} user={e} productData={this.props.productData}/></div>);
          }.bind(this));
        }
        break;

      case 2:
        if(this.props.productData.fof_reviewers){
          reviewers = this.props.productData.fof_reviewers.map(function(e, i){
            return (<div><Reviewer key={i} user={e} productData={this.props.productData}/></div>);
          }.bind(this));
        }
        break;
      default:
        break;
    }

    let settings = {
      dots: true,
      infinite: false,
      arrows: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3
    };

    if(reviewers) {
      reviewers = <Slider {...settings}>{reviewers}</Slider>;
    } else {
      reviewers = <span>No user reviewed this product.</span>;
    }

    return (
      <div className="reviewers-inner">
         {reviewers}
      </div>
    )
  }
});

module.exports = ReviewersCarousel;
