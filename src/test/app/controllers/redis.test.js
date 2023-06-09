const redis = require('../../../app/controllers/redis');

describe("redis controller", () => {
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
    describe("setKeyWithValue", () => {
      it("should return Setting key:value", async () => {
        mockRequest.params = { key: 'a', value: 'b' };

        await redis.setKeyWithValue(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Setting a:b' });
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe("getKey", () => {
      it("should return b", async () => {
        mockRequest.params = { key: 'a'};

        await redis.getValue(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'b' });
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe("helloWorld", () => {
      it("should a list of the greatest names", async () => {

        await redis.helloWorldFromRedis(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({"message": ["Luã","Max","Zé"]});
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  });
})
