var React = require('react/addons');
var ProductActions = require('../actions/ProductActions');

var ReviewFormTab = React.createClass({
    render: function(){

        // needed classes for the tabs
        var className = "tab-pane fade";
        if(this.props.active){
            className+= " in active";
        }

        // For each category, there 
        var that = this;
        var categories = this.props.data.map(function(d, i){

            var elements = d.elements.map(function(e){
                // When the button is toggled
                function aggregate(){
                    e.isChecked = !e.isChecked;
                    // Merge the new data with the old!
                }
                return (
                    <label className="btn btn-default" key={e.id} onClick={aggregate}>
                        <input type="checkbox" autocomplete="off"/>
                        {e.name}
                    </label>
                );
            });

            return (
                <div key={i}>
                    <h4>{d.name}</h4>
                    <div data-toggle="buttons" className="btn-group">
                        {elements}
                    </div>
                </div>
            );
        });

        return(
            <div className={className} id={this.props.id}>
                {categories}
            </div>
        );
    }
});

module.exports = ReviewFormTab;
