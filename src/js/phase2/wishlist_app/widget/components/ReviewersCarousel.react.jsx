var React = require('react'),
    Reviewer = require("./Reviewer.react.jsx"),
    slickOptions = require("../../utils/Config").slickOptions;

var _$reviewersInner = null;

var ReviewersCarousel = React.createClass({

    componentDidMount(){
        if(this.props.productData.numReviewers > 3){
            // we slick for the reviewers
            _$reviewersInner = $(".reviewers-inner").slick(slickOptions);
        }
    },

    componentWillUnmount(){
        if(this.props.productData.numReviewers > 3){
            // we slick for the reviewers
            _$reviewersInner.slick("unslick");
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
                    reviewers = this.props.productData.f_reviewers.map(function(e, i){
                        return (<Reviewer key={i} user={e} productData={this.props.productData}/>);
                    }.bind(this));
                }
                break;

            case 2:
                if(this.props.productData.fof_reviewers){
                    reviewers = this.prop.productData.fof_reviewers.map(function(e, i){
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
