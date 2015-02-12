/* globals $: true, require: true, console: true, module: true */
'use strict';

var $issues = require('./issues');

var listeners = [],
	cachedModel = null,
	activeRequest = 0,
	opts = {
		start: new Date('02-09-2015'),
		end: new Date('02-21-2015'),
		now: new Date(),
		target: 6*70,
		goal: 70
	},

	DUMMY_URL = '/scripts/json/data.json',
	ISSUES_URL = 'https://nauphone.naumen.ru/redmine/projects/npo-pms-15/issues.json?query_id=289&limit=300',
	QUERIES_URL = 'https://nauphone.naumen.ru/redmine/queries.json?limit=300',

	req = function (url, onsuccess, onfailed) {
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			success: onsuccess,
			error: onfailed,
			beforeSend: function setHeader(xhr) {
				//xhr.setRequestHeader('Authorization', 'Basic ' + window.authKey);
				xhr.setRequestHeader('Accept', 'application/json');
			}
		});
	},

	executeUpdate = function (callback) {
		if (activeRequest > 0) {
			return;
		}
		if (cachedModel !== null) {
			callback(cachedModel);
		}
		activeRequest++;
		req(DUMMY_URL, function (data) {
			console.log('request success');
			activeRequest--;
			cachedModel = $issues.transform(data, opts);
			callback(cachedModel);
		}, function () {
			console.log('request failed');
			activeRequest--;
		});
	},

	fireUpdate = function (model) {
		console.log('fire update event');
		listeners.forEach(function (l) {
			l(model);
		});
	};

/* api */

var api = {};

api.onUpdate = function (listener) {
	listeners.push(listener);
};

api.start = function () {
	executeUpdate(fireUpdate);
};

api.update = function () {
	cachedModel = null;
	executeUpdate(fireUpdate);
};

module.exports = api;