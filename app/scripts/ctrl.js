'use strict';

var $issues = require('./model/issues'),
    $queries = require('./model/queries'),
    $projects = require('./model/projects');

var listeners = [],
	cachedModel = null,
  cachedProjects = {},
	activeRequest = 0,
  settings = null,
	defaultSettings = {
    redmineURI: 'https://nauphone.naumen.ru/redmine',
    apiKey: 'd0c433ec56e26be7aaa0b18f8a8cd857cb1fce90',
		from: '2015-04-06',
		to: '2015-04-20',
		numMembers: 5,
		hoursPerMember: 70,
		goal: 0
	},

	PROJECTS_URI = '/projects.json?limit=300', 
  QUERIES_URI = '/queries.json?limit=300',    
  ISSUES_URI = '/projects/{project}/issues.json?limit=300&query_id={query}',

	req = function (url, onsuccess, onfailed) {		
		$.ajax({
			url: url + '&key=' + settings.apiKey,
			type: 'GET',
			dataType: 'json',
			success: onsuccess,
			error: onfailed,
			beforeSend: function setHeader(xhr) {
				xhr.setRequestHeader('Accept', 'application/json');
				//xhr.setRequestHeader('X-Redmine-API-Key', apiKey);
			}
		});
	},
		
	transform = function(response){		
		return $issues.transform(response, {
				start: new Date(settings.from),
				end: new Date(settings.to),
				now: new Date(),
				target: settings.numMembers * settings.hoursPerMember,
				goal: settings.goal				
			});
	},

	executeUpdate = function (callback) {
		
    var uri, project;
    
    if (activeRequest > 0) {
			return;
		}
		
    if (cachedModel !== null) {
			callback(cachedModel);
      return;
		}
		
    project = cachedProjects[settings.project];
    if (!project || !settings.query){
      callback(null, 'No Data');
      return;
    }
    
    uri = settings.redmineURI + ISSUES_URI.replace('{project}', project.identifier)
              .replace('{query}', settings.query);
    
    activeRequest++;
    
		req(uri, function (response) {
			console.log('request success');
			activeRequest--;
			try {
				cachedModel = transform(response);
				callback(cachedModel);
			} catch (err){
				console.error(err);
				callback(null, 'Invalid response');
			}
		}, function (xhr) {
			console.log('request failed');
			activeRequest--;
			callback(null, xhr.statusText);
		});
	},

	fireUpdate = function (model, error) {
		console.log('fire update event');
		listeners.forEach(function (listener) {
			listener(model, error);
		});
	};

/* api */

var api = {};

api.onUpdate = function (listener) {
	listeners.push(listener);
};

api.start = function () {
	api.update(api.loadSettings());
};

api.update = function () {
	cachedModel = null;
	fireUpdate();
	executeUpdate(fireUpdate);
};

api.updateQueries = function (callback, opts) {
	req(settings.redmineURI + QUERIES_URI, function(response){
    callback({queries: $queries.transform(response, opts)});
  });
};

api.updateProjects = function (callback) {
	req(settings.redmineURI + PROJECTS_URI, function(response){
    var projects = $projects.transform(response);
    cachedProjects = {};
    projects.forEach(function(p){
      cachedProjects[p.id] = p;
    });
    callback({projects: projects});
  });
};

api.loadSettings = function () {
  var param, userSettings = localStorage.getItem('settings');
  settings = userSettings ? JSON.parse(userSettings) : defaultSettings;
  for (param in defaultSettings){
    if (settings[param] === undefined){
      settings[param] = defaultSettings[param];
    }
  }
	return settings;
};

api.saveSettings = function (userSettings) {
  settings = userSettings;
	return localStorage.setItem('settings', JSON.stringify(userSettings));
};

module.exports = api;
