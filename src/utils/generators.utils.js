import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_KEY;

if (!jwtKey) {
  throw new Error('Missing JWT');
}

export const generateJsonWebToken = (payload) => {
  return jwt.sign({ payload }, jwtKey, {
    expiresIn: '10d',
    // algorithm: 'RS256',
  });
};

export const generateCookie = (cookieName, token, req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie(cookieName, token, cookieOptions);
};
