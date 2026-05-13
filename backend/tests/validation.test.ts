import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { initializeDatabase } from '../src/database/init.js';

beforeAll(async () => {
  await initializeDatabase();
});

describe('chat input validation', () => {
  it('rejects sessions with overly long user names', async () => {
    const res = await request(app)
      .post('/api/chat/sessions')
      .send({ userName: 'x'.repeat(500) });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/Validation failed/);
  });

  it('rejects messages to a non-UUID session id', async () => {
    const res = await request(app)
      .post('/api/chat/sessions/not-a-uuid/messages')
      .send({ text: 'hello' });
    expect(res.status).toBe(400);
    expect(res.body.error.message).toMatch(/Validation failed/);
  });

  it('rejects empty message text', async () => {
    const validUuid = '11111111-1111-4111-8111-111111111111';
    const res = await request(app)
      .post(`/api/chat/sessions/${validUuid}/messages`)
      .send({ text: '' });
    expect(res.status).toBe(400);
  });
});
