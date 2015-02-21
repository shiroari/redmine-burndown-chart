/** @jsx React.DOM */

var React = require("react"),
		$model = require('./../model/model');

var ControlPanel = React.createClass({
  getInitialState: function() {
		return {val: 0};
  },	
  handleClick: function(event) {
    this.setState({val: (this.state.val + 1)});
		$model.update();
  },	
  render: function() {
    return (
			<div>
				<ul className='formfields'>
					<li className="formfield">
						<label for='f4'>Query</label>
						<select name='f4'>
							<option>...</option>
						</select>
					</li>
					<li className="formfield">
						<label for='f1'>From</label>
						<input name='f1' type='date' value=''/>
					</li>
					<li className="formfield">
						<label for='f2'>To</label>
						<input name='f2' type='date' value=''/>
					</li>
					<li className="formfield">
						<label for='f5'>Chart</label>
						<input name='f5' type='radio' value=''><label for='f5'>nvd3</label></input>
						<input name='f5' type='radio' value=''><label for='f5'>mg</label></input>
					</li>
					<li className="formfield">
						<button onClick={this.handleClick}>Update</button>
					</li>
				</ul>
			</div>
    );
  }
});

module.exports = ControlPanel;