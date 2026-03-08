import { ok, created, paginated } from '../../../utils/api-response';
import { Request } from 'express';

describe('API Response Utilities', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {
      id: 'test-request-id',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('ok', () => {
    it('should return success response with 200', () => {
      const data = { id: 1, name: 'Test' };
      ok(mockReq as Request, mockRes, data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          statusCode: 200,
          data,
        })
      );
    });

    it('should include message if provided', () => {
      const data = { id: 1 };
      ok(mockReq as Request, mockRes, data, 'Success message');

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Success message',
        })
      );
    });
  });

  describe('created', () => {
    it('should return success response with 201', () => {
      const data = { id: 1, name: 'Test' };
      created(mockReq as Request, mockRes, data);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          statusCode: 201,
          data,
        })
      );
    });

    it('should include default message', () => {
      created(mockReq as Request, mockRes, {});

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Resource created successfully',
        })
      );
    });
  });

  describe('paginated', () => {
    it('should return paginated response with meta', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      paginated(mockReq as Request, mockRes, data, 1, 10, 25);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          statusCode: 200,
          data,
          meta: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3,
          },
        })
      );
    });
  });
});
