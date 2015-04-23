var fn = {};

fn.approx = function (pts) {

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

module.exports = fn;
