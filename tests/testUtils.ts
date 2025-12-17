import { Response } from 'supertest';
import app from '../app';
import request from 'supertest';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export const testRequest = async (
  method: HttpMethod,
  url: string,
  body?: object,
  token?: string
): Promise<Response> => {
  const req = request(app)[method](url)
    .set('Accept', 'application/json');

  if (token) req.set('Authorization', `Bearer ${token}`);
  if (body) req.send(body);

  return req;
};