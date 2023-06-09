const redis = require('../../../app/controllers/redis');
const redisService = require('../../../app/services/redis');

jest.mock('../../../app/services/redis');

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
        const mockSetResult = 'Setting a:b';
        const expectedResult = { message: mockSetResult };

        redisService.set.mockResolvedValue(mockSetResult);

        mockRequest.params = { key: 'a', value: 'b' };
        await redis.setKeyWithValue(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe("getKey", () => {
      it("should return b", async () => {
        const mockGetResult = 'b';
        const expectedResult = { message: mockGetResult };

        redisService.get.mockResolvedValue(mockGetResult);

        mockRequest.params = { key: 'a'};
        await redis.getValue(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe("helloWorld", () => {
      it("should a list of the greatest names", async () => {

        const mockHelloWorldResult = ["Luã","Max","Zé"]; // ALPHABETICAL ORDER 
        const expectedResult = { message: mockHelloWorldResult };

        redisService.helloWorld.mockResolvedValue(mockHelloWorldResult);

        await redis.helloWorldFromRedis(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  });
})
