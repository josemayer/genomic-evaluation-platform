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

    describe("registerClient", () => {
      it('should register a new client', async () => {
        const clientData = {
          nome_completo: 'John Doe',
          email: 'john@example.com',
          telefone: '(11) 12345-6789',
        };

        const insertedClient = {
          id: 1,
          ...clientData,
        };

        usersService.insertClient.mockResolvedValue(insertedClient);

        mockRequest.body = clientData;

        await users.registerClient(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Client registered successfully',
          client: insertedClient,
        });
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

    describe("registerClient", () => {
      it('should return an error for incomplete client information', async () => {
        mockRequest.body = {
          nome_completo: 'Bob',
          email: 'bob-the-tester@example.com',
        };

        await users.registerClient(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Incomplete fields',
        });
      });

      it('should return an error when insertion fails', async () => {
        const error = new Error('Failed to insert client in service');
        error.statusCode = 500;

        usersService.insertClient.mockRejectedValue(error);

        const clientData = {
          nome_completo: 'Bob',
          email: 'bob-the-tester@example.com',
          telefone: '(11) 55559-1234',
        };

        mockRequest.body = clientData;

        await users.registerClient(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(error.statusCode);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: error.message,
        });
      });
    });
  });
});
