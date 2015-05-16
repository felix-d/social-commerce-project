var React = require("react");
var Reflux = require("reflux");
var WidgetStore = require("../stores/WidgetStore");
var WidgetActions = require("../actions/WidgetActions");

var ProductWidget = React.createClass({

    mixins: [Reflux.connect(WidgetStore)],

    closeProductWidget: function(){
        WidgetActions.doHideWidget()
    },

    render: function(){
        return (
            <div id="product-widget" className="animated bounceInDown" ref="product-widget">
                <button className="btn btn-danger" onClick={this.closeProductWidget}>Close</button>
            </div>
        );
    }
})

module.exports = ProductWidget;
