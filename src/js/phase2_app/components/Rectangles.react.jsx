import React from 'react';


export default React.createClass({

  propTypes: {
    sizes: React.PropTypes.array,
  },

  render() {
    const sizes = this.props.sizes || [2, 3, 7, 1, 4];
    const rectangles = sizes.map((size, i) => {
      const style = {
        width: `${size * 10}%`,
      };
      return <div key={i} className="rectangle" style={style}/>;
    });

    return (
      <div className="rectangles">
       {rectangles}
      </div>
    );
  },
});
