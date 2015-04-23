'use strict';

var Dispatcher = require('./flux/Dispatcher');

var dispatcher = Object.assign(new Dispatcher(), {

  toggleSettings: function (settings) {

    this.dispatch({
      type: 'toggleSettings'
    });

  },

  setSettings: function (settings) {

    this.dispatch({
      type: 'setSettings',
      value: settings
    });

  },

  setActiveProject: function (project) {

    this.dispatch({
      type: 'setProject',
      value: project
    });

  },

  setActiveQuery: function (query) {

    this.dispatch({
      type: 'setQuery',
      value: query
    });

  },

  update: function () {

    this.dispatch({
      type: 'update'
    });

  }

});

module.exports = dispatcher;
