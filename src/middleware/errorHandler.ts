import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// ADD THESE MISSING FUNCTIONS:
export const successResponse = <T>(data: T, message?: string, pagination?: any): ApiResponse<T> => ({
  success: true,
  data,
  message,
  pagination
});

export const errorResponse = (message: string): ApiResponse => ({
  success: false,
  error: message
});

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  console.error('Error:', error.message);

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: error.message
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  if (error instanceof ConflictError) {
    return res.status(409).json({
      success: false,
      error: error.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

export const notFoundHandler = (req: Request, res: Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
};