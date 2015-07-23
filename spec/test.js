var object = require('../source/javascript/spectest.js');

describe("multiply", function () {
  it("should return 10", function () {
    expect(object.multiply(5,2)).toBe(10);
  });
});