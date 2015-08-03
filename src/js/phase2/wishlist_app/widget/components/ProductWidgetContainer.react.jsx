var React = require("react"),
    Reflux = require("Reflux"),
    ProductWidget = require("./ProductWidget.react.jsx"),
    WidgetStore = require("../stores/WidgetStore");
    

var ProductWidgetContainer = React.createClass({
    mixins: [Reflux.connect(WidgetStore, 'showWidget')],
    getInitialState: function(){
        return {
            showWidget: false
        };
    },
    render(){
        return (
            <div>
                {this.state.showWidget ? <ProductWidget/> : null}
            </div>
        );

    }
});

module.exports = ProductWidgetContainer;
