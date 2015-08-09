var React = require("react"),
    Reflux = require("Reflux"),
    FiltersStore = require("../stores/FiltersStore"),
    FiltersActions = require("../actions/FiltersActions"),
    classNames = require("classnames"),
    ProductsActions = require("../actions/ProductsActions");

var SideBar = React.createClass({

    mixins: [Reflux.connect(FiltersStore)],

    componentWillMount(){
        FiltersActions.shuffle();
    },
    getInitialState() {
        return FiltersStore.getFiltersState();
    },

    // sorting - select sort by
    _sort(e) {
        this.setState({sortBy: e.target.value});
        FiltersActions.sortBy(e.target.value);
    },

    // text search
    _textSearch(e) {
        this.setState({textSearch: e.target.value});
        FiltersActions.textSearch(e.target.value);
    },

    // shuffle products
    _shuffle() {
        FiltersActions.shuffle();
    },

    componentDidUpdate: function(){
    },


    render: function(){

        // the tag cloud
        var tags_checkbox = this.state.tags.map(function(t, i){

            // Handler for clicking on tag toggles
            var toggleTag = function(){
                t.isChecked = !t.isChecked;
                FiltersActions.search();
            }.bind(this);

            var classes = classNames("btn", "btn-default", {
                active: t.isChecked
            });

            return(
                <label className={classes} onClick={toggleTag} key={i}>
                    <input type="checkbox"/>
                    {t.name}
                </label>
            );
        }.bind(this));
        return (
            <div id="sidebar">

                {/* Search box */}
                <h4><i className="fa fa-search"></i> Search</h4>
                <input id="input-search" ref="searchInput" type="text" value={this.state.textSearch} onChange={this._textSearch}/>

                {/* Sorting */}
                <h4><i className="fa fa-sort"></i> Sort by</h4>
                <select className="form-control"
                        ref="selectSort"
                        value={this.state.sortBy}
                        onChange={this._sort}>
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
                        onClick={this._shuffle}>
                    Shuffle
                </button>
            </div>
        );
    }
})

    module.exports = SideBar;
