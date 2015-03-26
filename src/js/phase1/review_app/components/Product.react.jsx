var React = require('react');
var ProductActions = require('../actions/ProductActions');
var ProductContainer = require('./ProductsContainer.react.jsx');
var ProductStore = require('../stores/ProductStore');
var ImageLoader = require('react-imageloader');

var Product = React.createClass({

    // Options for the popover
    popoverOptions: {
        trigger: 'hover',
        placement: 'auto',
        container: 'body'
    },

    // Do we need to crop the name
    cropName: false,

    // De maximum length before cropping
    cropLength: 13,

    componentDidMount: function(){
        // If the name is cropped, activate popover
        if(this.cropName){
            $(this.refs.name.getDOMNode())
                  .popover(this.popoverOptions);
        }
    },

    componentDidUpdate: function(){
        $(this.refs.img.getDOMNode()).hide();
        /* $(this.getDOMNode()).fadeIn(300); */
        // If the name is cropped, activate popover
        if(this.cropName)
            $(this.refs.name.getDOMNode())
               .popover(this.popoverOptions);
    },

    componentWillUpdate: function(){
        /* $(this.getDOMNode()).hide(); */
        // If the name was cropped, deactivate popover
        if(this.cropName)
            $(this.refs.name.getDOMNode())
               .popover('destroy');
    },

    componentWillUnmount: function(){
        // If the name was cropped, deactivate popover
        if(this.cropName)
            $(this.refs.name.getDOMNode()).popover('destroy');
    },

    shouldComponentUpdate: function(nextProps, nextState){
        // if the product is the same as the one that just got reviewed
        // OR if the product wasn't already there -> we update it
        if(nextProps.data.id === ProductStore.getLastReviewedId() ||
           nextProps.data.id != this.props.data.id){
            ProductStore.resetReviewedId();
               return true;
        }
        // no need to update the element!
        return false;
    },

    // Review the product
    openReviewBox: function(){
        ProductActions.review(this.props.data);
    },

    showImage: function(){
        console.log("onLoad");
        $(this.refs.img.getDOMNode()).fadeIn(200);
    },

    // Edit the review
    editReview: function(){
        ProductActions.review(this.props.data);
    },
    render: function(){

        // the name of the movie
        var name,
            // the class set on reviewed products
            imgReviewedClass,
            // We reduce the opacity of reviewed products
            opacityControl,
            // the check mark on reviewed products
            checkMark,
            // the review button
            button;

        // Do we crop the length?
        if(this.props.data.name.length>this.cropLength){
            this.cropName = true;
            name = this.props.data.name.substring(0,this.cropLength)+"...";
        }
        else {
            this.cropName = false;
            name = this.props.data.name;
        }

        // Check if the product was reviewed
        if(this.props.data.review){
            imgReviewedClass="reviewed";
            opacityControl = "low-opacity"
            checkMark = <i className="fa fa-check-circle"></i>;
            button = <button className="btn btn-success btn-sm" onClick={this.editReview}>Edit</button>;
        }
        else {
            checkMark= "";
            imgReviewedClass="";
            opacityControl = ""
            button = <button className="btn btn-info btn-sm" onClick={this.openReviewBox}>I've seen it!</button>;
        }

        return(
            <div className="product col-xs-15 animated fadeIn">
                <div className="product-inner effect6">
                    <h5 className={opacityControl} ref="name" data-toggle="popover" data-content={this.props.data.name}>{name}</h5>
                    <div className="checkmark-container">
                        {checkMark}
                        <div className={opacityControl + " img-container"}>
                            <ImageLoader ref="img" src={this.props.data.sm_image_path} onLoad={this.showImage}></ImageLoader>
                        </div>
                    </div>
                    <p className={opacityControl}>{this.props.data.caracteristic_1}</p>
                    {button}
                </div>
            </div>
        );
    }
});

module.exports = Product;
