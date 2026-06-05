import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        field: err.errors[0]?.path.join('.'),
        statusCode: 422,
      },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        statusCode: 422,
      },
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Duplicate key error',
        statusCode: 409,
      },
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: statusCode === 500 ? 'Internal server error' : err.message,
      statusCode,
    },
  });
};
