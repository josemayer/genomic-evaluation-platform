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
          "SELECT u.id, u.nome_completo, u.email, c.telefone FROM usuario AS u, cliente AS c WHERE u.id = c.usuario_id"
        );
      });
    });
  });

  describe('with failing', () => {
    describe('getAllClients', () => {
      it('should return an error', async () => {
        pg.query.mockRejectedValue(new Error('DB Error'));

        await expect(users.getAllClients()).rejects.toThrow('DB Error');
        expect(pg.query).toHaveBeenCalledWith(
          "SELECT u.id, u.nome_completo, u.email, c.telefone FROM usuario AS u, cliente AS c WHERE u.id = c.usuario_id"
        );
      });
    });
  });
});