import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { initializeDatabase } from '../src/database/init.js';

beforeAll(async () => {
  await initializeDatabase();
});

describe('GET /api/health', () => {
  it('returns ok with uptime', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('sets an x-request-id response header', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-request-id']).toMatch(/[0-9a-f-]{36}/);
  });

  it('echoes a caller-supplied x-request-id', async () => {
    const res = await request(app).get('/api/health').set('x-request-id', 'fixed-id-1234');
    expect(res.headers['x-request-id']).toBe('fixed-id-1234');
  });
});

describe('GET /api/health/ready', () => {
  it('reports db and ai-provider checks', async () => {
    const res = await request(app).get('/api/health/ready');
    expect(res.body.checks).toHaveProperty('database');
    expect(res.body.checks).toHaveProperty('aiProvider');
    expect(res.body.checks.database.ok).toBe(true);
  });
});

describe('unknown routes', () => {
  it('returns a 404 with a JSON error envelope', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.message).toContain('Cannot GET');
  });
});
