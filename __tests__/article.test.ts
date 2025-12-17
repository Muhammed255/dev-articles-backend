import { testRequest } from '../tests/testUtils';
import {ArticlePost} from '../models/article-post.model';
import User from '../models/user.model';
import { generateAuthToken } from '../middleware/check-auth';

describe('Article API Tests', () => {
  let userToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Create test user
    const user = await User.create({
      name: 'Article User',
      email: 'articleuser@test.com',
      password: 'password123',
    });

    testUserId = user['_id'];
    userToken = generateAuthToken(user['_id']);
  });

  afterAll(async () => {
    await ArticlePost.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/articles', () => {
    it('should create article with valid data', async () => {
      const res = await testRequest('post', '/api/articles', {
        title: 'Test Article',
        content: 'Article content',
      }, userToken);

      expect(res.status).toBe(201);
      expect(res.body.data.author).toBe(testUserId.toString());
    });
  });

  describe('PUT /api/articles/:id', () => {
    it('should update own article', async () => {
      const article = await ArticlePost.create({
        title: 'Update Test',
        content: 'Original content',
        author: testUserId,
      });

      const res = await testRequest('put', `/api/articles/${article['_id']}`, {
        content: 'Updated content',
      }, userToken);

      expect(res.status).toBe(200);
      expect(res.body.data.content).toBe('Updated content');
    });
  });
});