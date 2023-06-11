const pg = require('../../../app/config/postgres');
const users = require('../../../app/services/users');

jest.mock('../../../app/config/postgres', () => ({
  query: jest.fn(),
}));

describe('users service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with passing', () => {
    describe('getAllClients', () => {
      it.each([
        [
          [
            {
              id: 1,
              nome_completo: 'Alice',
              email: 'alice@exemplo.com',
              telefone: '(11) 99999-9999',
            },
            {
              id: 2,
              nome_completo: 'Bob',
              email: 'bob-tester@exemplo.com',
              telefone: '(11) 88888-8888',
            }
          ],
          [
            {
              name: 'Alice',
              mail: 'alice@exemplo.com',
              phone: '(11) 99999-9999'
            },
            {
              name: 'Bob',
              mail: 'bob-tester@exemplo.com',
              phone: '(11) 88888-8888',
            }
          ]
        ],
        [
          [],
          []
        ]
      ])('should return an array with found clients infos', async (mockRows, expectedResult) => {
        pg.query.mockResolvedValue({ rows: mockRows });

        const result = await users.getAllClients();

        expect(result).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith(
          "SELECT id, nome_completo, email, telefone FROM ClienteView"
        );
      });
    });

    describe('getClientById', () => {
      it.each([
        [
          [
            {
              id: 1,
              nome_completo: 'Alice',
              email: 'alice@exemplo.com',
              telefone: '(11) 99999-9999',
            }
          ],
          {
            name: 'Alice',
            mail: 'alice@exemplo.com',
            phone: '(11) 99999-9999'
          }
        ],
        [
          [],
          null
        ],
      ])('should return an object with found client info', async (mockRow, expectedResult) => {
        pg.query.mockResolvedValue({ rows: mockRow });

        const result = await users.getClientById(1);

        expect(result).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith(
          "SELECT id, nome_completo, email, telefone FROM ClienteView WHERE id = $1",
          [1]
        );
      });
    });

    describe('insertClient', () => {
      it('should insert a new client into the database and return the inserted client', async () => {
        const clientData = {
          nome_completo: 'Alice',
          email: 'alice@example.com',
          telefone: '(11) 77777-7777',
          senha: '123456'
        };
        const userId = 1;

        pg.query.mockResolvedValue({ rows: [{ id: userId }] });

        const expectedResult = {
          id: userId,
          name: clientData.nome_completo,
          mail: clientData.email,
          phone: clientData.telefone,
        };

        const result = await users.insertClient(clientData);

        expect(result).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledTimes(1);
        expect(pg.query).toHaveBeenCalledWith(
          'INSERT INTO ClienteView (nome_completo, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
          [clientData.nome_completo, clientData.email, clientData.senha, clientData.telefone]
        );
      });
    });
  });

  describe('with failing', () => {
    describe('getAllClients', () => {
      it('should return an error if query fails', async () => {
        pg.query.mockRejectedValue(new Error('DB Error'));

        await expect(users.getAllClients()).rejects.toThrow('DB Error');
        expect(pg.query).toHaveBeenCalledWith(
          "SELECT id, nome_completo, email, telefone FROM ClienteView"
        );
      });
    });

    describe('getClientById', () => {
      it('should return an error', async () => {
        pg.query.mockRejectedValue(new Error('DB Error'));

        await expect(users.getClientById(1)).rejects.toThrow('DB Error');
        expect(pg.query).toHaveBeenCalledWith(
          "SELECT id, nome_completo, email, telefone FROM ClienteView WHERE id = $1",
          [1]
        );
      });
    });

    describe('insertClient', () => {
      it('should throw an error if the client insertion query fails', async () => {
        const clientData = {
          nome_completo: 'Alice',
          email: 'alice@example.com',
          telefone: '(11) 77777-7777',
          senha: '123456'
        };
        const dbError = new Error('DB Error');
        pg.query.mockRejectedValueOnce(dbError);

        await expect(users.insertClient(clientData)).rejects.toThrow('DB Error');
        expect(pg.query).toHaveBeenCalledTimes(1);
        expect(pg.query).toHaveBeenCalledWith(
          'INSERT INTO ClienteView (nome_completo, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
          [clientData.nome_completo, clientData.email, clientData.senha, clientData.telefone]
        );
      });
    });
  });
});
