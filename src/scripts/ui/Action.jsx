var React = require("react");

var Action = React.createClass({
  onClick: function (event) {
    this.props.onClick(event);
  },
  render: function () {
    return (
      <li>
        <a href="#" onClick={this.onClick}>
					{React.Children.map(this.props.children, function (child) {
            return child;
					})}
        </a>
      </li>
    );
  }
});

module.exports = Action;
