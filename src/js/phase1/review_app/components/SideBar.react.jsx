var React = require('react');
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');

function getSideBarState(){
    return ProductStore.getTags();
}

// are we typing in search field
var typingInSearchField = false,

    // We are waiting some time before searching
    typingTimeout,

    // to compare if new search is the same as old search.
    // If it is, we dont refresh!
    oldSearchValue;
    
/* The side bar element with the search form */
var SideBar = React.createClass({

    //shuffle the products
    shuffleProducts: function(){
        // We set the sort selection to "Random" when shuffle is pressed
        this.refs.selectSort.getDOMNode().value = "Random";
        ProductActions.shuffleProducts();
    },

    getInitialState: function(){
        return getSideBarState();
    },

    _onChange: function(){
        this.setState(getSideBarState());
    },

    // When we type in search field
    textSearch: function(){

        // We only execute a search query when the user stops
        // typing for more than 0.2 seconds!
        if(typingInSearchField){
            clearTimeout(typingTimeout);
        } 
        typingInSearchField = true;
        typingTimeout = setTimeout(function(){
            typingInSearchField = false;
            var newSearchValue = this.refs.searchInput.getDOMNode().value;
            if(oldSearchValue != newSearchValue){
                this.doSearch();
                oldSearchValue = this.refs.searchInput.getDOMNode().value;
            }
        }.bind(this), 200);
    },

    componentDidMount: function(){
        ProductStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(){
        ProductStore.removeChangeListener(this._onChange);
    },

    shouldComponentUpdate: function(){
        //we dont need to ever update it
        return false;  
    },

    // We search! The tags are accessible from the store
    doSearch: function(){
        ProductActions.doSearch(
            this.refs.searchInput.getDOMNode().value,
            this.refs.selectSort.getDOMNode().value
        );
    },

    render: function(){

        // the tags toggles
        var tags_checkbox = this.state.tags.map(function(t, i){

            // Handler for clicking on tag toggles
            var toggleTag = function(){
                t.isChecked = !t.isChecked;
                this.doSearch();
            }.bind(this);

            return(
                <label className="btn btn-default" onClick={toggleTag} key={i}>
                    <input type="checkbox" autoComplete="off"/>
                    {t.name}
                </label>
            );
        }.bind(this));

        return(
            <div className="side-bar col-xs-3 will-fade">
                <h4><i className="fa fa-search"></i> Search</h4>
                <input id="input-search" ref="searchInput" type="text" onChange={this.textSearch}/>
                <h4><i className="fa fa-sort"></i> Sort by</h4>
                <select className="form-control" ref="selectSort" onChange={this.doSearch}>
                    <option>Random</option>
                    <option>Title</option>
                    <option>Release Year</option>
                </select>
                <h4><i className="fa fa-tags"></i> Tags</h4>
                <div className="tags-group" data-toggle="buttons" ref="selectedTags">
                {tags_checkbox}
                </div>
                <button className="btn btn-primary" id="shuffle-button" onClick={this.shuffleProducts}>Shuffle</button>
            </div>
        );
    }
});

module.exports = SideBar;
