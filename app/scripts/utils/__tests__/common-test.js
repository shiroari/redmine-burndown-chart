jest.dontMock('../common');

describe('common', function () {

		var obj = require('../common');
    //var React = require('react/addons');
    //var TestUtils = React.addons.TestUtils;

    beforeEach(function () {
       // timer = TestUtils.renderIntoDocument(<Timer/>);
    });

    it('nextDay', function () {
				var date = new Date('2012-12-01');
        expect(obj.nextDay(date).getDate()).toBe(2);
    });
});

