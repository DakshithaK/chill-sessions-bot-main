import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env.js';
import { logger } from '../lib/logger.js';

const dbPath = config.DATABASE_PATH;

// Ensure data directory exists (skip for in-memory test DBs).
if (dbPath !== ':memory:') {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export const db = new sqlite3.Database(dbPath);

// Hand-rolled promise wrappers — sqlite3's (sql, params, cb) signature doesn't
// survive util.promisify cleanly under strict TS.
type SqlParam = string | number | boolean | null | Buffer;

export const dbRun = (sql: string, params: SqlParam[] = []): Promise<void> =>
  new Promise((resolve, reject) => {
    db.run(sql, params, (err) => (err ? reject(err) : resolve()));
  });

export const dbGet = <T = unknown>(sql: string, params: SqlParam[] = []): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row as T | undefined)));
  });

export const dbAll = <T = unknown>(sql: string, params: SqlParam[] = []): Promise<T[]> =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows as T[])));
  });

export interface Message {
  id: string;
  sessionId: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  metadata?: string; // JSON string for additional data
}

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  metadata?: string; // JSON string for session data
}

export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create sessions table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          message_count INTEGER DEFAULT 0,
          metadata TEXT
        )
      `,
        (err) => {
          if (err) {
            logger.error({ err }, 'Error creating sessions table');
            reject(err);
            return;
          }
        }
      );

      // Create messages table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          text TEXT NOT NULL,
          sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          metadata TEXT,
          FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
        )
      `,
        (err) => {
          if (err) {
            logger.error({ err }, 'Error creating messages table');
            reject(err);
            return;
          }
        }
      );

      // Create indexes for better performance
      db.run(
        `
        CREATE INDEX IF NOT EXISTS idx_messages_session_id 
        ON messages (session_id)
      `,
        (err) => {
          if (err) {
            logger.error({ err }, 'Error creating session_id index');
            reject(err);
            return;
          }
        }
      );

      db.run(
        `
        CREATE INDEX IF NOT EXISTS idx_messages_timestamp 
        ON messages (timestamp)
      `,
        (err) => {
          if (err) {
            logger.error({ err }, 'Error creating timestamp index');
            reject(err);
            return;
          }
        }
      );

      // Create trigger to update session updated_at and message_count
      db.run(
        `
        CREATE TRIGGER IF NOT EXISTS update_session_on_message
        AFTER INSERT ON messages
        BEGIN
          UPDATE sessions 
          SET updated_at = CURRENT_TIMESTAMP,
              message_count = message_count + 1
          WHERE id = NEW.session_id;
        END
      `,
        (err) => {
          if (err) {
            logger.error({ err }, 'Error creating trigger');
            reject(err);
            return;
          }
          logger.debug('Database tables and indexes created');
          resolve();
        }
      );
    });
  });
};

export const createSession = async (): Promise<string> => {
  const sessionId = uuidv4();
  await dbRun('INSERT INTO sessions (id) VALUES (?)', [sessionId]);
  return sessionId;
};

export const getSession = async (sessionId: string): Promise<Session | null> => {
  const session = await dbGet<Session>('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  return session ?? null;
};

export const saveMessage = async (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
  const messageId = uuidv4();
  const timestamp = new Date().toISOString();

  await dbRun(
    'INSERT INTO messages (id, session_id, text, sender, timestamp, metadata) VALUES (?, ?, ?, ?, ?, ?)',
    [
      messageId,
      message.sessionId,
      message.text,
      message.sender,
      timestamp,
      message.metadata || null,
    ]
  );

  return {
    id: messageId,
    sessionId: message.sessionId,
    text: message.text,
    sender: message.sender,
    timestamp,
    metadata: message.metadata,
  };
};

export const getMessages = async (
  sessionId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  return dbAll<Message>(
    'SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC LIMIT ? OFFSET ?',
    [sessionId, limit, offset]
  );
};

export const getRecentSessions = async (limit: number = 10): Promise<Session[]> => {
  return dbAll<Session>('SELECT * FROM sessions ORDER BY updated_at DESC LIMIT ?', [limit]);
};
