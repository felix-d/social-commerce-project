var React = require('react/addons');
var MovieStore = require('../stores/MovieStore');
var MovieActions = require('../actions/MovieActions');

function getSideBarState(){
    return MovieStore.getTags();
}
var SideBar = React.createClass({

    shuffleMovies: function(){
        this.refs.selectSort.getDOMNode().value = "Random";
        MovieActions.shuffleMovies();
    },
    getInitialState: function(){
        return getSideBarState();
    },
    _onChange: function(){
        this.setState(getSideBarState());
    },
    //Are we typing in search field?
    typingInSearchField: false,

    //We are waiting some time before searching
    typingTimeout: undefined,

    //to compare if new search is the same as old search. If it is, we dont refresh!
    oldSearchValue: undefined,

    //When we type in search field
    textSearch: function(){
        if(this.typingInSearchField){
            clearTimeout(this.typingTimeout);
        } 
        this.typingInSearchField = true;
        this.typingTimeout = setTimeout(function(){
            this.typingInSearchField = false;
            var newSearchValue = this.refs.searchInput.getDOMNode().value;
            if(this.oldSearchValue != newSearchValue)
                this.doSearch();
            this.oldSearchValue = this.refs.searchInput.getDOMNode().value;
        }.bind(this), 200);
    },
    componentDidMount: function(){
        //We set the old search field value at mounting
        MovieStore.addChangeListener(this._onChange);
        this.oldSearchValue = this.refs.searchInput.getDOMNode().value;
    },
    componentWillUnmount: function(){
        MovieStore.removeChangeListener(this._onChange);
    },
    doSearch: function(){
        MovieActions.doSearch(
            this.refs.searchInput.getDOMNode().value,
            this.state.tags,
            this.refs.selectSort.getDOMNode().value
      )  
    },
    render: function(){
        var tags_checkbox = this.state.tags.map(function(t, i){
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
            <div className="side-bar col-md-3 will-fade">
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
                <button className="btn btn-primary" id="shuffle-button" onClick={this.shuffleMovies}>Shuffle</button>
            </div>
        );
    }
});

module.exports = SideBar;
