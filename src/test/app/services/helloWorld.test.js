const pg = require('../../../app/config/postgres');
const helloWorld = require('../../../app/services/helloWorld');

jest.mock('../../../app/config/postgres', () => ({
  query: jest.fn(),
}));

describe('helloWorld service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('with passing', () => {
    it('should return an array of hello worlds', async () => {
      const mockRows = [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
      ];

      pg.query.mockResolvedValue({ rows: mockRows });

      const expectedResult = [
        'Hello, Alice!',
        'Hello, Bob!',
        'Hello, Charlie!',
      ];

      const result = await helloWorld.getAll();

      expect(result).toEqual(expectedResult);
      expect(pg.query).toHaveBeenCalledWith('SELECT name FROM hello_world');
    });

    it('should return an empty array when there are no hello worlds', async () => {
      pg.query.mockResolvedValue({ rows: [] });

      const result = await helloWorld.getAll();

      expect(result).toEqual([]);
      expect(pg.query).toHaveBeenCalledWith('SELECT name FROM hello_world');
    });
  });

  describe('with failing', () => {
    it('should handle query error and throw an error', async () => {
      const mockError = new Error('Database connection error');

      pg.query.mockRejectedValue(mockError);

      await expect(helloWorld.getAll()).rejects.toThrow(mockError);
      expect(pg.query).toHaveBeenCalledWith('SELECT name FROM hello_world');
    });
  });
});

