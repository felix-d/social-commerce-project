import React from 'react';


/* A tab with toggles */
export default React.createClass({

  propTypes: {
    active: React.PropTypes.bool,
    data: React.PropTypes.array,
    id: React.PropTypes.string,
  },

  render() {

    // needed classes for the tabs
    let className = 'tab-pane fade';
    if (this.props.active) {
      className += ' in active';
    }

    // For each category
    var categories = this.props.data.map((d, i) => {

      // For each element in the category
      var elements = d.elements.map(e => {

        // When the button is toggled
        function toggle() {
          e.isChecked = !e.isChecked;
        }

        // The element classes
        var classes = 'btn btn-default';

        // If the element is checked
        if (e.isChecked) classes += ' active';

        return (
          <label className={classes} key={e.id} onClick={toggle}>
            <input type="checkbox" autoComplete="off"/>
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

    return (
      <div className={className} id={this.props.id}>
        {categories}
      </div>
    );
  },
});
