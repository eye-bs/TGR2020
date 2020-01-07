const append = require("./append.js");

test('append 1,2 be "12"', () => {
  expect(append(1, 2)).toBe("12");
});

test('append "1","2" be "12"', () => {
  expect(append("1","2")).toBe("12");
});

test('append 1,"2" be "12"', () => {
  expect(append(1,"2")).toBe("12");
});
