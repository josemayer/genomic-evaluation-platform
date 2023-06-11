const pg = require('../../../app/config/postgres');
const exams = require('../../../app/services/exams');

jest.mock('../../../app/config/postgres', () => ({
  query: jest.fn(),
}));

describe('exams service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with passing', () => {
    describe('getAllExams', () => {
      it('should return an array of exams', async () => {
        const mockRows = [
          { id: 1, coleta_id: 1, tempo_estimado: { days: 15 } },
          { id: 2, coleta_id: 1, tempo_estimado: { days: 6 } },
        ];
        const expectedResult = [
          {
            id: mockRows[0].id,
            sample_id: mockRows[0].coleta_id,
            estimated_time: mockRows[0].tempo_estimado,
          },
          {
            id: mockRows[1].id,
            sample_id: mockRows[1].coleta_id,
            estimated_time: mockRows[1].tempo_estimado,
          }
        ];
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const allExams = await exams.getAllExams();

        expect(allExams).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame');
      });

      it('should return an empty array if no exams are found', async () => {
        const mockRows = [];
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const allExams = await exams.getAllExams();

        expect(allExams).toEqual(mockRows);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame');
      });
    });

    describe('getExamById', () => {
      it('should return an exam object when a valid ID is provided', async () => {
        const mockRows = [
          {
            id: 1,
            coleta_id: 10,
            tempo_estimado: { hours: 2 },
          },
        ];
        const expectedResult = {
          sample_id: mockRows[0].coleta_id,
          estimated_time: mockRows[0].tempo_estimado,
        };
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const exam = await exams.getExamById(1);

        expect(exam).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame WHERE id = $1', [1]);
      });

      it('should return null if the exam ID is not found', async () => {
        const mockRows = [];
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const exam = await exams.getExamById(1);

        expect(exam).toEqual(null);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame WHERE id = $1', [1]);
      });
    });

    describe('getSampleOfExam', () => {
      it('should return a sample object when a valid exam ID is provided', async () => {
        const mockRows = [
          {
            id: 1,
            cliente_id: 100,
            tipo_painel_id: 5,
            data: '2023-06-01 00:00:00',
          },
        ];
        const expectedResult = {
          id: mockRows[0].id,
          client_id: mockRows[0].cliente_id,
          panel_type_id: mockRows[0].tipo_painel_id,
          date: mockRows[0].data,
        };
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const sample = await exams.getSampleOfExam(1);

        expect(sample).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith(
          'SELECT c.* FROM exame AS e, coleta AS c WHERE e.id = $1 AND e.coleta_id = c.id',
          [1]
        );
      });

      it('should return null if the exam ID is not found', async () => {
        const mockRows = [];
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        expect(await exams.getSampleOfExam(1)).toEqual(null);
        expect(pg.query).toHaveBeenCalledWith(
          'SELECT c.* FROM exame AS e, coleta AS c WHERE e.id = $1 AND e.coleta_id = c.id',
          [1]
        );
      });
    });

    describe('getExamHistory', () => {
      it('should return an array of exam history when a valid exam ID is provided', async () => {
        const mockRows = [
          {
            usuario_id: 1,
            exame_id: 1,
            estado_do_exame: 'In Progress',
            data: '2023-06-02',
          },
          {
            usuario_id: 2,
            exame_id: 1,
            estado_do_exame: 'Completed',
            data: '2023-06-03',
          },
        ];
        const expectedResult = [
          {
            progressed_by: mockRows[0].usuario_id,
            status_name: mockRows[0].estado_do_exame,
            date: mockRows[0].data,
          },
          {
            progressed_by: mockRows[1].usuario_id,
            status_name: mockRows[1].estado_do_exame,
            date: mockRows[1].data,
          },
        ];

        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const history = await exams.getExamHistory(1);

        expect(history).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM andamento_exame WHERE exame_id = $1', [1]);
      });

      it('should return an empty array if no exam history is found', async () => {
        const mockRows = [];
        const expectedResult = [];
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const history = await exams.getExamHistory(1);

        expect(history).toEqual(expectedResult);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM andamento_exame WHERE exame_id = $1', [1]);
      });
    });
  });

  describe('with failing', () => {
    describe('getAllExams', () => {
      it('should not return exams with row object wrapper', async () => {
        const mockRows = [];
        pg.query.mockResolvedValueOnce({ rows: mockRows });

        const allExams = await exams.getAllExams();

        expect(allExams).not.toEqual({ rows: mockRows });
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame');
      });

      it('should throw an error if the query fails', async () => {
        const mockError = new Error('DB Error');
        pg.query.mockRejectedValueOnce(mockError);

        await expect(exams.getAllExams()).rejects.toThrow(mockError);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame');
      });
    });

    describe('getExamById', () => {
      it('should throw an error if the query fails', async () => {
        const mockError = new Error('DB Error');
        pg.query.mockRejectedValueOnce(mockError);

        await expect(exams.getExamById(1)).rejects.toThrow(mockError);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM exame WHERE id = $1', [1]);
      });
    });

    describe('getSampleOfExam', () => {
      it('should throw an error if the query fails', async () => {
        const mockError = new Error('DB Error');
        pg.query.mockRejectedValueOnce(mockError);

        await expect(exams.getSampleOfExam(1)).rejects.toThrow(mockError);
        expect(pg.query).toHaveBeenCalledWith(
          'SELECT c.* FROM exame AS e, coleta AS c WHERE e.id = $1 AND e.coleta_id = c.id',
          [1]
        );
      });
    });

    describe('getExamHistory', () => {
      it('should throw an error if the query fails', async () => {
        const mockError = new Error('DB Error');
        pg.query.mockRejectedValueOnce(mockError);

        await expect(exams.getExamHistory(1)).rejects.toThrow(mockError);
        expect(pg.query).toHaveBeenCalledWith('SELECT * FROM andamento_exame WHERE exame_id = $1', [1]);
      });
    });
  });
});
