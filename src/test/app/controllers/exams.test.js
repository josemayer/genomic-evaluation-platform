const exams = require('../../../app/controllers/exams');
const examsService = require('../../../app/services/exams');

jest.mock('../../../app/services/exams');

describe('exams controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('listExams', () => {
    it('should return a list of exams with their history and sample', async () => {
      const mockExams = [
        { id: 1, sample_id: 1, estimated_time: { days: 15 } },
        { id: 2, sample_id: 1, estimated_time: { days: 6 } },
      ];
      const mockHistory = [
        { progressed_by: 1, status_name: 'na fila', date: '2021-01-01 00:00:00' },
        { progressed_by: 2, status_name: 'processando', date: '2021-01-02 00:00:00' },
      ];
      const mockSample = { id: 1, client_id: 3, panel_type_id: 5, date: '2020-12-31 00:00:00' };

      examsService.getAllExams.mockResolvedValue(mockExams);
      examsService.getExamHistory.mockResolvedValue(mockHistory);
      examsService.getSampleOfExam.mockResolvedValue(mockSample);

      await exams.listExams(mockRequest, mockResponse, mockNext);

      expect(examsService.getAllExams).toHaveBeenCalled();
      expect(examsService.getExamHistory).toHaveBeenCalledTimes(mockExams.length);
      expect(examsService.getSampleOfExam).toHaveBeenCalledTimes(mockExams.length);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        exams: [
          {
            id: mockExams[0].id,
            estimated_time: mockExams[0].estimated_time,
            history: mockHistory,
            sample: mockSample,
          },
          {
            id: mockExams[1].id,
            estimated_time: mockExams[1].estimated_time,
            history: mockHistory,
            sample: mockSample,
          },
        ],
        meta: {
          total: mockExams.length,
          page: 1,
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle an error and return a 500 status code', async () => {
      const mockError = new Error('Internal Server Error');

      examsService.getAllExams.mockRejectedValueOnce(mockError);

      await exams.listExams(mockRequest, mockResponse, mockNext);

      expect(examsService.getAllExams).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: mockError.message });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('examInfo', () => {
    it('should return the information of a specific exam with its history and sample', async () => {
      const mockExam = { id: 1, sample_id: 1, estimated_time: { days: 15 } };
      const mockHistory = [
        { progressed_by: 1, status_name: 'na fila', date: '2021-01-01 00:00:00' },
        { progressed_by: 2, status_name: 'processando', date: '2021-01-02 00:00:00' },
      ];
      const mockSample = { id: 1, client_id: 3, panel_type_id: 5, date: '2020-12-31 00:00:00' };

      examsService.getExamById.mockResolvedValue(mockExam);
      examsService.getExamHistory.mockResolvedValue(mockHistory);
      examsService.getSampleOfExam.mockResolvedValue(mockSample);

      mockRequest.params = { id: '1' };
      await exams.examInfo(mockRequest, mockResponse, mockNext);

      expect(examsService.getExamById).toHaveBeenCalledWith('1');
      expect(examsService.getExamHistory).toHaveBeenCalledWith('1');
      expect(examsService.getSampleOfExam).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        exam: {
          id: mockExam.id,
          estimated_time: mockExam.estimated_time,
          history: mockHistory,
          sample: mockSample,
        },
        meta: {
          total: 1,
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle an error when the exam ID is missing', async () => {
      mockRequest.params = {};
      await exams.examInfo(mockRequest, mockResponse, mockNext);

      expect(examsService.getExamById).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Required id' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle an error when the exam is not found', async () => {
      const mockExam = null;

      examsService.getExamById.mockResolvedValueOnce(mockExam);

      mockRequest.params = { id: '1' };

      await exams.examInfo(mockRequest, mockResponse, mockNext);

      expect(examsService.getExamById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle an error and return a 500 status code', async () => {
      const mockError = new Error('Internal Server Error');

      examsService.getExamById.mockRejectedValueOnce(mockError);

      mockRequest.params = { id: '1' };

      await exams.examInfo(mockRequest, mockResponse, mockNext);

      expect(examsService.getExamById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: mockError.message });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

