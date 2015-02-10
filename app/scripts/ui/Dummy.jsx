/** @jsx React.DOM */

var Dummy = React.createClass({
  getInitialState: function() {
		return {val: 0};
  },	
  handleClick: function(event) {
    this.setState({val: (this.state.val + 1)});
  },	
  render: function() {
    return (
			<div>
				<h2>Value is {this.state.val}</h2>
				<button onClick={this.handleClick}>Push me</button>
			</div>
    );
  }
});

module.exports = Dummy;