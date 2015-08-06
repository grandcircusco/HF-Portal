var object = require('spectest.js');

describe("divide", function () {
  it("should return 10", function () {
    expect(object.divide(20,2)).toBe(10);
  });
});