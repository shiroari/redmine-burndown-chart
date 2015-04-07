var React = require("react"),
		$model = require('../ctrl');

var ControlPanel = React.createClass({

  getInitialState: function() {
		return {
      projects: [],
      queries: [],
      settings: $model.loadSettings()
    };
  },	
  
	componentDidMount: function() {
		$model.updateProjects(this.onUpdateProjects.bind(this));
  },  
  
  onUpdateProjects: function(event) {
  
    this.state.projects = event.projects;
    
    if (this.state.projects.length === 0){
      this.state.settings.project = null;
      this.state.settings.query = null;
      this.setState(this.state);
      return;
    }
    
    if (!this.state.settings.project){
      this.state.settings.project = this.state.projects[0].id;      
    }
    
    $model.updateQueries(this.onUpdateQueries.bind(this), {project: this.state.settings.project});
  },
  
  onUpdateQueries: function(event) {
  
    this.state.queries = event.queries;
    
    if (this.state.queries.length === 0){
      this.state.settings.query = null;
      this.setState(this.state);
      return;
    }    
    
    if (!this.state.settings.query){
      this.state.settings.query = this.state.queries[0].id;      
    }    
    
    $model.update(this.state.settings);
    
		this.setState(this.state);
  },
  
  onUpdate: function(event) {
		$model.update(this.state.settings);
  },
  
  onChange: function(event) {
    this._updateSettings(event.target.name, event.target.value);
    this.setState(this.state);
  },
  
  onChangeProject: function(event) {
		
    this._updateSettings(event.target.name, event.target.value);
    
    this.state.queries = [];
    this.state.settings.query = null;
    
    if (this.state.settings.project){
      $model.updateQueries(this.onUpdateQueries.bind(this), {project: this.state.settings.project});
      return;
    }
    
    this.setState(this.state);
  },
  
  onChangeQuery: function(event) {
  
		this._updateSettings(event.target.name, event.target.value);
    
    $model.update(this.state.settings);
    
  },    
  
  _updateSettings(name, value){
		this.state.settings[name] = value;
    $model.saveSettings(this.state.settings);
  },  
  
  render: function() {
    var projects = this.state.projects,
      queries = this.state.queries,
      state = this.state.settings;
    return (
			<div>
				<ul className='formfields'>
          <li className="formfield">
						<label htmlFor='project'>Project</label>
						<select name='project' defaultValue={state.project} onChange={this.onChangeProject}>{
              projects.map(function(opt){
                return (
                  <option value={opt.id} selected={opt.id == state.project}>{opt.name}</option>
                );
              })}
						</select>
					</li>					        
					<li className="formfield">
						<label htmlFor='query'>Query</label>
						<select name='query' defaultValue={state.query} onChange={this.onChangeQuery}>{
              queries.map(function(opt){
                return (
                  <option value={opt.id} selected={opt.id == state.query}>{opt.name}</option>
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