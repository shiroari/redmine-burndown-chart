'use strict';

var AppDispatcher = require('./AppDispatcher'),
  Resources = require('./Resources'),
  App = require('./App');

var getFirst = function (items) {
  return (items.length === 0 ? null : items[0]);
};

var getFirstById = function (items, val) {
  if (items.length === 0) {
    return null;
  }
  if (val) {
    for (var item of items) {
      if (item.id == val) {
        return item;
      }
    }
  }
  return items[0];
};

var dispatch = function (payload) {
  if (this[payload.type]) {
    return this[payload.type](payload.value);
  }
};

var EventsMixin = {

  listeners: [],

  fireChange: function () {

    console.debug('fireChange');

    this.listeners.forEach((listener) => {
      listener();
    });

  },

  onChange: function (listener) {

    this.listeners.push(listener);

  }

};

/* Settings */

var Settings = Object.assign({}, EventsMixin, {

  settings: null,

  showSettings: false,

  toggleSettings: function () {

    this.showSettings = !this.showSettings;

    this.fireChange();

  },

  setSettings: function (settings) {

    this.settings = settings;

    this.save();

    return Promise.resolve(true);

  },

  save: function () {

    this.settings.query = Queries.query;
    this.settings.project = Projects.project;

    App.settings = this.settings;

    return Promise.resolve();

  },

  update: function () {

    this.settings = App.settings;

    Queries.query = this.settings.query;
    Projects.project = this.settings.project;

    return Promise.resolve();

  }

});

/* Projects */

var Projects = Object.assign({}, EventsMixin, {

  project: null,
  projectList: [],
  id2Project: {},

  setSettings: function () {

    var self = this;

    return AppDispatcher.waitFor([Settings.dispatchToken])
      .then(Resources.getProjects)
      .then(function (projects) {

        self.id2Project = {};

        projects.forEach(function (p) {
          self.id2Project[p.id] = p;
        });

        self.projectList = projects;

        return getFirstById(projects, self.project);
      })
      .then(this.setProject.bind(this))
      .catch(function (reason) {
        console.error(reason);
      });

  },

  setProject: function (project) {

    if (project === null) {
      this.project = null;
    } else {
      this.project = (typeof project === 'string') ? project : project.id;
    }

    console.debug(`selected project: ${this.project}`);

  },

  getProject: function () {
    return this.id2Project[this.project];
  },

  update: function () {

    return this.setSettings();

  }

});

/* Queries */

var Queries = Object.assign({}, EventsMixin, {

  query: null,
  queryList: [],

  setSettings: function () {

    return this.setProject();

  },

  setProject: function () {

    var self = this;

    return AppDispatcher.waitFor([Projects.dispatchToken])
      .then(function () {
        return Resources.getQueries({
          project: Projects.project
        });
      })
      .then(function (queries) {
        self.queryList = queries;
        return getFirstById(queries, self.query);
      })
      .then(this.setQuery.bind(this))
      .catch(function (reason) {
        console.error(reason);
      });

  },

  setQuery: function (query) {

    this.query = (typeof query === 'string') ? query : (query ? query.id : null);

    console.debug(`selected query: ${this.query}`);

    Settings.save();

    this.fireChange();

    return Promise.resolve();

  },

  update: function () {

    return this.setSettings();

  }

});

/* Issues */

var Issues = Object.assign({}, EventsMixin, {

  data: null,

  error: null,

  setSettings: function () {

    return this.setProject();

  },

  setProject: function () {

    return this.setQuery();

  },

  setQuery: function () {

    var self = this;

    self.data = null;
    self.error = null;
    self.fireChange();

    return AppDispatcher.waitFor([Queries.dispatchToken])
      .then(function () {
        return Resources.getIssues({
          project: Projects.getProject().identifier,
          query: Queries.query
        });
      })
      .then(function (data) {
        self.data = data;
        self.fireChange();
      })
      .catch(function (reason) {
        console.error(reason);
        self.error = reason.statusText || 'Unknown error';
        self.fireChange();
      });

  },

  update: function () {

    return this.setSettings();

  }

});

/* Dispatchers */

Settings.dispatchToken = AppDispatcher.register(dispatch.bind(Settings));
Projects.dispatchToken = AppDispatcher.register(dispatch.bind(Projects));
Queries.dispatchToken = AppDispatcher.register(dispatch.bind(Queries));
Issues.dispatchToken = AppDispatcher.register(dispatch.bind(Issues));

module.exports = {
  Settings,
  Projects,
  Queries,
  Issues
};
