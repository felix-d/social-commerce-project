var React = require("react"),
    ImageLoader = require('react-imageloader'),
    WidgetActions = require("../../widget/actions/WidgetActions"),
    WishlistStore = require("../../me/stores/WishlistStore"),
    WishlistActions = require("../../me/actions/WishlistActions"),
    classnames = require("classnames"),
    Reflux = require("reflux"),
    popoverOptions = require("../../utils/Config").popoverOptions;


// The crop length for the product name
var cropLength = 11;

var Product = React.createClass({

  mixins: [Reflux.connect(WishlistStore)],
  
  // are we cropping?
  _cropName: false,

  // called on onload
  _showImage: function(){
    $(this.refs.img.getDOMNode()).fadeIn(200);
  },

  _showProductWidget: function(){
    WidgetActions.doShowWidget(this.props.data);
  },

  componentWillUpdate: function(){
    // If the name was cropped, deactivate popover
    if(this._cropName){
      $(this.refs.name.getDOMNode())
        .popover('destroy');
    }
  },

  componentDidUpdate: function(prevprops, prevstate){

    // we dont hide the picture if we only update the checkmark sign
    if(prevprops.data.id !== this.props.data.id){
      $(this.refs.img.getDOMNode()).hide();
    }
    
    // If the name is cropped, activate popover
    if(this._cropName){
      $(this.refs.name.getDOMNode())
        .popover(popoverOptions);
    }
  },

  componentDidMount: function(){

    // We hide the image, because it'll show onload
    $(this.refs.img.getDOMNode()).hide();

    // We load the popover
    if(this._cropName){
      $(this.refs.name.getDOMNode())
        .popover(popoverOptions);
    }
  },

  componentWillUnmount: function(){
    // If the name was cropped, deactivate popover
    if(this._cropName)
      $(this.refs.name.getDOMNode()).popover('destroy');
    
  },

  shouldComponentUpdate: function(nextProps, nextState){
    // we update if the id is not the same for the component
    // and if we're not on the same page (all, f, fof)
    // or if the product just got add or removed from whishlist
    if(nextProps.data.id !== this.props.data.id ||
       nextProps.currentPage !== this.props.currentPage ||
       WishlistStore.getIdLastSetProduct() === this.props.data.id) {

      WishlistActions.resetIdLastSetProduct();

      return true;
    }
    return false;
  },

  render: function(){

    var numReviewers,
        opacityControl,
        textClassName,
        imgContainerClassName,
        starIcon;


    // Name cropping
    var name;
    if(this.props.data.name.length > cropLength){
      this._cropName = true; 
      name = this.props.data.name.substring(0, cropLength) + "...";
    } else {
      this._cropName = false;
      name = this.props.data.name;
    };

    // Control of the opacity changes
    textClassName = classnames({
      "low-opacity": !!this.props.data.iswish
    });
    
    imgContainerClassName = classnames("sm-img-container", {
      "low-opacity": !!this.props.data.iswish
    });

    starIcon = this.props.data.iswish ? <i className="fa fa-star"></i> : null;

    // The little message under the picture
    switch(this.props.data.numReviewers){
    case 0:
      numReviewersTag = "Nobody reviewed this product";
      break;
    case 1:
      numReviewersTag = `${this.props.data.numReviewers} user reviewed this product`;
      break;
    default:
      numReviewersTag = `${this.props.data.numReviewers} users reviewed this product`;
    };

    return (
        <div className="product effect6 animated fadeIn">

        {/* The product name */}
        <h5 ref="name"
      data-toggle="popover"
      data-content={this.props.data.name}
      className={textClassName}>
        {name}
      </h5>

        {/* The product image */}
        <div className="star-container">
            {starIcon}
            <div className={imgContainerClassName}>
                <img ref="img"
            src={this.props.data.sm_image_path}
            onLoad={this._showImage}/>
            </div>
        </div>

        {/* The product date */}
        <p className={textClassName}>{this.props.data.caracteristic_1}</p>

        {/* How many people reviewed this product */}
        <p className={textClassName}>{numReviewersTag}</p>

        {/* Open the box */}
        <button className="btn btn-info" onClick={this._showProductWidget}>More</button>
        </div>
    );
  }
})

module.exports = Product;
