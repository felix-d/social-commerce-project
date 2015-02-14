var ReactTransitionGroup = React.addons.CSSTransitionGroup;

var HelloWorld = React.createClass({displayName: "HelloWorld",
    getInitialState: function() {
            return { mounted: false  };
              
    },
    componentDidMount: function() {
            this.setState({ mounted: true  });
              
    },
    render: function() {
            var child = this.state.mounted ?
                      React.createElement("h1", null, "Hello world") :
                            null;

            return (
                      React.createElement(ReactTransitionGroup, {transitionName: "example"}, 
                              child
                                    )
                                        
            );
              
    }

});

React.render(React.createElement(HelloWorld, null), document.getElementById("content"));
