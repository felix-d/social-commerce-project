var React = require('react');
var Reviewer = require("./Reviewer.react.jsx");
var slickOptions = require("../utils/Config").slickOptions;

var ReviewersCarousel = React.createClass({
    componentDidMount(){
        if(this.props.productData.numReviewers > 3){
            // we slick for the reviewers
            $(".reviewers-inner").slick(slickOptions);
        }
    },
    componentWillUnmount(){
        if(this.props.productData.numReviewers > 3){
            // we slick for the reviewers
            $(".reviewers-inner").slick("unslick");
        }
    },
    render(){
        var reviewers;
        switch(this.props.currentPage){
            case 0:
                if(this.props.productData.all_reviewers){
                    reviewers = this.props.productData.all_reviewers.map(function(e, i){
                        return (<Reviewer key={i} user={e} productData={this.props.productData}/>);
                    }.bind(this));
                }
                break;

            case 1:
                if(this.props.productData.f_reviewers){
                    reviewers = this.state.productData.f_reviewers.map(function(e, i){
                        return (<Reviewer key={i} user={e} productData={this.props.productData}/>);
                    }.bind(this));
                }
                break;

            case 2:
                if(this.props.productData.fof_reviewers){
                    reviewers = this.state.productData.fof_reviewers.map(function(e, i){
                        return (<Reviewer key={i} user={e} productData={this.props.productData}/>);
                    }.bind(this));
                }
                break;
            default:
                break;
        }

        reviewers = reviewers ? reviewers : <span>No user reviewed this product</span>;
        reviewers = <div className="reviewers-inner">{reviewers}</div>;

        return reviewers;
    }
});

module.exports = ReviewersCarousel;
