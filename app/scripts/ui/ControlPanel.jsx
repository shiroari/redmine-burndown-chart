var React = require("react"),
		$model = require('../ctrl');

var ControlPanel = React.createClass({
  getInitialState: function() {
		return {
      queries: [],
      settings: $model.loadSettings()
    };
  },	
	componentDidMount: function() {
		$model.updateQueries(this.onUpdateQueries.bind(this));
  },  
  onUpdateQueries: function(event) {
    this.state.queries = event.queries;
		this.setState(this.state);
  },
  onUpdate: function(event) {
		$model.update(this.state.settings);
  },
  onChange: function(event) {
		this.state.settings[event.target.name] = event.target.value;
    $model.saveSettings(this.state.settings);
    this.setState(this.state);
  },	
  render: function() {
    var queries = this.state.queries,
      state = this.state.settings;
    return (
			<div>
				<ul className='formfields'>
					<li className="formfield">
						<label htmlFor='query'>Query</label>
						<select name='query' onChange={this.onChange}>{
              queries.map(function(opt){
                return (
                  <option value={opt.id} selected={state.query == opt.id}>{opt.name}</option>
                );
              })}
						</select>
					</li>
					<li className="formfield">
						<label htmlFor='from'>From</label>
						<input name='from' type='date' value={state.from} onChange={this.onChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='to'>To</label>
						<input name='to' type='date' value={state.to} onChange={this.onChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='numMembers'>Team members</label>
						<input name='numMembers' type='number' value={state.numMembers} onChange={this.onChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='hoursPerMember'>Hours per member</label>
						<input name='hoursPerMember' type='number' value={state.hoursPerMember} onChange={this.onChange}/>
					</li>
					<li className="formfield">
						<label htmlFor='goal'>Goal</label>
						<input name='goal' type='number' value={state.goal} onChange={this.onChange}/>
					</li>					
					<li className="formfield">
						<button onClick={this.onUpdate}>Update</button>
					</li>
				</ul>
			</div>
    );
  }
});

module.exports = ControlPanel;