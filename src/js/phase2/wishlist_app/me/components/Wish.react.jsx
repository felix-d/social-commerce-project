"use strict";

let React = require("react"),
    WishlistActions = require("../actions/WishlistActions"),
    { OverlayTrigger, Popover } = require("react-bootstrap");

let maxLength = 14;

let Wish = React.createClass({

  _cropped: false,
  _fullname: null,
  _name: null,

  _remove(){
    WishlistActions.remove(this.props.product);
  },

  _crop(props){
    if(props.product.name.length > maxLength) {
      this._cropped = true;
      this._fullname = props.product.name;
      this._name = props.product.name.substring(0, maxLength - 3) + "...";
    } else {
      this._name = props.product.name;
    }
  },

  componentWillMount(){
    this._crop(this.props);
  },

  componentWillUpdate(nextProps){
    this._crop(nextProps);
  },
  
  render(){

    let name = <h5>{this._name}</h5>;

    if(this._cropped) {
      name = (
        <div>
        <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={<Popover>{this._fullname}</Popover>}>
           {name}
        </OverlayTrigger>
        </div>
      );
    }
    
    return (
      <div className="wishlist-container__wish">
            {name}
            <div className="sm-img-container">
               <img src={this.props.product.sm_image_path} alt=""/>
            </div>
            <button className="btn btn-default" onClick={this._remove}>
               Remove
            </button>
      </div>
    );
  }
});

module.exports = Wish;
