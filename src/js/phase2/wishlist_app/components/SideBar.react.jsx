var React = require("react");
var SideBarStore = require("../stores/SideBarStore");
var SideBarActions = require("../actions/SideBarActions");
var ProductsActions = require("../actions/ProductsActions");

var SideBar = React.createClass({

    // sorting - select sort by
    sort: function(){
        
    },

    // text search
    textSearch: function(e){
        SideBarActions.textSearch(e.target.value);
        ProductsActions.doSearch();
    },

    // do search
    doSearch: function(){
        ProductsActions.doSearch()
    },

    // shuffle products
    shuffle: function(){
        
    },

    getInitialState: function(){
        return SideBarStore.getTags();
    },

    render: function(){

        // the tag cloud
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

        return (
            <div id="sidebar">

                {/* Search box */}
                <h4><i className="fa fa-search"></i> Search</h4>
                <input id="input-search" ref="searchInput" type="text" onChange={this.textSearch}/>

                {/* Sorting */}
                <h4><i className="fa fa-sort"></i> Sort by</h4>
                <select className="form-control"
                        ref="selectSort"
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
