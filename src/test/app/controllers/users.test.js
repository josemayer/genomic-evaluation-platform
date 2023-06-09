const users = require('../../../app/controllers/users');
const usersService = require('../../../app/services/users');

jest.mock('../../../app/services/users');

describe("users controller", () => {
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
    describe("listClients", () => {
      it.each([
        [
          [
            {
              name: 'Testovich',
              mail: 'testovich@exemplo.com',
              phone: '(11) 4002-8922',
            },
            {
              name: 'Autt Testoych',
              mail: 'autt@testesautomatizados.com',
              phone: '(11) 1133-5577',
            }
          ],
          {
            clients: [
              {
                name: 'Testovich',
                mail: 'testovich@exemplo.com',
                phone: '(11) 4002-8922',
              },
              {
                name: 'Autt Testoych',
                mail: 'autt@testesautomatizados.com',
                phone: '(11) 1133-5577',
              },
            ],
            meta: {
              total: 2,
              page: 1,
            }
          }
        ],
        [
          [],
          {
            clients: [],
            meta: {
              total: 0,
              page: 1,
            }
          }
        ],
      ])("should return the list of clients from getAllClients", async (getAllClientsResult, expectedResult) => {
        usersService.getAllClients.mockResolvedValue(getAllClientsResult);

        await users.listClients(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
      });
    });
  });

  describe("with failing", () => {
    describe("listClients", () => {
      it("should return the error from getAllClients", async () => {
        const error = new Error('Error retrieving all clients');
        error.statusCode = 500;
        usersService.getAllClients.mockRejectedValue(error);

        await users.listClients(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(error.statusCode);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
      });
    });
  });
});
