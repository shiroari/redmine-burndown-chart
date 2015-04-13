var React = require("react");

var Header = React.createClass({
  getInitialState: function() {
    return {name: this.props.name};
  },
  render: function() {
    return (
			<div className="card-header">
				<div className="card-title">
					{this.props.name}
				</div>
        <ul className="card-actions">
        {React.Children.map(this.props.children, function(child) {
            return child;
        })}
        </ul>
			</div>
    );
  }
});

module.exports = Header;