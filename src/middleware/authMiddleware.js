import jwt from 'jsonwebtoken';

// Middleware to authenticate the user based on JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  // Verify the token using the secret
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach user information to the request object
    req.user = user;
    next();  // Call the next middleware or route handler
  });
};

export default authenticateToken;
