var $model = (function () {

	var dateToken = function (date) {
			var str = (typeof date === 'string') ? date : date.toISOString();
			return str.substr(0, str.indexOf('T'));
		},

		addDays = function (date, days) {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days,
				date.getHours(), date.getMinutes(), 0, 0);
		},

		nextDay = function (date) {
			return addDays(date, 1);
		},

		truncDate = function (date) {
			return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		};
	
	var SumObj = function (target) {
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
				diff: (target - this.sum)
			});

		};
		return this;
	};

	var approx = function (pts) {
		var last = pts.length - 1,
			lastPt = pts[last];
		while (last > 0 && pts[last].diff === null) {
			last--;
		}
		if (last === 0) {
			return [pts[0], {
				index: lastPt.index,
				date: lastPt.date,
				val: 0,
				sum: 0,
				diff: 0
			}];
		}
		var lastActivePt = pts[last],
			diff = pts[0].diff + (lastActivePt.diff - pts[0].diff) / (lastActivePt.index - pts[0].index) * lastPt.index;
		return [pts[0], {
			index: lastPt.index,
			date: lastPt.date,
			val: 0,
			sum: 0,
			diff: diff
			}];
	};

	var removeEmpty = function (data) {
		var j = 0;
		while (j < data.length && data[j].diff != null) {
			j++;
		}
		data.length = j;
	};

	var transform = function (input) {

		var start = new Date('2015-02-09'),
			end = new Date('2015-02-22'),
			today = truncDate(new Date()),
			data = input.issues,
			target = 70 * 6,
			skipLimit = 24;

		var cur = start;

		var points = [],
			daysMap = {};

		while (cur <= end) {
			if (cur.getDay() != 0 && cur.getDay() != 6) {
				if (cur > today) {
					daysMap[dateToken(cur)] = null;
				} else {
					daysMap[dateToken(cur)] = {
						test: 0,
						review: 0,
						closed: 0
					};
				}
			}
			cur = nextDay(cur);
		}

		data.forEach(function (d) {

			var date = dateToken(d.updated_on),
				val = d.estimated_hours || .0;

			if (val > skipLimit || daysMap[date] === undefined || daysMap[date] === null) {
				return;
			}

			if (d.status.name === 'Closed' || d.status.name === 'Reject') {
				daysMap[date].closed += val;
			} else if (d.status.name === 'Review') {
				daysMap[date].review += val;
			} else if (d.status.name === 'Test' || d.status.name === 'Autotest') {
				daysMap[date].test += val;
			}

		});

		for (var day in daysMap) {
			points.push({
				date: new Date(day),
				value: daysMap[day]
			});
		};

		points.sort(function (l, r) {
			if (l.date === r.date) return 0;
			return (l.date > r.date) ? 1 : -1;
		});

		var closed = new SumObj(target),
			review = new SumObj(target),
			test = new SumObj(target);

		points.forEach(function (d) {
			closed.add(d.date, (d.value === null) ? null : d.value.closed);
			review.add(d.date, (d.value === null) ? null : (d.value.closed + d.value.review));
			test.add(d.date, (d.value === null) ? null : (d.value.closed + d.value.test));
		});

		var targetChart = approx(closed.points);
		
		removeEmpty(closed.points);
		removeEmpty(review.points);
		removeEmpty(test.points);

		return {
			minY: 0,
			maxY: target,
			startIndex: 0,
			endIndex: points.length - 1,
			start: start,
			end: end,
			goal: 70,
			data: [closed.points, review.points, test.points, targetChart]
		};
	};
	
	/* core */

	var listeners = [],
			cachedModel = null,
			activeRequest = 0,
			
			req = function (onsuccess, onfailed) {
				$.ajax({
					//url: 'https://luminous-heat-894.firebaseio.com/.json',
					//url: '/scripts/data.json',
					url: 'https://nauphone.naumen.ru/redmine/projects/npo-pms-15/issues.json?query_id=289&limit=300',
					type: 'GET',
					dataType: 'json',
					success: onsuccess,
					error: onfailed,
					beforeSend: function setHeader(xhr) {
						xhr.setRequestHeader("Authorization", "Basic " + window.authKey);
						//xhr.setRequestHeader("Accept", "application/json");
					}
				});
			},
			
			executeUpdate = function (callback) {
				if (activeRequest > 0){
					return;
				}
				if (cachedModel !== null){
					callback(cachedModel);
				}
				activeRequest++;
				req(function (data) {
					console.log('request success');
					activeRequest--;
					cachedModel = transform(data);
					callback(cachedModel);
				}, function () {
					console.log('request failed');
					activeRequest--;
				});
			},
			
			fireUpdate = function(model){
				console.log('fire update event');
				listeners.forEach(function(l){
					l(model);
				});		
			};
	
	/* api */
	
	var api = {};
	
	api.onUpdate = function(listener){
		listeners.push(listener);
	};
	
	api.start = function(){
		executeUpdate(fireUpdate);
	};
	
	api.update = function(){
		cachedModel = null;
		executeUpdate(fireUpdate);
	};

	return api;
})();

module.exports = $model;