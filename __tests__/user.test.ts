import { generateAuthToken } from "../middleware/check-auth";
import User from "../models/user.model";
import { testRequest } from "../tests/testUtils";

describe('User API Tests', () => {
  let testUser: any;
  let adminToken: string;

  beforeAll(async () => {
    // Create test admin user
    testUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });

    adminToken = generateAuthToken(testUser._id, testUser.role);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('GET /api/users', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await testRequest('get', '/api/users');
      expect(res.status).toBe(401);
    });

    it('should return users list for admin', async () => {
      const res = await testRequest('get', '/api/users', undefined, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user with valid data', async () => {
      const res = await testRequest('post', '/api/users', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'user',
      }, adminToken);

      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should reject invalid email format', async () => {
      const res = await testRequest('post', '/api/users', {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
      }, adminToken);

      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('Invalid email address');
    });
  });
});