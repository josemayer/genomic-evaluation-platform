const helloWorld = require('../../../app/controllers/helloWorld');

const mockRequest = (params) => {
  const req = {};
  req.params = params;
  return req
};

const mockResponse = (status_code, message) => {
  const res = {};
  res.status = jest.fn().mockReturnValue(status_code);
  res.json = jest.fn().mockReturnValue({ message: message });
  return res;
};

describe("helloWorld", () => {
  describe("with passing", () => {
    it("should return hello world", () => {
      const req = mockRequest({});
      const res = mockResponse(200, 'Hello, World!');

      expect(helloWorld.sayHello(req, res, null)).toEqual(res);
    });

    it("should return hello world with name", () => {
      const req = mockRequest({ name: 'Baker' });
      const res = mockResponse(200, 'Hello, Baker!');

      expect(helloWorld.sayHelloWithName(req, res, null)).toEqual(res);
    });
  });
});
