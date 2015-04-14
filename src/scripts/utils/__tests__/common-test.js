jest.dontMock('../common');

describe('common', function () {

		var obj = require('../common');

    it('nextDay', function () {
				var date = new Date('2012-12-01');
        expect(obj.nextDay(date).getDate()).toBe(2);
    });
});
