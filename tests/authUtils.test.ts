import { appConfig } from '../config/app-config';
import {verify} from 'jsonwebtoken';
import { generateAuthToken, verifyToken } from '../middleware/check-auth';

describe('Token Utilities', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockRole = 'user';

  describe('generateAuthToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateAuthToken(mockUserId, mockRole);
      expect(token).toBeDefined();
      
      const decoded = verify(token, appConfig.JWT_SECRET || 'my secret');
      expect(decoded).toMatchObject({
        userId: mockUserId,
        role: mockRole,
      });
    });

    it('should throw error if JWT_SECRET is missing', () => {
      const originalSecret = appConfig.JWT_SECRET;
      appConfig.JWT_SECRET = '';
      
      expect(() => generateAuthToken(mockUserId, mockRole))
        .toThrow('JWT_SECRET is not defined');
      
      appConfig.JWT_SECRET = originalSecret;
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateAuthToken(mockUserId, mockRole);
      const decoded = verifyToken(token);
      
      expect(decoded['userId']).toBe(mockUserId);
      expect(decoded['role']).toBe(mockRole);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      expect(() => verifyToken(invalidToken)).toThrow();
    });
  });
});