'use strict';

var AppDispatcher = require('./AppDispatcher');

const DefaultSettings = {
  redmineURI: 'http://www.example.com/redmine',
  apiKey: '',
  from: '2015-04-06',
  to: '2015-04-20',
  numMembers: 5,
  hoursPerMember: 70,
  goal: 0
};

class App {

  constructor() {

    var userSettings = localStorage.getItem('settings');

    try {
      this._settings = userSettings ? JSON.parse(userSettings) : Object.assign({}, DefaultSettings);
    } catch (err){
      this._settings = Object.assign({}, DefaultSettings);
    }

  }

  _saveSettings(userSettings) {

    localStorage.setItem('settings', JSON.stringify(userSettings));

  }

  get settings() {
    return this._settings;
  }

  set settings(settings) {
    this._saveSettings(settings);
    this._settings = settings;
  }

  start(){

    AppDispatcher.update();

  }

}

module.exports = new App();
