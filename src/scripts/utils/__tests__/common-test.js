jest.dontMock('../common');

describe('common', function () {

  var $utils = require('../common');

  it('nextDay', function () {
    var date = new Date('2012-12-01');
    expect($utils.nextDay(date).getDate()).toBe(2);
  });

  it('rewriteUri works', function () {
    expect($utils.rewriteUri('/test?p1={paramName1}&p2={paramName2}', {
      paramName1: 1,
      paramName2: 'val'
    })).toBe('/test?p1=1&p2=val');
  });

  it('rewriteUri works with 0 and empty', function () {
    expect($utils.rewriteUri('/test?p1={paramName1}&p2={paramName2}', {
      paramName1: 0,
      paramName2: ''
    })).toBe('/test?p1=0&p2=');
  });

  it('rewriteUri works with null', function () {
    expect($utils.rewriteUri('/test?p1={paramName1}', {
      paramName1: null
    })).toBe('/test?p1={paramName1}');
  });

  it('rewriteUri is safe', function () {
    expect($utils.rewriteUri('/test?p1={paramName1}&p2={paramName2}'))
      .toBe('/test?p1={paramName1}&p2={paramName2}');
  });

});
