var React = require("react"),
    WishlistActions = require("../actions/WishlistActions");

var Wish = React.createClass({

    _remove(){
        WishlistActions.remove(this.props.product);
    },
    
    render(){
        return (
            <div className="wishlist-container__wish">
                <div>
                    <button className="btn btn-default" onClick={this._remove}>
                        <i className="fa fa-close"/>
                    </button>
                    <h4>{this.props.product.name}</h4>
                    <img src={this.props.product.sm_image_path} alt=""/>
                </div>

            </div>
        );
    }
});

module.exports = Wish;
