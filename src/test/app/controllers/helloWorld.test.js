const helloWorld = require('../../../app/controllers/helloWorld');

describe("helloWorld", () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("with passing", () => {
    it("should return hello world", () => {
      helloWorld.sayHello(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Hello, World!' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return hello world with name", () => {
      mockRequest.params = { name: 'Baker' };

      helloWorld.sayHelloWithName(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Hello, Baker!' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("with failing", () => {
    it("should not return hello world", () => {
      helloWorld.sayHello(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).not.toHaveBeenCalledWith({ message: 'Hello, foo!' });
    });

    it("should not return hello world with name", () => {
      mockRequest.params = { name: 'Baker' };

      helloWorld.sayHelloWithName(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).not.toHaveBeenCalledWith({ message: 'Hello, World!' });
    });
  });
});
