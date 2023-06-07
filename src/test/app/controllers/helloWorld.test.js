const helloWorld = require('../../../app/controllers/helloWorld');

class MockRequest {
  constructor(params) {
    this.params = params;
  }
}

class MockResponse {
  constructor(status_code, json) {
    this.data = {
      status: status_code,
      json: json,
    };
  }

  status(status_code) {
    this.data.status = status_code;
    return status_code;
  }

  json(json_rec) {
    this.data.json = json_rec;
    return json_rec;
  }

  getResponse() {
    return this.data;
  }
}

describe("helloWorld", () => {
  describe("with passing", () => {
    it("should return hello world", () => {
      const req = new MockRequest({});
      const res = new MockResponse();
      const exp = new MockResponse(200, { message: 'Hello, World!' });

      helloWorld.sayHello(req, res, null);

      expect(res.getResponse()).toEqual(exp.getResponse());
    });

    it("should return hello world with name", () => {
      const req = new MockRequest({ name: 'Baker' });
      const res = new MockResponse();
      const exp = new MockResponse(200, { message: 'Hello, Baker!' });

      helloWorld.sayHelloWithName(req, res, null);

      expect(res.getResponse()).toEqual(exp.getResponse());
    });
  });

  describe("with failing", () => {
    it("should not return hello world", () => {
      const req = new MockRequest({});
      const res = new MockResponse();
      const exp = new MockResponse(200, { message: 'Hello, foo!' });

      helloWorld.sayHello(req, res, null);

      expect(res.getResponse()).not.toEqual(exp.getResponse());
    });

    it("should not return hello world with name", () => {
      const req = new MockRequest({ name: 'Baker' });
      const res = new MockResponse();
      const exp = new MockResponse(200, { message: 'Hello, World!' });

      helloWorld.sayHelloWithName(req, res, null);

      expect(res.getResponse()).not.toEqual(exp.getResponse());
    });
  });
});
