import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

/**
 * Generate a random string containing numbers
 * @param length
 * @returns {string}
 */
export const generateOtp = (length) => {
  // initialize the possible characters to add to the OTP
  const digits = '0123456789';

  // initialize the otp length
  const requestedLength = length || 6;

  // initialize the OTP let
  let otp = '';

  while (otp.length < requestedLength) {
    const charIndex = crypto.randomInt(0, requestedLength);
    otp += digits[charIndex];
  }
  return otp;
};
