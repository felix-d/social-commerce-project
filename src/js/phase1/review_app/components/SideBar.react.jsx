var React = require('react/addons');
var ProductStore = require('../stores/ProductStore');
var ProductActions = require('../actions/ProductActions');

function getSideBarState(){
    return ProductStore.getTags();
}
var SideBar = React.createClass({

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

    // Are we typing in search field?
    typingInSearchField: false,

    // We are waiting some time before searching
    typingTimeout: undefined,

    // to compare if new search is the same as old search. If it is, we dont refresh!
    oldSearchValue: undefined,

    // When we type in search field
    textSearch: function(){

        // We only execute a search query when the user stops typing for more
        // than 0.2 seconds!
        if(this.typingInSearchField){
            clearTimeout(this.typingTimeout);
        } 
        this.typingInSearchField = true;
        this.typingTimeout = setTimeout(function(){
            this.typingInSearchField = false;
            var newSearchValue = this.refs.searchInput.getDOMNode().value;
            if(this.oldSearchValue != newSearchValue){
                this.doSearch();
                this.oldSearchValue = this.refs.searchInput.getDOMNode().value;
                
            }
        }.bind(this), 200);
    },

    componentDidMount: function(){
        //We set the old search field value at mounting
        ProductStore.addChangeListener(this._onChange);
        this.oldSearchValue = this.refs.searchInput.getDOMNode().value;
    },
    componentWillUnmount: function(){
        ProductStore.removeChangeListener(this._onChange);
    },
    shouldComponentUpdate: function(){
        //we dont need to ever update it
        return false;  
    },
    doSearch: function(){
        ProductActions.doSearch(
            this.refs.searchInput.getDOMNode().value,
            this.state.tags,
            this.refs.selectSort.getDOMNode().value
      )  
    },
    render: function(){
        var tags_checkbox = this.state.tags.map(function(t, i){

            // Handler for clicking on tag toggles
            var toggleTag = function(){
                t.isChecked = !t.isChecked;
                this.doSearch();
            }.bind(this);

            return(
                <label className="btn btn-default" onClick={toggleTag} key={i}>
                    <input type="checkbox" autocomplete="off"/>
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
