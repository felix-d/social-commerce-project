const React = require("react");

exports.getPic = function(url, alt=""){
  let urlx = url === "" ? "../static/images/user.jpg" : url;
  return <img src={urlx} alt={alt}/>
};
