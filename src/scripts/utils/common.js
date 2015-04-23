'use strict';

var fn = {};

fn.dateToString = function (date) {
  var str = (typeof date === 'string') ? date : date.toISOString();
  return str.substr(0, str.indexOf('T'));
};

fn.localDateToString = function (date) {
  return fn.dateToString(fn.truncDate(date));
};

fn.addDays = function (date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days,
    date.getHours(), date.getMinutes(), 0, 0);
};

fn.nextDay = function (date) {
  return fn.addDays(date, 1);
};

fn.truncDate = function (date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

fn.rewriteUri = function (uri, params = {}) {
  return uri.replace(/\{([^}]*)\}/g, function (str, name) {
    if (params[name] === undefined){
      return `{${name}}`;
    }
    return params[name];
  });
};

module.exports = fn;
