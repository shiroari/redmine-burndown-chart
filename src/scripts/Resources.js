'use strict';

var $issues = require('./model/issues'),
  $queries = require('./model/queries'),
  $projects = require('./model/projects'),
  $utils = require('./utils/common'),
  App = require('./App');

const Resources = {
  Projects: '/projects.json?limit=100',
  Issues: '/projects/{project}/issues.json?limit=100&offset={offset}&query_id={query}',
  Queries: '/queries.json?limit=100'
};

var getResourceUri = function (resource, params) {
    return $utils.rewriteUri(App.settings.redmineURI + resource, params);
  },

  executeRequest = function (url) {

    return new Promise(function (resolve, reject) {

      console.debug(`request: ${url}`);

      $.ajax({
        url: url + '&key=' + App.settings.apiKey,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          console.debug('success');
          resolve(response);
        },
        error: function (reason) {
          console.error(reason);
          reject(reason);
        },
        beforeSend: function setHeader(xhr) {
          xhr.setRequestHeader('Accept', 'application/json');
          //xhr.setRequestHeader('X-Redmine-API-Key', apiKey);
        }
      });

    });

  };

/* store */

var api = {};

api.getProjects = function (params) {

  var uri = getResourceUri(Resources.Projects, params);

  return executeRequest(uri).then(function (response) {

    return $projects.transform(response);

  });

};

api.getQueries = function (params) {

  var uri = getResourceUri(Resources.Queries, params);

  return executeRequest(uri).then(function (response) {

    return $queries.transform(response, params);

  });

};

api.getIssues = function (params) {

  var uri = getResourceUri(Resources.Issues, {
    project: params.project,
    query: params.query,
    offset: params.offset
  });

  return executeRequest(uri).then(function (response) {

    var settings = App.settings;

    return $issues.transform(response, {
        start: new Date(settings.from),
        end: new Date(settings.to),
        now: new Date(),
        target: settings.numMembers * settings.hoursPerMember,
        goal: settings.goal
      });

  });

};

module.exports = api;
