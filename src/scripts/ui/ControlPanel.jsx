var React = require("react"),
	AppDispatcher = require('../AppDispatcher'),
	Settings = require('../Store').Settings,
	Projects = require('../Store').Projects,
	Queries = require('../Store').Queries,
	App = require('../App');

var ControlPanel = React.createClass({

  getInitialState: function () {

    return {
			showSettings: Settings.showSettings,
			settings: App.settings,
      projectList: Projects.projectList,
      queryList: Queries.queryList
    };

  },

  componentDidMount: function () {

		Settings.onChange(this.onSettingsChange);

		Queries.onChange(this.onFiltersChange);

  },

	onSettingsChange: function () {

    this.state.showSettings = Settings.showSettings;

    this.setState(this.state);

  },

  onFiltersChange: function () {

    this.state.projectList = Projects.projectList;
    this.state.queryList = Queries.queryList;
    this.setState(this.state);

  },

  onUpdate: function () {

		AppDispatcher.update();

  },

	onChangeProject: function (event) {

		AppDispatcher.setActiveProject(event.target.value);

	},

  onChangeQuery: function (event) {

		AppDispatcher.setActiveQuery(event.target.value);

  },

  onChange: function (event) {

		this.state.settings[event.target.name] = event.target.value;

		this.setState(this.state);

  },

	onSave: function (event) {

		Settings.showSettings = false;

		this.state.showSettings = Settings.showSettings;

		this.setState(this.state);

		AppDispatcher.setSettings(this.state.settings);

	},

  render: function () {

    var projects = this.state.projectList,
      queries = this.state.queryList,
      state = this.state.settings;

    return (
			<div className="form">
      {(this.state.showSettings) ? (
        <ul className='form-fields form-dialog'>
					<li className="form-field">
						<label htmlFor='redmineURI'>Redmine URI</label>
						<input name='redmineURI' type='text' defaultValue={state.redmineURI} onChange={this.onChange}/>
					</li>
					<li className="form-field">
						<label htmlFor='apiKey'>Api Key</label>
						<input name='apiKey' type='text' defaultValue={state.apiKey} onChange={this.onChange}/>
					</li>
					<li className="form-footer">
            <button onClick={this.onSave}>Save</button>
					</li>
				</ul>
        ) : ''}
				<ul className={'form-fields ' + (this.state.settingsOpened ? 'faded' : '')}>
          <li className="form-field">
						<label htmlFor='project'>Project</label>
						<select name='project' value={state.project} onChange={this.onChangeProject}>{
              projects.map(function (opt) {
                return (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                );
              })}
						</select>
					</li>
					<li className="form-field">
						<label htmlFor='query'>Query</label>
						<select name='query' value={state.query} onChange={this.onChangeQuery}>{
              queries.map(function (opt) {
                return (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                );
              })}
						</select>
					</li>
					<li className="form-field">
						<label htmlFor='from'>From</label>
						<input name='from' type='date' value={state.from} onChange={this.onChange}/>
					</li>
					<li className="form-field">
						<label htmlFor='to'>To</label>
						<input name='to' type='date' value={state.to} onChange={this.onChange}/>
					</li>
					<li className="form-field">
						<label htmlFor='numMembers'>Team members</label>
						<input name='numMembers' type='number' value={state.numMembers} onChange={this.onChange}/>
					</li>
					<li className="form-field">
						<label htmlFor='hoursPerMember'>Hours per member</label>
						<input name='hoursPerMember' type='number' value={state.hoursPerMember} onChange={this.onChange}/>
					</li>
					<li className="form-field">
						<label htmlFor='goal'>Goal</label>
						<input name='goal' type='number' value={state.goal} onChange={this.onChange}/>
					</li>
					<li className="form-footer">
						<button onClick={this.onUpdate}>Update</button>
					</li>
				</ul>
			</div>
    );
  }
});

module.exports = ControlPanel;
