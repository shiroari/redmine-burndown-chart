'use strict';

var $issues = require('./model/issues'),
  $queries = require('./model/queries'),
  $projects = require('./model/projects'),
  $utils = require('./utils/common'),
  App = require('./App');

const cPageSize = 100;

const Resources = {
  Projects: '/projects.json?limit=100',
  Queries: '/queries.json?limit=100',
  Issues: '/projects/{project}/issues.json?limit={limit}&offset={offset}&query_id={query}'
};

/**
 * Execute request to redmine RestAPI
 * @param {string} url Resource URI
 */
var executeRequest = function (url) {

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

/**
 * Request and collect all avalible data through RestAPI
 * even if number of resources is more then redmine API limit
 *
 * request = {
 *  uri,      // [in] resource uri
 *  page,     // [in/out] first page
 *  pageSize, // [in] page size
 *  data,     // [out] response object
 *  dataField // [in] response object field with array of resources
 * }
 *
 * @param {object} req Request options
 * @returns {object} Response object
 */
var getAllPages = function (req) {

  return executeRequest($utils.rewriteUri(req.uri, {
    limit: req.pageSize,
    offset: req.page * req.pageSize
  })).then(function (response) {

    if (req.page === 0) {
      req.data = response;
    } else {
      if (response[req.dataField]){
        $utils.join(req.data[req.dataField], response[req.dataField]);
      }
    }

    if (response[req.dataField] && response[req.dataField].length === req.pageSize) {
      req.page++;
      return getAllPages(req);
    }

    return req.data;

  }).catch(function (reason) {

    console.log(reason);
    return req.data;

  });

};

/**
 * Execute request to redmine RestAPI
 * @param {string} resource Resource URI template
 * @param {object} params Parameters to expose URI template
 */
var getResourceUri = function (resource, params) {
  return $utils.rewriteUri(App.settings.redmineURI + resource, params);
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
    query: params.query
  });

  var req = {
    uri,
    page: 0,
    pageSize: cPageSize,
    data: {},
    dataField: 'issues'
  };

  return getAllPages(req).then(function (response) {

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
