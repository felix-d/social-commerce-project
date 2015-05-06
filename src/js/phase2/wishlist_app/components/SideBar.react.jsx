var React = require("react");
var Reflux = require("Reflux");
var SideBarStore = require("../stores/SideBarStore");
var SideBarActions = require("../actions/SideBarActions");
var ProductsActions = require("../actions/ProductsActions");

var SideBar = React.createClass({

    mixins: [Reflux.connect(SideBarStore)],

    getInitialState: function(){
        return SideBarStore.getSideBarState();
    },

    // sorting - select sort by
    sort: function(e){
        this.setState({sortBy: e.target.value});
        SideBarActions.doSortBy(e.target.value);
    },

    // text search
    textSearch: function(e){
        this.setState({textSearch: e.target.value});
        SideBarActions.doTextSearch(e.target.value);
    },

    // shuffle products
    shuffle: function(){
        SideBarActions.doShuffle();
    },

    componentDidUpdate: function(){
    },


    render: function(){

        // the tag cloud
        var tags_checkbox = this.state.tags.map(function(t, i){

            // Handler for clicking on tag toggles
            var toggleTag = function(){
                t.isChecked = !t.isChecked;
                SideBarActions.doSearch();
            }.bind(this);

            return(
                <label className="btn btn-default" onClick={toggleTag} key={i}>
                    <input type="checkbox" autoComplete="off"/>
                    {t.name}
                </label>
            );
        }.bind(this));

        return (
            <div id="sidebar">

                {/* Search box */}
                <h4><i className="fa fa-search"></i> Search</h4>
                <input id="input-search" ref="searchInput" type="text" value={this.state.textSearch} onChange={this.textSearch}/>

                {/* Sorting */}
                <h4><i className="fa fa-sort"></i> Sort by</h4>
                <select className="form-control"
                        ref="selectSort"
                        value={this.state.sortBy}
                        onChange={this.sort}>
                    <option>Random</option>
                    <option>Title</option>
                    <option>Release Year</option>
                </select>

                {/* Tag cloud */}
                <h4><i className="fa fa-tags"></i> Tags</h4>
                <div className="tags-group"
                     data-toggle="buttons"
                     ref="selectedTags">
                    {tags_checkbox}
                </div>

                {/* Shuffle button */}
                <button className="btn btn-primary"
                        id="shuffle-button"
                        onClick={this.shuffle}>
                    Shuffle
                </button>
            </div>
        );
    }
})

    module.exports = SideBar;
