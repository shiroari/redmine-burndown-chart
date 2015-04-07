'use strict';

var $issues = require('./model/issues'),
    $queries = require('./model/queries'),
    $projects = require('./model/projects'),
		$user = require('./user');

var listeners = [],
	cachedModel = null,
  cachedProjects = {},
	activeRequest = 0,
	defaultSettings = {
		from: '2015-04-06',
		to: '2015-04-20',
		numMembers: 5,
		hoursPerMember: 70,
		goal: 0
	},

	ISSUES_URL = 'https://nauphone.naumen.ru/redmine/projects/{project}/issues.json?limit=300&query_id={query}',
	QUERIES_URL = 'https://nauphone.naumen.ru/redmine/queries.json?limit=300',
  PROJECTS_URL = 'https://nauphone.naumen.ru/redmine/projects.json?limit=300',  

	req = function (url, onsuccess, onfailed) {		
		$.ajax({
			url: url + '&key=' + $user.apiKey,
			type: 'GET',
			dataType: 'json',
			success: onsuccess,
			error: onfailed,
			beforeSend: function setHeader(xhr) {
				xhr.setRequestHeader('Accept', 'application/json');
				//xhr.setRequestHeader('X-Redmine-API-Key', $user.apiKey);
			}
		});
	},
		
	transform = function(settings, response){		
		return $issues.transform(response, {
				start: new Date(settings.from),
				end: new Date(settings.to),
				now: new Date(),
				target: settings.numMembers * settings.hoursPerMember,
				goal: settings.goal				
			});
	},

	executeUpdate = function (callback, settings) {
		
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
    
    uri = ISSUES_URL.replace('{project}', project.identifier)
              .replace('{query}', settings.query);
    
    activeRequest++;
    
		req(uri, function (response) {
			console.log('request success');
			activeRequest--;
			try {
				cachedModel = transform(settings, response);
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

api.update = function (settings) {
	cachedModel = null;
	fireUpdate();
	executeUpdate(fireUpdate, settings);
};

api.updateQueries = function (callback, opts) {
	req(QUERIES_URL, function(response){
    callback({queries: $queries.transform(response, opts)});
  });
};

api.updateProjects = function (callback) {
	req(PROJECTS_URL, function(response){
    var projects = $projects.transform(response);
    cachedProjects = {};
    projects.forEach(function(p){
      cachedProjects[p.id] = p;
    });
    callback({projects: projects});
  });
};

api.loadSettings = function () {
  var settings = localStorage.getItem('settings');
	return settings ? JSON.parse(settings) : defaultSettings;
};

api.saveSettings = function (settings) {
	return localStorage.setItem('settings', JSON.stringify(settings));
};

module.exports = api;
