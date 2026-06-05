import { Request, Response, NextFunction } from 'express';

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-Key');
  const validApiKey = process.env.CLINIC_API_KEY;

  // In development, if no API key is set in env, allow it.
  if (process.env.NODE_ENV === 'development' && !validApiKey) {
    return next();
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing X-API-Key header',
        statusCode: 401,
      },
    });
  }

  next();
};
