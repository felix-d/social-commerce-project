const React = require("react"),
      Reflux = require("reflux"),
      { Row, Col } = require("react-bootstrap"),
      getPic = require("../../utils/Utils.jsx").getPic,
      UsersStore = require("../stores/UsersStore"),
      FriendsList = require("../../me/components/FriendsList.react.jsx"),
      UsersActions = require("../actions/UsersActions"),
      ProductsList = require("../../me/components/ProductsList.react.jsx"),
      capitalize = require("lodash").capitalize;

const UserPage = React.createClass({

  mixins: [Reflux.connect(UsersStore)],

  _userInfoLoaded: false,

  _mayGetUserPage(checkProps) {
    if(this.props.params.userId != checkProps.params.userId) {
      UsersActions.getUserPage(this.props.params.userId);
    }
  },

  componentDidMount(){
    UsersActions.getUserPage(this.props.params.userId);
  },

  
  componentDidUpdate(prevProps) {
    this._mayGetUserPage(prevProps);
  },

  componentWillUpdate(nextProps, nextState) {
    this._userInfoLoaded = nextState === this.state ? false : true;
    this._mayGetUserPage(nextProps);
  },

  render(){

    if(!this._userInfoLoaded) { return null; }

    let username = null,
        pic = null,
        friends = null,
        products;

    if(this.state && this.state.user){
      username = capitalize(this.state.user.username) || null;
      pic = getPic(this.state.user.pic) || null;
    }

    if(this.state && this.state.friends){
      friends = <FriendsList friends={this.state.friends}/>;
    }

    if(this.state && this.state.products){
      products = <ProductsList products={this.state.products} review={true}/>
    }


    return (
      <div className="user-page">
         <Row>
            {/* Profile picture */}
            <Col xs={3}>
                <div className="profile-pic-container">
                    {pic}
                </div>
                <div><h3>{username}</h3></div>
            </Col>
         </Row>
         <Row>
            {/* Friends */}
            <Col xs={12}>
            <h3>
               {username && `${username}'s friends.`}
            </h3>
            {friends}
            </Col>
         </Row>
         <Row>
            {/* Shit you've reviewed */}
            <Col xs={12}>
            <h3>
               {username && `Products ${username} has reviewed.`}
            </h3>
            {products}
            </Col>
         </Row>
      </div>
    );
  }
})

  module.exports = UserPage;
