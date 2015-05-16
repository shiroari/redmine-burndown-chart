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
    if (params[name] === undefined || params[name] === null){
      return `{${name}}`;
    }
    return params[name];
  });
};

/**
 * Effictive join two arrays together
 *
 * @see http://davidwalsh.name/combining-js-arrays
 */
fn.join = function (dst, src) {
  var len = src.length;
  for (var i = 0; i < len; i = i + 5000) {
    dst.unshift.apply(dst, src.slice(i, i + 5000));
  }
};

module.exports = fn;
