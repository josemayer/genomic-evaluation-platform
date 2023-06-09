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

    describe("getClientById", () => {
      it.each([
        [
          {
            name: 'Testovich',
            mail: 'testovich@exemplo.com',
            phone: '(11) 4002-8922',
          },
          {
            client: {
              name: 'Testovich',
              mail: 'testovich@exemplo.com',
              phone: '(11) 4002-8922',
            },
            meta: {
              total: 1
            }
          }
        ],
        [
          [
            {
              name: 'Testt Auttovich',
              mail: 'test-aut@exemplo.com',
              phone: '(11) 4002-8922'
            },
            {
              name: 'Ott Testt',
              mail: 'anottestt@exemplo.com',
              phone: '(11) 0000-0000'
            }
          ],
          {
            client: {
              name: 'Testt Auttovich',
              mail: 'test-aut@exemplo.com',
              phone: '(11) 4002-8922'
            },
            meta: {
              total: 1,
            }
          }
        ]
      ])("should return the client data from getClientById", async (getClientByIdResult, expectedResult) => {
        usersService.getClientById.mockResolvedValue(getClientByIdResult);

        const mockRequest = { params: { id: 1 } };
        await users.clientInfo(mockRequest, mockResponse, mockNext);

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

    describe("getClientById", () => {
      it("should return the required id error", async () => {
        usersService.getClientById.mockResolvedValue(null);

        const mockRequest = { params: {} };
        await users.clientInfo(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Required id' });
      });

      it.each(
        [null, undefined, [], {}]
      )("should return the error to not found client", async (getClientByIdResult) => {
        usersService.getClientById.mockResolvedValue(getClientByIdResult);

        const mockRequest = { params: { id: 1 } };
        await users.clientInfo(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not found' });
      });
    });
  });
});
