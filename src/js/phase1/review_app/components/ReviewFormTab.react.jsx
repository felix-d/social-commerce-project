var React = require('react/addons');

var ReviewFormTab = React.createClass({
    render: function(){
        var className = "tab-pane fade";
        if(this.props.active){
            className+= " in active";
        }
        var categories = this.props.data.map(function(d, i){

            var elements = d.elements.map(function(e, j){
                return (
                    <label className="btn btn-default" key={j}>
                        <input type="checkbox" autocomplete="off"/>
                        {e}
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
