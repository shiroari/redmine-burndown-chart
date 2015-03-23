jest.dontMock('../test');

describe('test', function () {

		var Speaker = require('../test'),
				obj = new Speaker();

		it('test', function () {
        expect(obj.say()).toBe('hello');
    });
});

