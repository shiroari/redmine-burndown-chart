/*globals $, require, console, module*/
'use strict';

var $issues = require('./issues'),
		$user = require('./user');

var listeners = [],
	cachedModel = null,
	activeRequest = 0,
	defaultSettings = {
		from: '2015-02-24',
		to: '2015-03-08',
		numMembers: 6,
		hoursPerMember: 70,
		goal: 70
	},

	DUMMY_URL = '/scripts/json/data.json',
	ISSUES_URL = 'https://nauphone.naumen.ru/redmine/projects/npo-pms-15/issues.json?query_id=289&limit=300',
	QUERIES_URL = 'https://nauphone.naumen.ru/redmine/queries.json?limit=300',

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
		if (activeRequest > 0) {
			return;
		}
		if (cachedModel !== null) {
			callback(cachedModel);
		}
		activeRequest++;
		req(ISSUES_URL, function (response) {
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

api.loadSettings = function () {
	return defaultSettings;
};

module.exports = api;