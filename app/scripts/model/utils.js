/*global module*/
'use strict';

var fn = {};

fn.dateToString = function (date) {
	var str = (typeof date === 'string') ? date : date.toISOString();
	return str.substr(0, str.indexOf('T'));
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

module.exports = fn;