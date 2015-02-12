/* globals require: true, module: true */
'use strict';

var $utils = require('./utils'),
	$math = require('./math');

var scatter = function (groups, issue) {

	var date = $utils.dateToString(issue.updated_on),
		val = issue.estimated_hours || 0.0,
		skipLimit = 24;

	if (val > skipLimit || groups[date] === undefined || groups[date] === null) {
		return;
	}

	if (issue.status.name === 'Closed' || issue.status.name === 'Reject') {
		groups[date].closed += val;
	} else if (issue.status.name === 'Review') {
		groups[date].review += val;
	} else if (issue.status.name === 'Test' || issue.status.name === 'Autotest') {
		groups[date].test += val;
	}

}

var SmartLine = function (max) {

	this.sum = 0;
	this.points = [];
	this.index = 0;
	this.add = function (date, value) {

		if (value === null) {
			this.points.push({
				index: this.index++,
				date: date,
				val: null,
				sum: null,
				diff: null
			});
			return;
		}

		this.sum += value;
		this.points.push({
			index: this.index++,
			date: date,
			val: value,
			sum: this.sum,
			diff: (max - this.sum)
		});

	};

	return this;

};

var removeEmpty = function (data) {
	var j = 0;
	while (j < data.length && data[j].diff !== null) {
		j++;
	}
	data.length = j;
};

var fn = {};

fn.transform = function (transport, opts) {

		var start = $utils.truncDate(opts.start),
			end = $utils.truncDate(opts.end),
			today = $utils.truncDate(opts.now),
			target = opts.target,
			goal = opts.goal,
			data = transport.issues;

		var cur = start;

		var points = [],
			daysMap = {};

		while (cur <= end) {
			if (cur.getDay() !== 0 && cur.getDay() !== 6) {
				if (cur > today) {
					daysMap[$utils.dateToString(cur)] = null;
				} else {
					daysMap[$utils.dateToString(cur)] = {
						test: 0,
						review: 0,
						closed: 0
					};
				}
			}
			cur = $utils.nextDay(cur);
		}

		data.forEach(scatter.bind(this, daysMap));

			for (var day in daysMap) {
				points.push({
					date: new Date(day),
					value: daysMap[day]
				});
			}

			points.sort(function (l, r) {
				if (l.date === r.date) {
					return 0;
				}
				return (l.date > r.date) ? 1 : -1;
			});

			var closed = new SmartLine(target),
				review = new SmartLine(target),
				test = new SmartLine(target);

			points.forEach(function (d) {
				closed.add(d.date, (d.value === null) ? null : d.value.closed);
				review.add(d.date, (d.value === null) ? null : (d.value.closed + d.value.review));
				test.add(d.date, (d.value === null) ? null : (d.value.closed + d.value.test));
			});

			var targetChart = $math.approx(closed.points);

			removeEmpty(closed.points); removeEmpty(review.points); removeEmpty(test.points);

			return {
				minY: 0,
				maxY: target,
				startIndex: 0,
				endIndex: points.length - 1,
				start: start,
				end: end,
				goal: goal,
				data: [closed.points, review.points, test.points, targetChart]
			};
		};


		module.exports = fn;