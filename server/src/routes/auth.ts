import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === adminUsername && password === adminPassword) {
    return res.json({ success: true, token: 'admin_session_token' });
  }

  return res.status(401).json({
    error: {
      code: 'UNAUTHORIZED',
      message: 'Invalid admin username or password',
      statusCode: 401,
    },
  });
});

export default router;
