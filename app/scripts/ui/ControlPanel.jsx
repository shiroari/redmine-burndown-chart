var React = require("react"),
		$model = require('../ctrl');

var ControlPanel = React.createClass({
  getInitialState: function() {
		return $model.loadSettings();
  },	
  handleClick: function(event) {
		$model.update(this.state);
  },	
  handleChange: function(event) {
		this.state[event.target.name] = event.target.value;
    this.setState(this.state);
  },	
  render: function() {
    return (
			<div>
				<ul className='formfields'>
					<li className="formfield">
						<label htmlFor='f4'>Query</label>
						<select name='f4'>
							<option>...</option>
						</select>
					</li>
					<li className="formfield">
						<label htmlFor='from'>From</label>
						<input name='from' type='date' value={this.state.from} onChange={this.handleChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='to'>To</label>
						<input name='to' type='date' value={this.state.to} onChange={this.handleChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='numMembers'>Team members</label>
						<input name='numMembers' type='number' value={this.state.numMembers} onChange={this.handleChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='hoursPerMember'>Hours per member</label>
						<input name='hoursPerMember' type='number' value={this.state.hoursPerMember} onChange={this.handleChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='goal'>Goal</label>
						<input name='goal' type='number' value={this.state.goal} onChange={this.handleChange}/>
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