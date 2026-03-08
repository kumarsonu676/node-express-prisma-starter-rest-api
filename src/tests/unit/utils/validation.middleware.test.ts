import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../../middleware/validate.middleware';
import { mockResponse, mockNext } from '../../utils/test-utils';

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNextFn: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {},
    };
    mockRes = mockResponse();
    mockNextFn = mockNext;
    jest.clearAllMocks();
  });

  describe('body validation', () => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const middleware = validate({ body: bodySchema });

    it('should pass valid body', () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };

      middleware(mockReq as Request, mockRes as Response, mockNextFn);

      expect(mockNextFn).toHaveBeenCalledWith();
    });

    it('should fail invalid body', () => {
      mockReq.body = { email: 'invalid', password: 'short' };

      middleware(mockReq as Request, mockRes as Response, mockNextFn);

      expect(mockNextFn).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('query validation', () => {
    const querySchema = z.object({
      page: z.coerce.number().int().positive(),
      limit: z.coerce.number().int().positive().max(100),
    });

    const middleware = validate({ query: querySchema });

    it('should pass valid query', () => {
      mockReq.query = { page: '1', limit: '10' };

      middleware(mockReq as Request, mockRes as Response, mockNextFn);

      expect(mockNextFn).toHaveBeenCalledWith();
    });

    it('should fail invalid query', () => {
      mockReq.query = { page: '-1', limit: '200' };

      middleware(mockReq as Request, mockRes as Response, mockNextFn);

      expect(mockNextFn).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('params validation', () => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const middleware = validate({ params: paramsSchema });

    it('should pass valid params', () => {
      mockReq.params = { id: '550e8400-e29b-41d4-a716-446655440000' };

      middleware(mockReq as Request, mockRes as Response, mockNextFn);

      expect(mockNextFn).toHaveBeenCalledWith();
    });

    it('should fail invalid params', () => {
      mockReq.params = { id: 'invalid' };

      middleware(mockReq as Request, mockRes as Response, mockNextFn);

      expect(mockNextFn).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
